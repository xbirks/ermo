import pg from 'pg';
import { readFileSync, existsSync } from 'node:fs';
import { leerB100 } from './leer-b100.mjs';
import { leerMyInvestor } from './leer-myinvestor.mjs';
import { leerSantander } from './leer-santander.mjs';
import { leerImagin } from './leer-imagin.mjs';

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

// --- Clasificación ----------------------------------------------
// Reglas por palabra clave sobre el concepto del banco. Lo que no
// encaje se queda sin categoría, para revisarlo a mano en la app: es
// preferible a colocarlo mal.
const REGLAS = [
    // Recibos fijos, tal como aparecen en los extractos.
    [/netflix/i,                                    'Netflix'],
    [/vodafone/i,                                   'Vodafone'],
    [/lowi/i,                                       'Lowi'],
    [/apple\.com|itunes|iphone/i,                   'iPhone'],
    [/\bdigi\b/i,                                   'Internet Digi'],
    [/seguridad social|tgss|aut[oó]nomo/i,          'Cuota autónomos'],
    [/gestor[ií]a|asesor[ií]a/i,                    'Gestoría'],

    // Coche: el renting aparece como "Renting Tec.", y la gasolinera
    // habitual como "Petroprix".
    [/renting|petroprix|gasolin|repsol|cepsa|shell|carburant|galp/i, 'Coche'],
    [/movilidad mmd|parking|aparcamient|garaje/i,   'Coche'],

    // Compra y comida: los supermercados y sitios que se repiten.
    [/mercadona|consum|charter|carref|lidl|alcampo|ahorramas|supercor/i,
                                                    'Comida y supervivencia'],
    [/horno|panader|casona|restaurant|\bbar\b|cafeter|kebab|pizz|burger|mcdonald/i,
                                                    'Comida y supervivencia'],
    [/glovo|just ?eat|uber ?eats|deliveroo/i,       'Comida y supervivencia'],

    // Transporte que no es taxi (los taxis van aparte: ver esTaxi).
    [/cabify|uber(?! ?eats)|\bemt\b|metrovalencia|renfe|blablacar/i, 'Gastos varios'],

    [/hacienda|a\.?e\.?a\.?t|tributaria|impuesto|circulaci[oó]n/i, 'Impuestos'],
    [/seguro|mapfre|mutua|\baxa\b|allianz|zurich|linea directa/i,  'Seguro'],

    // Ingresos: cobros de clientes y pasarelas de pago.
    [/stripe|transferencia de|transf\. a su favor|transfer inmediata/i,
                                                    'Honorarios clientes'],
    // Xolo factura los servicios de autónomo.
    [/xolo/i,                                       'Gestoría'],
    // El IVA trimestral aparece como el modelo 303.
    [/mod\.?\s?303|i\.?v\.?a\.?/i,                  'Impuestos'],
    // Repsol Waylet es la gasolinera; MyBox, el renting del coche.
    [/waylet|mybox/i,                               'Coche'],
    [/movilidad acm|reint\.?cajero/i,               'Gastos varios'],

    // Herramientas de trabajo y suscripciones sueltas.
    [/dondominio|namecheap|godaddy|vercel|figma|adobe|github|openai|anthropic/i,
                                                    'Gastos varios'],

    // Ocio.
    [/kinepolis|cinesa|yelmo|spotify|hbo|disney|filmin|prime video/i, 'Gastos varios'],
];

// Comercios que nunca son un taxi por mucho que el importe encaje.
// Sin esta lista, "Consum", "Apple.com/bill" o un Starbucks caían
// dentro sólo por costar cinco euros y llevar un nombre propio.
const NO_ES_TAXI = new RegExp([
    'consum', 'mercadona', 'charter', 'carref', 'lidl', 'super',
    'horno', 'forn', 'panader', 'verdur', 'fruter', 'pescader', 'carnicer',
    'starbuk', 'starbucks', 'cafe', 'bar ', 'restaurant', 'kebab', 'pizz',
    'apple', 'paypal', 'vodafone', 'lowi', 'netflix', 'digitalocea',
    'movilidad', 'moeve', 'repsol', 'cepsa', 'petroprix', 'gasolin',
    'farmac', 'estanc', 'peluquer', 'melenas', 'centre', 'expsfructu',
    // Comercios y transporte público que se colaban por importe:
    'decathlon', 'pollos', 'reino 64', '\\bfgv\\b', 'metro', 'renfe',
    'quinin', 'burger', 'domino', 'telepizza', 'ale-hop', 'primark',
    'zara', 'amazon', 'aliexpress', 'correos', 'ikea', 'leroy',
    // Servicios en línea y comercios con código numérico delante, que
    // parecían licencias de taxi ("329302699 Consu" es un Consum).
    'google', 'cloud', 'kinepolis', 'marina port', 'mercader',
    '\\bbk\\d', 'heron', 'stripe', 'shopify', 'notion', 'dropbox',
    '\\d+ ?consu', 'anar i tornar',
].join('|'), 'i');

/**
 * ¿Es una carrera de taxi?
 *
 * Tras el accidente de moto hay muchos taxis en los extractos, y no
 * todos dicen "taxi": algunos taxistas facturan a nombre propio ("Amin
 * Khan", "Pedro Monfort S") o con su número de licencia.
 *
 * Reconocerlos por "importe pequeño + nombre propio" resultó ser
 * demasiado amplio: metía dentro supermercados, panaderías y hasta
 * Vodafone, y disparaba el total de 280 € a 813 €. Ahora se exige que
 * el concepto diga taxi o licencia, o bien que sea un nombre de persona
 * con un importe dentro del rango real de una carrera (4-8 €, con algo
 * de margen), y nunca un comercio conocido.
 */
function esTaxi(concepto, importe) {
    if (NO_ES_TAXI.test(concepto)) return false;

    // Lo que se identifica solo, sin depender del importe.
    if (/\btaxi\b/i.test(concepto)) return true;
    if (/licencia\s*\d/i.test(concepto)) return true;

    // Un nombre de persona dentro del rango de una carrera. El margen
    // hasta 10 € cubre trayectos algo más largos sin tragarse compras.
    if (importe < 3.5 || importe > 10) return false;
    const nombrePropio = /^[A-ZÁ-Ú][a-zá-ú]+[\s-][A-ZÁ-Ú][a-zá-ú.]/.test(concepto);
    const numeroLicencia = /^\d{6,}/.test(concepto);
    return nombrePropio || numeroLicencia;
}

function clasificar(concepto, importe) {
    // Los taxis se comprueban antes que las reglas generales: si no,
    // "Pedro Monfort S" no encajaría en ninguna y quedaría suelto.
    if (esTaxi(concepto, importe)) return 'Taxis del accidente';

    for (const [patron, categoria] of REGLAS) {
        if (patron.test(concepto)) return categoria;
    }
    return null;
}

/**
 * ¿Es dinero moviéndose entre cuentas propias?
 *
 * "Transferencia Inmediata De Andres Ortega Montoya" no es un ingreso:
 * es dinero que ya estaba en otra cuenta. Importarlo como ingreso
 * inflaría los ingresos del mes con dinero que no ha entrado de fuera,
 * y el total limpio saldría más alto de lo real.
 *
 * Estos movimientos se marcan para revisarlos a mano: la app no puede
 * saber de qué cuenta salieron, y un traspaso necesita origen y destino.
 */
const NOMBRE_TITULAR = /ortega montoya|andres ortega/i;

function esTraspasoPropio(concepto) {
    return NOMBRE_TITULAR.test(concepto);
}

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
