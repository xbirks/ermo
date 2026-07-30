import { SignJWT, jwtVerify } from 'jose';

// Sesión de la app de finanzas.
//
// Sólo hay un usuario, así que no hay tabla de usuarios ni hashes en
// base de datos: una contraseña en variable de entorno y una cookie
// firmada que dura 30 días.
//
// Variables necesarias:
//   FINANZAS_PASSWORD    la contraseña de acceso (larga, sin reutilizar)
//   FINANZAS_JWT_SECRET  cadena aleatoria de 32+ caracteres para firmar

export const COOKIE_SESION = 'ermo_finanzas_sesion';
const DURACION_SESION = '30d';

function getSecret() {
    const secreto = process.env.FINANZAS_JWT_SECRET;
    if (!secreto || secreto.length < 32) {
        throw new Error(
            'FINANZAS_JWT_SECRET falta o es demasiado corto (mínimo 32 caracteres).'
        );
    }
    return new TextEncoder().encode(secreto);
}

/**
 * Compara dos cadenas en tiempo constante.
 *
 * Un `===` normal corta en cuanto encuentra el primer carácter
 * distinto, y ese tiempo distinto es medible. Comparando siempre
 * todos los caracteres no se filtra nada por la duración.
 */
function comparaSegura(a, b) {
    const ba = new TextEncoder().encode(a);
    const bb = new TextEncoder().encode(b);
    // Longitudes distintas: seguimos recorriendo para no delatar cuál.
    let distinto = ba.length ^ bb.length;
    const max = Math.max(ba.length, bb.length);
    for (let i = 0; i < max; i++) {
        distinto |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
    }
    return distinto === 0;
}

export function passwordCorrecta(intento) {
    const real = process.env.FINANZAS_PASSWORD;
    if (!real) {
        throw new Error('FINANZAS_PASSWORD no está configurada.');
    }
    if (typeof intento !== 'string' || intento.length === 0) return false;
    return comparaSegura(intento, real);
}

export async function crearSesion() {
    return new SignJWT({ acceso: 'finanzas' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(DURACION_SESION)
        .sign(getSecret());
}

/** Devuelve true sólo si el token está bien firmado y sin caducar. */
export async function sesionValida(token) {
    if (!token) return false;
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload.acceso === 'finanzas';
    } catch {
        // Firma inválida, caducado o manipulado: fuera.
        return false;
    }
}

export const OPCIONES_COOKIE = {
    httpOnly: true,                 // el JavaScript del navegador no la ve
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,      // 30 días
};
