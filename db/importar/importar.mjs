import pg from 'pg';
import { readFileSync, existsSync } from 'node:fs';
import { leerB100 } from './leer-b100.mjs';
import { leerMyInvestor } from './leer-myinvestor.mjs';
import { leerSantander } from './leer-santander.mjs';
import { leerImagin } from './leer-imagin.mjs';
import { clasificar, esTraspasoPropio } from '../../app/lib/finanzas/clasificar.mjs';

/**
 * Vuelca los extractos de `datos-bancos/` en la base de datos.
 *
 * Uso:
 *   node db/importar/importar.mjs            → sólo muestra qué haría
 *   node db/importar/importar.mjs --escribir → lo guarda de verdad
 *
 * Por defecto no escribe nada: enseña el resumen y las clasificaciones
 * para poder revisarlas antes de tocar la base.
 *
 * No duplica: antes de insertar comprueba si ya existe un movimiento
 * con la misma fecha, cuenta e importe, así que se puede relanzar tras
 * descargar un extracto más reciente.
 */

const RAIZ = new URL('../..', import.meta.url).pathname;
const ESCRIBIR = process.argv.includes('--escribir');

// --- Conexión ---------------------------------------------------
function leerEnv() {
    // Lee DATABASE_URL de .env.local sin depender de ninguna librería.
    const ruta = `${RAIZ}/.env.local`;
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
    if (!existsSync(ruta)) {
        throw new Error('No hay DATABASE_URL ni fichero .env.local');
    }
    const linea = readFileSync(ruta, 'utf8')
        .split('\n')
        .find((l) => l.startsWith('DATABASE_URL='));
    if (!linea) throw new Error('Falta DATABASE_URL en .env.local');
    const url = linea.slice('DATABASE_URL='.length).trim();
    if (!url) throw new Error('DATABASE_URL está vacía en .env.local');
    return url;
}

const euros = (n) =>
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(n) + ' €';

// --- Programa ---------------------------------------------------
const url = leerEnv();
const pool = new pg.Pool({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

const q = async (texto, valores = []) => (await pool.query(texto, valores)).rows;

const cuentas = Object.fromEntries(
    (await q('SELECT id, nombre FROM cuentas')).map((c) => [c.nombre, c.id])
);
const categorias = Object.fromEntries(
    (await q('SELECT id, nombre FROM categorias')).map((c) => [c.nombre, c.id])
);

// Reúne lo que haya en la carpeta.
const fuentes = [];
const ficheros = {
    'datos-bancos/imagin.csv': ['Imagin', leerImagin],
    'datos-bancos/santander-hasta-2026-07-30.pdf': ['Santander', leerSantander],
    'datos-bancos/b100.csv': ['B100', leerB100],
    'datos-bancos/myinvestor.csv': ['MyInvestor', leerMyInvestor],
};

for (const [rel, [cuenta, lector]] of Object.entries(ficheros)) {
    const ruta = `${RAIZ}/${rel}`;
    if (!existsSync(ruta)) {
        console.log(`  (falta ${rel}, se omite)`);
        continue;
    }
    const datos = await lector(ruta);
    // MyInvestor devuelve `aportaciones`; los demás, `movimientos`.
    const lista = datos.movimientos || datos.aportaciones.map((a) => ({ ...a, tipo: 'ingreso' }));
    fuentes.push({ cuenta, lista, extra: datos.hucha || null });
}

// --- Traspasos entre cuentas propias -----------------------------
//
// El mismo dinero aparece dos veces cuando se mueve entre cuentas: sale
// de B100 como "-500 SP500" y entra en MyInvestor como "+500 SP500" el
// mismo día. Importar ambos diría que se gastaron 500 € y se ingresaron
// otros 500, inflando el mes por los dos lados.
//
// Se detectan por importe idéntico, signos opuestos y fechas próximas
// (una transferencia puede tardar un día en verse en la otra cuenta).
const parejas = new Set();
{
    const todos = fuentes.flatMap(({ cuenta, lista }) =>
        lista.map((m, i) => ({ ...m, cuenta, clave: `${cuenta}|${i}` }))
    );
    const dias = (a, b) =>
        Math.abs((new Date(a) - new Date(b)) / 86400000);

    for (const salida of todos.filter((m) => m.tipo === 'gasto')) {
        if (parejas.has(salida.clave)) continue;
        const entrada = todos.find((m) =>
            m.tipo === 'ingreso' &&
            m.cuenta !== salida.cuenta &&
            !parejas.has(m.clave) &&
            Math.abs(m.importe - salida.importe) < 0.01 &&
            dias(m.fecha, salida.fecha) <= 3
        );
        if (entrada) {
            parejas.add(salida.clave);
            parejas.add(entrada.clave);
        }
    }
}

// Candado contra duplicados en la propia base. La comprobación en
// memoria no basta: si el importador se ejecuta dos veces seguidas, la
// segunda parte de una lista cargada antes de que la primera acabara
// de escribir, y entran repetidos. Esto lo impide de raíz.
if (ESCRIBIR) {
    await q(`CREATE UNIQUE INDEX IF NOT EXISTS idx_transaccion_unica
             ON transacciones (fecha, cuenta_id, importe, tipo_movimiento, concepto)`)
        .catch((e) => {
            // Si ya hay duplicados, el índice no se puede crear: se
            // avisa en lugar de fallar en silencio.
            if (e?.code === '23505') {
                console.log('\n  AVISO: hay duplicados en la base. Ejecuta antes');
                console.log('  db/migraciones/008-quitar-duplicados.sql\n');
            } else throw e;
        });
}

// Lo ya importado, de una vez. Antes se consultaba por cada
// movimiento: con 1.900 apuntes eran 1.900 idas y vueltas a Supabase,
// y la importación no terminaba nunca.
const yaImportado = new Set(
    (await q(`SELECT t.fecha, t.cuenta_id, t.importe, t.tipo_movimiento
              FROM transacciones t`))
        .map((r) => {
            const f = r.fecha instanceof Date
                ? r.fecha.toISOString().slice(0, 10)
                : String(r.fecha).slice(0, 10);
            return `${f}|${r.cuenta_id}|${Number(r.importe).toFixed(2)}|${r.tipo_movimiento}`;
        })
);

console.log(`\n${ESCRIBIR ? 'IMPORTANDO' : 'SIMULACIÓN (nada se guarda)'}\n${'─'.repeat(52)}`);

let totalNuevos = 0;
let totalRepetidos = 0;
const sinCategoria = [];
const traspasosPropios = [];
const detalle = [];

for (const { cuenta, lista, extra } of fuentes) {
    const cuentaId = cuentas[cuenta];
    if (!cuentaId) {
        console.log(`  AVISO: no existe la cuenta "${cuenta}" en la base`);
        continue;
    }

    let nuevos = 0;
    let repetidos = 0;
    const porInsertar = [];

    for (const [indice, m] of lista.entries()) {
        // Un movimiento ya importado tiene la misma fecha, cuenta e
        // importe. Basta para no duplicar al relanzar con un extracto
        // más reciente.
        const clave = `${m.fecha}|${cuentaId}|${m.importe.toFixed(2)}|${m.tipo}`;
        if (yaImportado.has(clave)) { repetidos++; continue; }
        yaImportado.add(clave);

        const texto = m.conceptoOriginal || m.concepto;

        // Mitad de un traspaso entre cuentas propias: el mismo dinero
        // ya se cuenta en la otra cuenta.
        if (parejas.has(`${cuenta}|${indice}`)) {
            traspasosPropios.push(
                `${m.fecha}  ${m.tipo === 'ingreso' ? '+' : '−'}${euros(m.importe)}  ${cuenta}  ${m.concepto.slice(0, 26)}`
            );
            continue;
        }

        // El dinero que se mueve entre cuentas propias no se importa:
        // como ingreso inflaría el mes, y como traspaso necesitaría
        // saber la cuenta de origen, que el extracto no dice.
        if (esTraspasoPropio(texto)) {
            traspasosPropios.push(
                `${m.fecha}  ${m.tipo === 'ingreso' ? '+' : '−'}${euros(m.importe)}  ${cuenta}`
            );
            continue;
        }

        const nombreCat = clasificar(texto, m.importe);
        const catId = nombreCat ? categorias[nombreCat] : null;
        if (!nombreCat) sinCategoria.push(`${m.fecha}  ${m.concepto.slice(0, 40)}`);

        detalle.push({
            fecha: m.fecha, importe: m.importe, tipo: m.tipo,
            cuenta, concepto: m.concepto.slice(0, 46), categoria: nombreCat,
        });

        if (ESCRIBIR) {
            porInsertar.push([
                m.fecha, cuentaId, catId, m.concepto.slice(0, 120),
                m.importe, m.tipo, 'Importado del extracto del banco.',
            ]);
        }
        nuevos++;
    }

    // Inserción por lotes: mil INSERT sueltos tardan minutos.
    if (ESCRIBIR && porInsertar.length) {
        const TAM = 200;
        for (let i = 0; i < porInsertar.length; i += TAM) {
            const lote = porInsertar.slice(i, i + TAM);
            const valores = [];
            const marcas = lote.map((fila, j) => {
                const b = j * 7;
                valores.push(...fila);
                return `($${b+1}::date, $${b+2}::uuid, $${b+3}::uuid, $${b+4}, $${b+5}::numeric, $${b+6}, $${b+7})`;
            });
            await q(
                `INSERT INTO transacciones
                    (fecha, cuenta_id, categoria_id, concepto, importe, tipo_movimiento, notas)
                 VALUES ${marcas.join(', ')}
                 ON CONFLICT DO NOTHING`,
                valores
            );
        }
    }

    console.log(`\n  ${cuenta}`);
    console.log(`    nuevos:    ${nuevos}`);
    console.log(`    repetidos: ${repetidos} (ya estaban)`);
    if (extra) {
        console.log(`    en la Hucha: ${euros(extra.saldo)} (${extra.movimientos} traspasos internos, no se importan)`);
    }
    totalNuevos += nuevos;
    totalRepetidos += repetidos;
}

console.log(`\n${'─'.repeat(52)}`);
console.log(`  TOTAL: ${totalNuevos} nuevos, ${totalRepetidos} ya estaban`);

if (traspasosPropios.length) {
    console.log(`\n  ${traspasosPropios.length} traspasos entre cuentas propias, NO importados:`);
    for (const t of traspasosPropios.slice(0, 8)) console.log(`    ${t}`);
    if (traspasosPropios.length > 8) console.log(`    ...y ${traspasosPropios.length - 8} más`);
    console.log('    (mover dinero entre tus cuentas no es un ingreso; anótalos');
    console.log('     como traspaso en la app si quieres que cuadren los saldos)');
}

if (sinCategoria.length) {
    console.log(`\n  ${sinCategoria.length} sin categoría (se pueden clasificar en la app):`);
    for (const s of sinCategoria.slice(0, 12)) console.log(`    ${s}`);
    if (sinCategoria.length > 12) console.log(`    ...y ${sinCategoria.length - 12} más`);
}

// Informe detallado en fichero: 269 líneas no se revisan en la
// terminal, pero sí en un editor.
if (!ESCRIBIR && detalle.length) {
    const { writeFileSync } = await import('node:fs');
    const ruta = `${RAIZ}/datos-bancos/revisar-importacion.txt`;
    const porCat = {};
    for (const d of detalle) {
        const k = d.categoria || '(sin categoría)';
        (porCat[k] ||= []).push(d);
    }
    let txt = 'QUÉ SE VA A IMPORTAR\n' + '='.repeat(62) + '\n\n';
    for (const [cat, lista] of Object.entries(porCat).sort((a, b) => b[1].length - a[1].length)) {
        const suma = lista.reduce((s, d) => s + (d.tipo === 'gasto' ? d.importe : 0), 0);
        txt += `${cat}  ·  ${lista.length} movimientos  ·  ${euros(suma)} en gastos\n`;
        txt += '-'.repeat(62) + '\n';
        for (const d of lista) {
            txt += `  ${d.fecha}  ${d.tipo === 'ingreso' ? '+' : '−'}${String(d.importe.toFixed(2)).padStart(9)}  ${d.cuenta.padEnd(11)} ${d.concepto}\n`;
        }
        txt += '\n';
    }
    writeFileSync(ruta, txt);
    console.log(`\n  Informe completo en: datos-bancos/revisar-importacion.txt`);
}

if (!ESCRIBIR) {
    console.log('\n  Esto ha sido una simulación. Para guardarlo de verdad:');
    console.log('    node db/importar/importar.mjs --escribir\n');
} else {
    console.log('\n  Importado.\n');
}

await pool.end();
