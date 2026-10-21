import { SignJWT, jwtVerify } from 'jose';

// Tokens de la app de finanzas.
//
// Este módulo lo importa el middleware, que corre en el runtime Edge:
// aquí no puede haber nada de Node (ni `pg`, ni `crypto` de Node). Sólo
// firma y verifica. Que la sesión siga viva en la base de datos, que el
// usuario esté activo y que su rol permita la acción lo comprueba cada
// ruta con `exigirAcceso()` (acceso.js), en el runtime de Node.
//
// Dos tokens:
//   - sesión: 7 días. Lleva el id de la fila de `sesiones`, el usuario,
//     su rol y si tiene que cambiar la contraseña.
//   - paso: 10 minutos. Entre la contraseña y el código del correo;
//     sólo sirve para validar ese código.
//
// Variable necesaria:
//   FINANZAS_JWT_SECRET  cadena aleatoria de 32+ caracteres

const EN_PRODUCCION = process.env.NODE_ENV === 'production';

// El prefijo __Host- obliga al navegador a exigir HTTPS, path=/ y que
// la cookie no tenga dominio: ningún subdominio puede pisarla. En local
// no hay HTTPS, así que ahí va sin prefijo.
export const COOKIE_SESION = EN_PRODUCCION ? '__Host-ermo_finanzas' : 'ermo_finanzas';
export const COOKIE_PASO = EN_PRODUCCION ? '__Host-ermo_finanzas_paso' : 'ermo_finanzas_paso';

export const DURACION_SESION_S = 60 * 60 * 24 * 7;   // 7 días
export const DURACION_PASO_S = 60 * 10;              // 10 minutos

function getSecret() {
    const secreto = process.env.FINANZAS_JWT_SECRET;
    if (!secreto || secreto.length < 32) {
        throw new Error('FINANZAS_JWT_SECRET falta o es demasiado corto (mínimo 32 caracteres).');
    }
    return new TextEncoder().encode(secreto);
}

async function firmar(payload, segundos) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + segundos)
        .sign(getSecret());
}

async function verificar(token, tipo) {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
        return payload.tipo === tipo ? payload : null;
    } catch {
        // Firma inválida, caducado o manipulado.
        return null;
    }
}

export function crearTokenSesion({ sid, uid, rol, cambiar }) {
    return firmar({ tipo: 'sesion', sid, uid, rol, cambiar: !!cambiar }, DURACION_SESION_S);
}

export function verificarTokenSesion(token) {
    return verificar(token, 'sesion');
}

export function crearTokenPaso({ cid, uid }) {
    return firmar({ tipo: 'paso', cid, uid }, DURACION_PASO_S);
}

export function verificarTokenPaso(token) {
    return verificar(token, 'paso');
}

/**
 * Opciones de las dos cookies.
 *
 * sameSite strict: el navegador no la manda en ninguna petición que
 * empiece en otro sitio, ni siquiera al seguir un enlace. Para una
 * herramienta privada a la que se entra escribiendo la dirección, no
 * hay ningún caso en el que haga falta.
 */
export function opcionesCookie(maxAge) {
    return {
        httpOnly: true,
        secure: EN_PRODUCCION,
        sameSite: 'strict',
        path: '/',
        maxAge,
    };
}
