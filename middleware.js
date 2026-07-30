import { NextResponse } from 'next/server';
import { COOKIE_SESION, sesionValida } from '@/app/lib/finanzas/auth';

// Puerta de entrada de /interno/finanzas.
//
// Se ejecuta antes de cualquier página o ruta de API de esa zona, así
// que no hay forma de llamar a /api/finanzas/... sin sesión válida
// aunque se conozca la URL.

const RUTA_LOGIN = '/interno/finanzas/entrar';

// Métodos que modifican datos. Son los que hay que proteger de
// peticiones lanzadas desde otro sitio.
const METODOS_ESCRITURA = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Comprueba que una petición de escritura viene de esta misma web.
 *
 * La cookie es `sameSite: lax`, lo que frena a sitios externos, pero no
 * a código que se ejecute dentro de ermo.es: para el navegador eso es el
 * mismo sitio, y viajaría con la sesión activa. Un script de terceros
 * comprometido en la web pública podría, sin esto, llamar a
 * /api/finanzas/* y borrar o alterar apuntes.
 *
 * Comparando Origin con Host se corta esa vía: un `fetch` desde el
 * navegador no puede falsear la cabecera Origin.
 */
function origenPropio(request) {
    const origin = request.headers.get('origin');
    // Sin Origin no es una petición de navegador entre sitios (curl, o
    // una llamada del mismo documento en algunos navegadores antiguos).
    if (!origin) return true;
    try {
        return new URL(origin).host === request.headers.get('host');
    } catch {
        return false;
    }
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (METODOS_ESCRITURA.has(request.method) && !origenPropio(request)) {
        return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });
    }

    // La pantalla de login y su endpoint tienen que ser accesibles sin
    // sesión, o no habría manera de entrar nunca.
    if (pathname === RUTA_LOGIN || pathname === '/api/finanzas/entrar') {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_SESION)?.value;
    const autorizado = await sesionValida(token);

    if (autorizado) return NextResponse.next();

    // Las llamadas de API reciben un 401 en JSON; redirigirlas a una
    // página HTML rompería el fetch del cliente.
    if (pathname.startsWith('/api/finanzas')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const destino = request.nextUrl.clone();
    destino.pathname = RUTA_LOGIN;
    destino.search = '';
    return NextResponse.redirect(destino);
}

export const config = {
    matcher: ['/interno/finanzas/:path*', '/api/finanzas/:path*'],
};
