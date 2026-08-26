// Reglas de clasificación automática de movimientos bancarios.
//
// Un único sitio para las reglas: las usa tanto el importador de
// extractos oficiales (db/importar/importar.mjs, CSV/PDF descargados
// del banco) como el pegado rápido desde la app
// (app/api/finanzas/importar, texto copiado tal cual de la banca
// móvil). Si se afina una regla aquí, las dos vías la ven a la vez.

// Reglas por palabra clave sobre el concepto del banco. Lo que no
// encaje se queda sin categoría, para revisarlo a mano en la app: es
// preferible a colocarlo mal.
const REGLAS = [
    // Recibos fijos, tal como aparecen en los extractos. Lowi va antes
    // que Vodafone: llega como «Recibo Vodafone Servicios, Lowi.es», y
    // si Vodafone se comprobara primero se quedaría con todos los
    // recibos de Lowi también.
    [/netflix/i,                                    'Netflix'],
    [/lowi/i,                                       'Lowi'],
    [/vodafone/i,                                   'Vodafone'],
    [/apple\.com|itunes|iphone|renting tec/i,       'iPhone'],
    [/\bdigi\b/i,                                   'Internet Digi'],
    [/seguridad social|tgss|r\.e\.autonomos|aut[oó]nomo/i, 'Cuota autónomos'],
    [/gestor[ií]a|asesor[ií]a|xolo/i,               'Gestoría'],

    // Coche: el préstamo aparece como "PRS...", el seguro del coche
    // como Mybox, y la gasolinera habitual como Petroprix o similar.
    [/prs\d{5,}/i,                                  'Coche'],
    [/mybox/i,                                      'Seguro'],
    [/petroprix|gasolin|repsol|cepsa|shell|carburant|galp|waylet|\blb energia\b/i,
                                                    'Gasolina'],
    [/movilidad mmd|parking|aparcamient/i,          'Gastos varios'],
    [/plaza de garaje|garaje sogu|plaza garaje/i,   'Plaza de garaje'],

    // Compra y comida: los supermercados y sitios que se repiten.
    [/mercadona|consum|charter|carref|lidl|alcampo|ahorramas|supercor|aldi|makro/i,
                                                    'Comida y supervivencia'],
    [/horno|panader|casona|restaurant|\bbar\b|cafeter|kebab|pizz|burger|mcdonald|littlethai/i,
                                                    'Comida y supervivencia'],
    [/glovo|just ?eat|uber ?eats|deliveroo/i,       'Comida y supervivencia'],

    // Transporte que no es taxi (los taxis van aparte: ver esTaxi).
    [/cabify|uber(?! ?eats)|\bemt\b|metrovalencia|renfe|blablacar/i, 'Gastos varios'],

    [/hacienda|a\.?e\.?a\.?t|tributaria|impuesto|circulaci[oó]n/i, 'Impuestos'],
    [/\bseguro\b|mapfre|mutua|\baxa\b|allianz|zurich|linea directa/i, 'Seguro'],

    // Ingresos: cobros de clientes y pasarelas de pago.
    [/stripe/i,                                     'Ingresos Alergenu'],
    [/transferencia de|transf\. a su favor|transfer inmediata|weaddyou|samarucs|club esportiu/i,
                                                    'Honorarios clientes'],
    // El IVA trimestral aparece como el modelo 303.
    [/mod\.?\s?303|i\.?v\.?a\.?/i,                  'Impuestos'],
    [/movilidad acm|reint\.?cajero/i,               'Gastos varios'],
    [/veterinari|meraki vet/i,                      'Veterinario'],

    // Herramientas de trabajo y suscripciones sueltas.
    [/dondominio|namecheap|godaddy|vercel|figma|adobe|github|openai|anthropic|digitalocea/i,
                                                    'Infraestructura SaaS'],
    [/anuncios meta|meta ads|ads\.google|google ads/i, 'Anuncios VisualAit'],

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
    'movilidad', 'moeve', 'repsol', 'cepsa', 'petroprix', 'gasolin', 'lb energia',
    'farmac', 'estanc', 'peluquer', 'melenas', 'centre', 'expsfructu',
    // Comercios y transporte público que se colaban por importe:
    'decathlon', 'pollos', 'reino 64', '\\bfgv\\b', 'metro', 'renfe',
    'quinin', 'burger', 'domino', 'telepizza', 'ale-hop', 'primark',
    'zara', 'amazon', 'aliexpress', 'correos', 'ikea', 'leroy',
    // Servicios en línea y comercios con código numérico delante, que
    // parecían licencias de taxi ("329302699 Consu" es un Consum).
    'google', 'cloud', 'kinepolis', 'marina port', 'mercader',
    '\\bbk\\d', 'heron', 'stripe', 'shopify', 'notion', 'dropbox',
    '\\d+ ?consu', 'anar i tornar', 'dondominio', 'namecheap', 'godaddy',
].join('|'), 'i');

// El "nombre propio" que delata a un taxista también lo tienen frases
// genéricas del banco: "Compra Internet En Dondominio Mrdo" son dos
// palabras con mayúscula igual que "Carlos Fco Pi". Se descarta este
// verbo inicial antes de mirar si lo que queda parece un nombre.
const PREFIJO_GENERICO = /^(pago movil en|compra( internet en)?|recibo)\s+/i;

/**
 * ¿Es una carrera de taxi?
 *
 * Tras el accidente de moto hay muchos taxis en los extractos, y no
 * todos dicen "taxi": algunos taxistas facturan a nombre propio ("Amin
 * Khan", "Pedro Monfort S") o con su número de licencia.
 *
 * Reconocerlos por "importe pequeño + nombre propio" resultó ser
 * demasiado amplio: metía dentro supermercados, panaderías y hasta
 * Vodafone. Ahora se exige que el concepto diga taxi o licencia, o
 * bien que sea un nombre de persona con un importe dentro del rango
 * real de una carrera (4-8 €, con algo de margen), y nunca un
 * comercio conocido.
 */
export function esTaxi(concepto, importe) {
    if (NO_ES_TAXI.test(concepto)) return false;

    if (/\btaxi\b/i.test(concepto)) return true;
    if (/licencia\s*\d/i.test(concepto)) return true;

    // Un nombre de persona dentro del rango de una carrera. El margen
    // hasta 10 € cubre trayectos algo más largos sin tragarse compras.
    if (importe < 3.5 || importe > 10) return false;
    const nucleo = concepto.replace(PREFIJO_GENERICO, '');
    const nombrePropio = /^[A-ZÁ-Ú][a-zá-ú]+[\s-][A-ZÁ-Ú][a-zá-ú.]/.test(nucleo);
    const numeroLicencia = /^\d{6,}/.test(nucleo);
    return nombrePropio || numeroLicencia;
}

/** Nombre de la categoría sugerida, o null si no encaja en ninguna regla. */
export function clasificar(concepto, importe) {
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
 * infla los ingresos del mes con dinero que no ha entrado de fuera.
 *
 * No se decide sola cuál es la cuenta de origen o destino: se marca
 * para revisar a mano.
 */
const NOMBRE_TITULAR = /ortega montoya|andres ortega/i;

export function esTraspasoPropio(concepto) {
    return NOMBRE_TITULAR.test(concepto);
}
