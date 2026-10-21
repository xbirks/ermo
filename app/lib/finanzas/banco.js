import crypto from 'node:crypto';
import { SignJWT, importPKCS8 } from 'jose';
import { sql } from './db';
import { getCategorias } from './consultas';
import { clasificar, esTraspasoPropio } from './clasificar.mjs';

// Lectura de movimientos y saldos por Enable Banking (PSD2, sólo AIS).
//
// SÓLO LECTURA. Este módulo no llama, ni debe llamar nunca, a ningún
// endpoint de pagos de Enable Banking: la app anota, el banco ejecuta
// (ver la norma en la memoria del proyecto). La aplicación registrada en
// Enable Banking además sólo tiene el servicio "Account Information".
//
// Variables necesarias:
//   ENABLE_BANKING_APP_ID       id de la aplicación (va en la cabecera kid)
//   ENABLE_BANKING_PRIVATE_KEY  clave privada RSA en PEM (PKCS#8)

const API = 'https://api.enablebanking.com';

// Nombre de cada cuenta de la app en Enable Banking.
export const BANCOS = {
    Imagin: 'CaixaBank',
    Santander: 'Banco Santander',
};

export const REDIRECCION = 'https://ermo.es/interno/finanzas/banco';
const NOTA_IMPORTADO = 'Importado del banco.';

// --- Firma ----------------------------------------------------------

let clavePrivada;
async function getClave() {
    if (clavePrivada) return clavePrivada;
    const pem = (process.env.ENABLE_BANKING_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
    if (!pem.includes('BEGIN PRIVATE KEY')) {
        throw new Error('Falta ENABLE_BANKING_PRIVATE_KEY (el .pem entero, con BEGIN y END).');
    }
    clavePrivada = await importPKCS8(pem, 'RS256');
    return clavePrivada;
}

async function jwt() {
    const appId = process.env.ENABLE_BANKING_APP_ID;
    if (!appId) throw new Error('Falta ENABLE_BANKING_APP_ID.');
    const ahora = Math.floor(Date.now() / 1000);
    return new SignJWT({ iss: 'enablebanking.com', aud: 'api.enablebanking.com', iat: ahora, exp: ahora + 3600 })
        .setProtectedHeader({ typ: 'JWT', alg: 'RS256', kid: appId })
        .sign(await getClave());
}

/**
 * Llamada a la API. `psu` son los datos de la persona cuando está
 * delante (botón "Actualizar"): con ellos el banco no aplica el límite
 * de 4 lecturas diarias desatendidas que marca PSD2.
 */
async function llamar(metodo, ruta, { cuerpo, psu } = {}) {
    const cabeceras = { Authorization: `Bearer ${await jwt()}` };
    if (cuerpo) cabeceras['Content-Type'] = 'application/json';
    if (psu?.ip) cabeceras['Psu-Ip-Address'] = psu.ip;
    if (psu?.agente) cabeceras['Psu-User-Agent'] = psu.agente;

    const res = await fetch(API + ruta, {
        method: metodo,
        headers: cabeceras,
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
        cache: 'no-store',
    });
    const datos = await res.json().catch(() => ({}));
    if (!res.ok) {
        const detalle = datos.message || datos.error || datos.detail || `HTTP ${res.status}`;
        const err = new Error(`Enable Banking (${ruta.split('?')[0]}): ${typeof detalle === 'string' ? detalle : JSON.stringify(detalle)}`);
        err.status = res.status;
        throw err;
    }
    return datos;
}

// --- Autorización ---------------------------------------------------

/** Paso 1: pide a Enable Banking la URL del banco para autorizar. */
export async function iniciarConexion({ cuentaNombre, usuarioId }) {
    const aspsp = BANCOS[cuentaNombre];
    if (!aspsp) throw new Error(`No hay banco configurado para ${cuentaNombre}`);
    const [cuenta] = await sql`SELECT id FROM cuentas WHERE nombre = ${cuentaNombre}`;
    if (!cuenta) throw new Error(`No existe la cuenta ${cuentaNombre}`);

    // El plazo más largo que admite el banco, con un día de margen.
    const { aspsps = [] } = await llamar('GET', '/aspsps?country=ES&psu_type=personal');
    const ficha = aspsps.find((a) => a.name === aspsp);
    const segundos = Math.max(86400, (ficha?.maximum_consent_validity || 90 * 86400) - 86400);
    const validaHasta = new Date(Date.now() + segundos * 1000).toISOString();

    const state = crypto.randomBytes(24).toString('hex');
    await sql`INSERT INTO estados_banco (state, cuenta_id, usuario_id) VALUES (${state}, ${cuenta.id}::uuid, ${usuarioId}::uuid)`;

    const { url } = await llamar('POST', '/auth', {
        cuerpo: {
            access: { valid_until: validaHasta },
            aspsp: { name: aspsp, country: 'ES' },
            state,
            redirect_url: REDIRECCION,
            psu_type: 'personal',
        },
    });
    return url;
}

/** Paso 2: con el código de vuelta del banco, abre la sesión y la guarda. */
export async function completarConexion({ code, state, usuarioId }) {
    const [estado] = await sql`
        SELECT e.state, e.cuenta_id, c.nombre FROM estados_banco e JOIN cuentas c ON c.id = e.cuenta_id
        WHERE e.state = ${String(state || '')} AND e.usuario_id = ${usuarioId}::uuid
          AND e.usado_en IS NULL AND e.creado_en > now() - interval '30 minutes'
    `;
    if (!estado) throw new Error('La autorización ha caducado o no la pidió esta app. Vuelve a conectar.');
    await sql`UPDATE estados_banco SET usado_en = now() WHERE state = ${estado.state}`;

    const sesion = await llamar('POST', '/sessions', { cuerpo: { code } });
    const cuentaBanco = sesion.accounts?.[0];
    if (!cuentaBanco?.uid) throw new Error('El banco no ha devuelto ninguna cuenta.');

    // Se importa desde el último día apuntado a mano: ese día se repasa
    // entero y lo ya apuntado se enlaza en vez de duplicarse.
    const [{ desde }] = await sql`
        SELECT COALESCE(max(fecha), CURRENT_DATE) AS desde FROM transacciones
        WHERE cuenta_id = ${estado.cuenta_id}::uuid OR cuenta_destino_id = ${estado.cuenta_id}::uuid
    `;

    await sql`UPDATE conexiones_banco SET activa = false WHERE cuenta_id = ${estado.cuenta_id}::uuid AND activa`;
    const [conexion] = await sql`
        INSERT INTO conexiones_banco (cuenta_id, aspsp, session_id, account_uid, iban, valida_hasta, importar_desde)
        VALUES (${estado.cuenta_id}::uuid, ${sesion.aspsp?.name || BANCOS[estado.nombre]}, ${sesion.session_id},
                ${cuentaBanco.uid}, ${cuentaBanco.account_id?.iban || null},
                ${sesion.access?.valid_until || new Date(Date.now() + 90 * 86400000).toISOString()}::timestamptz,
                ${desde}::date)
        RETURNING *
    `;
    return { conexion, cuenta: estado.nombre, otrasCuentas: (sesion.accounts?.length || 1) - 1 };
}

// --- Lectura e importación -------------------------------------------

// Saldo contabilizado, mejor el del día (interim) que el del cierre de ayer.
const PREFERENCIA_SALDO = ['ITBD', 'CLBD', 'XPCD', 'ITAV', 'CLAV', 'OPBD'];

function conceptoDe(t) {
    const partes = [];
    for (const r of t.remittance_information || []) if (r && !partes.includes(r.trim())) partes.push(r.trim());
    const contraparte = t.credit_debit_indicator === 'DBIT' ? t.creditor?.name : t.debtor?.name;
    if (contraparte && !partes.some((p) => p.toLowerCase().includes(contraparte.toLowerCase()))) partes.push(contraparte);
    if (!partes.length && t.bank_transaction_code?.description) partes.push(t.bank_transaction_code.description);
    return (partes.join(' · ') || 'Movimiento del banco').slice(0, 300);
}

function referenciaDe(t, concepto) {
    if (t.entry_reference) return String(t.entry_reference);
    const base = [t.booking_date, t.transaction_amount?.amount, t.credit_debit_indicator, concepto].join('|');
    return 'h:' + crypto.createHash('sha256').update(base).digest('hex').slice(0, 32);
}

/**
 * Lee saldo y movimientos de una conexión e importa lo nuevo.
 * Devuelve { nuevas, enlazadas, saldoBanco, saldoApp }.
 */
export async function sincronizar(conexion, { psu } = {}) {
    try {
        const [categorias, balances] = await Promise.all([
            getCategorias(),
            llamar('GET', `/accounts/${conexion.account_uid}/balances`, { psu }),
        ]);
        const idCategoria = Object.fromEntries(categorias.map((c) => [c.nombre, c.id]));

        const lista = balances.balances || [];
        const saldo = PREFERENCIA_SALDO.map((tipo) => lista.find((b) => b.balance_type === tipo)).find(Boolean) || lista[0];
        const saldoBanco = saldo ? Number(saldo.balance_amount?.amount) : null;

        // Movimientos desde la fecha de importación (paginados).
        const desde = String(conexion.importar_desde).slice(0, 10);
        let movimientos = [];
        let continuar = null;
        for (let i = 0; i < 20; i++) {
            const q = new URLSearchParams({ date_from: desde });
            if (continuar) q.set('continuation_key', continuar);
            const pagina = await llamar('GET', `/accounts/${conexion.account_uid}/transactions?${q}`, { psu });
            movimientos = movimientos.concat(pagina.transactions || []);
            continuar = pagina.continuation_key;
            if (!continuar) break;
        }

        let nuevas = 0;
        let enlazadas = 0;
        // Sólo lo ya contabilizado: lo pendiente aún puede cambiar o anularse.
        const contabilizados = movimientos.filter((t) => (t.status || 'BOOK') === 'BOOK' && t.booking_date);
        contabilizados.sort((a, b) => a.booking_date.localeCompare(b.booking_date));

        for (const t of contabilizados) {
            const importe = Math.abs(Number(t.transaction_amount?.amount));
            if (!Number.isFinite(importe) || importe === 0) continue;
            const sale = t.credit_debit_indicator === 'DBIT';
            const concepto = conceptoDe(t);
            const ref = referenciaDe(t, concepto);
            const cid = conexion.cuenta_id;

            const [ya] = await sql`
                SELECT 1 FROM transacciones
                WHERE (cuenta_id = ${cid}::uuid AND ref_banco = ${ref})
                   OR (cuenta_destino_id = ${cid}::uuid AND ref_banco_destino = ${ref})
                UNION ALL
                SELECT 1 FROM banco_ignorados WHERE cuenta_id = ${cid}::uuid AND ref = ${ref}
                LIMIT 1
            `;
            if (ya) continue;

            // ¿Ya estaba apuntado a mano? Misma cuenta, fecha, importe y sentido.
            const [manual] = sale
                ? await sql`
                    SELECT id FROM transacciones
                    WHERE cuenta_id = ${cid}::uuid AND fecha = ${t.booking_date}::date AND importe = ${importe}::numeric
                      AND tipo_movimiento IN ('gasto', 'transferencia_interna') AND ref_banco IS NULL
                    ORDER BY creada_en LIMIT 1`
                : await sql`
                    SELECT id, (cuenta_destino_id = ${cid}::uuid) AS es_destino FROM transacciones
                    WHERE fecha = ${t.booking_date}::date AND importe = ${importe}::numeric
                      AND ((cuenta_id = ${cid}::uuid AND tipo_movimiento = 'ingreso' AND ref_banco IS NULL)
                        OR (cuenta_destino_id = ${cid}::uuid AND tipo_movimiento = 'transferencia_interna' AND ref_banco_destino IS NULL))
                    ORDER BY creada_en LIMIT 1`;
            if (manual) {
                if (manual.es_destino) {
                    await sql`UPDATE transacciones SET ref_banco_destino = ${ref} WHERE id = ${manual.id}::uuid`;
                } else {
                    await sql`UPDATE transacciones SET ref_banco = ${ref} WHERE id = ${manual.id}::uuid`;
                }
                enlazadas++;
                continue;
            }

            const propio = esTraspasoPropio(concepto);
            const categoria = propio ? null : clasificar(concepto, importe);
            await sql`
                INSERT INTO transacciones
                    (fecha, cuenta_id, categoria_id, concepto, importe, tipo_movimiento, notas, origen, ref_banco)
                VALUES (${t.booking_date}::date, ${cid}::uuid, ${categoria ? idCategoria[categoria] || null : null}::uuid,
                        ${concepto}, ${importe}::numeric, ${sale ? 'gasto' : 'ingreso'}::tipo_movimiento,
                        ${propio ? 'REVISAR: a tu nombre; puede ser un traspaso entre cuentas propias. ' + NOTA_IMPORTADO : NOTA_IMPORTADO},
                        'banco', ${ref})
            `;
            nuevas++;
        }

        // Lo que la app calculaba antes de fiarse del banco: si no coincide,
        // algo se ha importado de más o de menos y conviene saberlo.
        const [app] = await sql`SELECT saldo_actual FROM v_saldo_disponible WHERE id = ${conexion.cuenta_id}::uuid`;
        const saldoApp = app ? Number(app.saldo_actual) : null;

        // A partir de aquí el saldo de la cuenta es el del banco. Se fija a
        // su fecha de referencia: lo apuntado después se suma encima.
        if (saldoBanco !== null && Number.isFinite(saldoBanco)) {
            const fechaSaldo = saldo?.reference_date || new Date().toISOString().slice(0, 10);
            await sql`
                UPDATE cuentas SET saldo_declarado = ${saldoBanco}::numeric,
                       saldo_declarado_en = ${fechaSaldo}::date, saldo_manual = true
                WHERE id = ${conexion.cuenta_id}::uuid
            `;
        }

        await sql`
            UPDATE conexiones_banco
            SET ultima_lectura = now(), ultimo_error = NULL,
                saldo_banco = ${saldoBanco}::numeric, saldo_banco_en = now()
            WHERE id = ${conexion.id}::uuid
        `;
        const diferencia = saldoBanco !== null && saldoApp !== null
            ? Math.round((saldoBanco - saldoApp) * 100) / 100 : null;
        return { nuevas, enlazadas, saldoBanco, saldoApp, diferencia };
    } catch (error) {
        await sql`UPDATE conexiones_banco SET ultimo_error = ${String(error.message).slice(0, 500)} WHERE id = ${conexion.id}::uuid`;
        throw error;
    }
}

/** Todas las conexiones activas y vigentes. Devuelve un resultado por cuenta. */
export async function sincronizarTodas({ psu } = {}) {
    const conexiones = await sql`
        SELECT b.*, c.nombre AS cuenta FROM conexiones_banco b JOIN cuentas c ON c.id = b.cuenta_id
        WHERE b.activa AND b.valida_hasta > now() ORDER BY c.orden
    `;
    const resultados = [];
    for (const conexion of conexiones) {
        try {
            resultados.push({ cuenta: conexion.cuenta, ok: true, ...(await sincronizar(conexion, { psu })) });
        } catch (error) {
            resultados.push({ cuenta: conexion.cuenta, ok: false, error: error.message });
        }
    }
    return resultados;
}

/** Estado de cada banco para la pantalla. */
export async function estadoConexiones() {
    const filas = await sql`
        SELECT c.id AS cuenta_id, c.nombre AS cuenta, b.valida_hasta, b.ultima_lectura, b.ultimo_error,
               b.saldo_banco, b.saldo_banco_en, b.iban, b.importar_desde, v.saldo_actual AS saldo_app
        FROM cuentas c
        LEFT JOIN conexiones_banco b ON b.cuenta_id = c.id AND b.activa
        LEFT JOIN v_saldo_disponible v ON v.id = c.id
        WHERE c.nombre = ANY(${Object.keys(BANCOS)})
        ORDER BY c.orden
    `;
    return filas.map((f) => ({
        ...f,
        saldo_banco: f.saldo_banco === null ? null : Number(f.saldo_banco),
        saldo_app: f.saldo_app === null ? null : Number(f.saldo_app),
        iban: f.iban ? `···· ${f.iban.slice(-4)}` : null,
        conectada: !!f.valida_hasta && new Date(f.valida_hasta) > new Date(),
    }));
}
