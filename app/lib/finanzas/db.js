import pg from 'pg';

// Conexión a Postgres. La URL vive sólo en variables de entorno: nunca
// en el código, nunca en el repo.
//
//   DATABASE_URL=postgresql://usuario:clave@host:puerto/basedatos?sslmode=require
//
// Pensado para Supabase, y compatible con cualquier Postgres (incluido
// uno local sin SSL).
//
// IMPORTANTE en Supabase: usa la cadena del **Connection pooler** en
// modo *Transaction* (puerto 6543), no la conexión directa (5432).
// Cada función de Vercel es un proceso independiente, así que las
// conexiones directas se multiplican por cada instancia que arranque y
// agotan el límite del plan. El pooler existe justo para eso.

/** Un Postgres en la propia máquina no lleva SSL; cualquier otro sí. */
function esLocal(url) {
    try {
        const host = new URL(url).hostname;
        return host === 'localhost' || host === '127.0.0.1' || host === '::1';
    } catch {
        return false;   // ante la duda, cifrar
    }
}

// La pool se crea la primera vez que se consulta, no al importar el
// módulo. Es deliberado: si faltara DATABASE_URL, un error al importar
// tumbaría el build de TODA la web (Next recorre las rutas al
// compilar), no sólo esta herramienta. Así, sin variables configuradas,
// ermo.es se despliega con normalidad y sólo falla /interno/finanzas.
function getPool() {
    if (globalThis.__poolFinanzas) return globalThis.__poolFinanzas;

    const URL_BD = process.env.DATABASE_URL;
    if (!URL_BD) {
        throw new Error(
            'Falta DATABASE_URL. Añádela en .env.local (local) y en Vercel (producción).'
        );
    }

    // El pooler de Supabase en modo transaction no admite prepared
    // statements: cada consulta puede caer en una conexión distinta del
    // pool, así que un statement preparado en una no existe en la otra.
    const esPooler = /:6543\//.test(URL_BD) || /pooler\.supabase\.com/.test(URL_BD);

    globalThis.__poolFinanzas = new pg.Pool({
        connectionString: URL_BD,

        // Con el pooler delante, el trabajo de repartir conexiones ya lo
        // hace Supabase: aquí basta un puñado por instancia. Sin pooler
        // (Postgres local) se puede ser algo más generoso.
        max: esPooler ? 3 : 8,

        // Cierra las conexiones ociosas pronto: en serverless el proceso
        // muere sin avisar y dejar conexiones colgando desperdicia cupo.
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 10_000,

        // SSL para cualquier host que no sea local. Supabase lo exige
        // siempre, pero su cadena de conexión no incluye `sslmode` por
        // defecto: fiarse de ese parámetro dejaba la conexión sin cifrar
        // y el servidor la rechazaba.
        //
        // rejectUnauthorized: false porque el pooler presenta un
        // certificado que Node no valida contra sus CA por defecto. El
        // tráfico va cifrado igualmente.
        ssl: esLocal(URL_BD) ? false : { rejectUnauthorized: false },
    });

    // Sin este manejador, un error de red en una conexión ociosa tumba
    // el proceso entero en lugar de descartar esa conexión.
    globalThis.__poolFinanzas.on('error', (err) => {
        console.error('[finanzas/db] error en conexión ociosa:', err.message);
    });

    return globalThis.__poolFinanzas;
}

/**
 * Interfaz de template tag:
 *   sql`SELECT * FROM cuentas WHERE id = ${id}`
 *
 * Los valores viajan aparte de la consulta, así que interpolar variables
 * no abre la puerta a inyección de SQL.
 */
export const sql = async (trozos, ...valores) => {
    // Convierte `SELECT ${a}` en `SELECT $1` con los valores aparte.
    const texto = trozos.reduce(
        (acc, trozo, i) => acc + trozo + (i < valores.length ? `$${i + 1}` : ''),
        ''
    );

    const { rows } = await getPool().query({
        text: texto,
        values: valores,
        // Nombre vacío = statement anónimo, que el pooler sí admite.
        name: undefined,
    });
    return rows;
};
