import { NextResponse } from 'next/server';
import { COOKIE_SESION, verificarTokenSesion } from '@/app/lib/finanzas/auth';

// Puerta de entrada de /interno/finanzas (primera capa).
//
// Corre en el runtime Edge, así que sólo comprueba la firma del token:
// rápido y sin base de datos. La segunda capa está en cada ruta de la
// API (`exigirAcceso`), que mira en la base que la sesión siga abierta,
// que el usuario esté activo y que su rol permita la acción. Si esta
// capa fallara, la otra sigue en pie.

const RUTA_LOGIN = '/interno/finanzas/entrar';
const RUTA_CAMBIAR = '/interno/finanzas/contrasena';

// Accesibles sin sesión: sin ellas no habría manera de entrar.
//
// /interno/finanzas/banco es la vuelta del banco tras autorizar. Llega
// desde otra web, y la cookie sameSite=strict no viaja en esa
// navegación: si se exigiera sesión aquí, el código del banco se
// perdería en la redirección al login. La página no trae datos por sí
// misma; los pide a la API, que sí exige sesión.
const PUBLICAS = new Set([
    RUTA_LOGIN, '/interno/finanzas/banco',
    '/api/finanzas/entrar', '/api/finanzas/entrar/codigo',
]);

// La API del asistente se autentica con su clave (Authorization:
// Bearer), no con cookie. La comprueba cada ruta con exigirClave().
const PREFIJO_BOT = '/api/finanzas/bot/';

// Lo único que puede hacer una sesión con contraseña temporal.
const PERMITIDAS_AL_CAMBIAR = new Set([RUTA_CAMBIAR, '/api/finanzas/contrasena', '/api/finanzas/entrar']);

const METODOS_ESCRITURA = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Comprueba que una petición de escritura viene de esta misma web.
 *
 * Además de sameSite=strict en la cookie: un script de terceros
 * comprometido dentro de ermo.es es "el mismo sitio" para el navegador.
 * Comparando Origin con Host se corta esa vía, porque un `fetch` desde
 * el navegador no puede falsear la cabecera Origin.
 */
function origenPropio(request) {
    const origin = request.headers.get('origin');
    if (!origin) return true;
    try {
        return new URL(origin).host === request.headers.get('host');
    } catch {
        return false;
    }
}

/** Cabeceras para que nada de esta zona se cachee, se incruste ni se filtre. */
function blindar(respuesta) {
    const h = respuesta.headers;
    h.set('Cache-Control', 'no-store, max-age=0');
    h.set('X-Frame-Options', 'DENY');
    h.set('Content-Security-Policy', "frame-ancestors 'none'");
    h.set('Referrer-Policy', 'no-referrer');
    h.set('X-Content-Type-Options', 'nosniff');
    h.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return respuesta;
}

const json = (cuerpo, status) => blindar(NextResponse.json(cuerpo, { status }));

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const esApi = pathname.startsWith('/api/finanzas');

    if (METODOS_ESCRITURA.has(request.method) && !origenPropio(request)) {
        return json({ error: 'Origen no permitido' }, 403);
    }

    if (PUBLICAS.has(pathname)) return blindar(NextResponse.next());
    if (pathname.startsWith(PREFIJO_BOT)) {
        // Sin cabecera Authorization ni siquiera llega a la ruta.
        if (!/^Bearer efz_[A-Za-z0-9]{40}$/.test(request.headers.get('authorization') || '')) {
            return json({ error: 'No autorizado' }, 401);
        }
        return blindar(NextResponse.next());
    }

    const sesion = await verificarTokenSesion(request.cookies.get(COOKIE_SESION)?.value);

    if (!sesion) {
        if (esApi) return json({ error: 'No autorizado' }, 401);
        const destino = request.nextUrl.clone();
        destino.pathname = RUTA_LOGIN;
        destino.search = '';
        return blindar(NextResponse.redirect(destino));
    }

    // Contraseña temporal: sólo la pantalla de cambio.
    if (sesion.cambiar && !PERMITIDAS_AL_CAMBIAR.has(pathname)) {
        if (esApi) return json({ error: 'Tienes que cambiar la contraseña antes de seguir.', cambiarPassword: true }, 403);
        const destino = request.nextUrl.clone();
        destino.pathname = RUTA_CAMBIAR;
        destino.search = '';
        return blindar(NextResponse.redirect(destino));
    }

    // El asistente nunca borra datos. Se para aquí, sin llegar a la ruta.
    // Cerrar sus propias sesiones sí puede.
    const cerrarSesion = pathname === '/api/finanzas/entrar' || pathname === '/api/finanzas/sesiones';
    if (sesion.rol !== 'propietario' && request.method === 'DELETE' && esApi && !cerrarSesion) {
        return json({ error: 'Tu cuenta no puede borrar.' }, 403);
    }

    return blindar(NextResponse.next());
}

export const config = {
    matcher: ['/interno/finanzas/:path*', '/api/finanzas/:path*'],
};
