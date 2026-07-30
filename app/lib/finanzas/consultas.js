import { sql } from './db';

// Consultas de lectura y escritura de la app.
//
// Nota sobre importes: Postgres devuelve NUMERIC como string para no
// perder precisión. Se convierte a número en el borde (aquí) y no en
// los componentes, para que la interfaz reciba siempre números.

const num = (v) => (v === null || v === undefined ? 0 : Number(v));

/** Primer día del mes, en formato YYYY-MM-DD. */
export function primerDiaDelMes(fecha) {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

// -------------------------------------------------------------
// CUENTAS
// -------------------------------------------------------------

/**
 * Saldos con la distinción que importa: lo que dice el banco frente a
 * lo que realmente puedes gastar, una vez apartado el IVA retenido y
 * las reservas activas.
 */
export async function getCuentas() {
    const filas = await sql`
        SELECT id, nombre, tipo, saldo_actual, iva_retenido, reservado, disponible
        FROM v_saldo_disponible
        ORDER BY (SELECT orden FROM cuentas c WHERE c.id = v_saldo_disponible.id)
    `;
    return filas.map((f) => ({
        ...f,
        saldo_actual: num(f.saldo_actual),
        iva_retenido: num(f.iva_retenido),
        reservado: num(f.reservado),
        disponible: num(f.disponible),
    }));
}

export async function getCategorias() {
    const filas = await sql`
        SELECT id, nombre, es_fijo, importe_previsto
        FROM categorias
        ORDER BY es_fijo DESC, nombre ASC
    `;
    return filas.map((f) => ({ ...f, importe_previsto: f.importe_previsto === null ? null : num(f.importe_previsto) }));
}

// -------------------------------------------------------------
// TRANSACCIONES
// -------------------------------------------------------------

export async function getTransaccionesDelMes(mes) {
    const inicio = primerDiaDelMes(mes);
    const filas = await sql`
        SELECT
            t.id, t.fecha, t.concepto, t.importe, t.tipo_movimiento, t.notas,
            c.nombre  AS cuenta,
            cd.nombre AS cuenta_destino,
            cat.nombre AS categoria,
            cat.es_fijo
        FROM transacciones t
        JOIN cuentas c           ON c.id = t.cuenta_id
        LEFT JOIN cuentas cd     ON cd.id = t.cuenta_destino_id
        LEFT JOIN categorias cat ON cat.id = t.categoria_id
        WHERE t.fecha >= ${inicio}::date
          AND t.fecha <  (${inicio}::date + INTERVAL '1 month')
        ORDER BY t.fecha DESC, t.creada_en DESC
    `;
    return filas.map((f) => ({ ...f, importe: num(f.importe) }));
}

export async function crearTransaccion(datos) {
    const {
        fecha, cuenta_id, cuenta_destino_id, categoria_id,
        concepto, importe, tipo_movimiento, notas,
    } = datos;

    const esTransferencia = tipo_movimiento === 'transferencia_interna';

    const [fila] = await sql`
        INSERT INTO transacciones
            (fecha, cuenta_id, cuenta_destino_id, categoria_id,
             concepto, importe, tipo_movimiento, notas)
        VALUES (
            ${fecha}::date,
            ${cuenta_id}::uuid,
            ${esTransferencia ? cuenta_destino_id : null}::uuid,
            ${categoria_id || null}::uuid,
            ${concepto},
            ${importe}::numeric,
            ${tipo_movimiento}::tipo_movimiento,
            ${notas || null}
        )
        RETURNING id
    `;
    return fila;
}

export async function borrarTransaccion(id) {
    await sql`DELETE FROM transacciones WHERE id = ${id}::uuid`;
}

// -------------------------------------------------------------
// IVA
// El IVA se devenga por mes y se paga por trimestre. Estas consultas
// mantienen las dos vistas: el detalle mensual y el total del
// trimestre que toca liquidar.
// -------------------------------------------------------------

export async function getProvisionesIva() {
    const filas = await sql`
        SELECT
            p.id, p.mes_referencia, p.importe_calculado, p.estado,
            p.trimestre_fiscal, p.fecha_pago, p.notas,
            c.nombre AS cuenta
        FROM provisiones_iva p
        LEFT JOIN cuentas c ON c.id = p.cuenta_id
        ORDER BY p.mes_referencia DESC
    `;
    return filas.map((f) => ({ ...f, importe_calculado: num(f.importe_calculado) }));
}

/**
 * Lo retenido agrupado por trimestre. Es la cifra que en las hojas
 * aparece como "452 + 452 + 525 = 1429€": lo que hay que tener listo
 * para Hacienda cuando venga la liquidación.
 */
export async function getIvaPorTrimestre() {
    const filas = await sql`
        SELECT
            trimestre_fiscal,
            SUM(importe_calculado) AS total,
            COUNT(*)               AS meses,
            SUM(CASE WHEN estado = 'retenido' THEN importe_calculado ELSE 0 END) AS pendiente
        FROM provisiones_iva
        GROUP BY trimestre_fiscal
        ORDER BY trimestre_fiscal DESC
    `;
    return filas.map((f) => ({
        ...f,
        total: num(f.total),
        pendiente: num(f.pendiente),
        meses: Number(f.meses),
    }));
}

export async function guardarProvisionIva({ mes_referencia, importe_calculado, cuenta_id, notas }) {
    const mes = primerDiaDelMes(mes_referencia);
    // Un solo apunte de IVA por mes: si se vuelve a guardar, se actualiza.
    const [fila] = await sql`
        INSERT INTO provisiones_iva (mes_referencia, importe_calculado, cuenta_id, notas)
        VALUES (${mes}::date, ${importe_calculado}::numeric, ${cuenta_id || null}::uuid, ${notas || null})
        ON CONFLICT (mes_referencia) DO UPDATE
            SET importe_calculado = EXCLUDED.importe_calculado,
                cuenta_id         = EXCLUDED.cuenta_id,
                notas             = EXCLUDED.notas
        RETURNING id
    `;
    return fila;
}

/**
 * Marca pagado un trimestre completo y registra el gasto real en la
 * cuenta desde la que sale el dinero. Las dos cosas van juntas: si el
 * gasto no se apunta, el saldo del banco y el de la app se separan.
 */
export async function pagarTrimestreIva({ trimestre_fiscal, fecha_pago, cuenta_id }) {
    const [{ total } = { total: 0 }] = await sql`
        SELECT SUM(importe_calculado) AS total
        FROM provisiones_iva
        WHERE trimestre_fiscal = ${trimestre_fiscal} AND estado = 'retenido'
    `;
    const importe = num(total);
    if (importe <= 0) return { pagado: 0 };

    await sql`
        UPDATE provisiones_iva
        SET estado = 'pagado_hacienda', fecha_pago = ${fecha_pago}::date
        WHERE trimestre_fiscal = ${trimestre_fiscal} AND estado = 'retenido'
    `;

    await sql`
        INSERT INTO transacciones
            (fecha, cuenta_id, categoria_id, concepto, importe, tipo_movimiento)
        VALUES (
            ${fecha_pago}::date,
            ${cuenta_id}::uuid,
            (SELECT id FROM categorias WHERE nombre = 'Impuestos'),
            ${'Liquidación IVA ' + trimestre_fiscal},
            ${importe}::numeric,
            'gasto'
        )
    `;
    return { pagado: importe };
}

// -------------------------------------------------------------
// RESERVAS
// Dinero intocable con el motivo escrito al lado.
// -------------------------------------------------------------

export async function getReservas() {
    const filas = await sql`
        SELECT r.id, r.concepto, r.importe, r.motivo, r.estado,
               r.creada_en, r.liberada_en, c.nombre AS cuenta
        FROM reservas r
        JOIN cuentas c ON c.id = r.cuenta_id
        ORDER BY r.estado ASC, r.creada_en DESC
    `;
    return filas.map((f) => ({ ...f, importe: num(f.importe) }));
}

export async function crearReserva({ concepto, importe, cuenta_id, motivo }) {
    const [fila] = await sql`
        INSERT INTO reservas (concepto, importe, cuenta_id, motivo)
        VALUES (${concepto}, ${importe}::numeric, ${cuenta_id}::uuid, ${motivo || null})
        RETURNING id
    `;
    return fila;
}

export async function liberarReserva(id) {
    await sql`
        UPDATE reservas
        SET estado = 'liberada', liberada_en = CURRENT_DATE
        WHERE id = ${id}::uuid AND estado = 'activa'
    `;
}

// -------------------------------------------------------------
// RESUMEN MENSUAL EN CASCADA
// -------------------------------------------------------------

/**
 * Devuelve el mes en el mismo orden que la hoja de papel: ingresos
 * arriba, restas encajadas una debajo de otra, total limpio, y el
 * reparto aparte porque ocurre después.
 */
export async function getResumenMes(mes) {
    const inicio = primerDiaDelMes(mes);

    const [resumen] = await sql`
        SELECT * FROM v_resumen_mensual WHERE mes = ${inicio}::date
    `;

    // Desglose de gastos fijos por categoría, para ver el bloque de
    // 512€ partido en gestoría / seguro / coche / Digi.
    const desglose = await sql`
        SELECT COALESCE(cat.nombre, 'Sin categoría') AS categoria,
               cat.es_fijo,
               SUM(t.importe) AS total
        FROM transacciones t
        LEFT JOIN categorias cat ON cat.id = t.categoria_id
        WHERE t.tipo_movimiento = 'gasto'
          AND t.fecha >= ${inicio}::date
          AND t.fecha <  (${inicio}::date + INTERVAL '1 month')
        GROUP BY cat.nombre, cat.es_fijo
        ORDER BY cat.es_fijo DESC NULLS LAST, SUM(t.importe) DESC
    `;

    const vacio = {
        mes: inicio,
        ingresos_banco: 0, ingresos_efectivo: 0, ingresos_totales: 0,
        gastos_fijos: 0, gastos_variables: 0, iva_provisionado: 0,
        total_limpio: 0, a_ahorro_inversion: 0,
    };

    const base = resumen
        ? Object.fromEntries(
              Object.entries(resumen).map(([k, v]) => [k, k === 'mes' ? v : num(v)])
          )
        : vacio;

    return {
        ...base,
        desglose: desglose.map((d) => ({ ...d, total: num(d.total) })),
    };
}

/** Meses con movimientos, para el selector. */
export async function getMesesDisponibles() {
    const filas = await sql`
        SELECT DISTINCT date_trunc('month', fecha)::date AS mes
        FROM transacciones
        ORDER BY mes DESC
    `;
    return filas.map((f) => f.mes);
}
