import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    passwordCorrecta, crearSesion, COOKIE_SESION, OPCIONES_COOKIE,
} from '@/app/lib/finanzas/auth';

// Único endpoint accesible sin sesión. Comprueba la contraseña y
// entrega la cookie firmada.

export async function POST(request) {
    try {
        const { password } = await request.json();

        if (!passwordCorrecta(password)) {
            // Retardo fijo: hace que probar contraseñas por fuerza bruta
            // sea lento, y no revela si el fallo fue por formato o por
            // contraseña incorrecta.
            await new Promise((r) => setTimeout(r, 600));
            return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
        }

        const token = await crearSesion();
        cookies().set(COOKIE_SESION, token, OPCIONES_COOKIE);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/entrar]', error);
        return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
    }
}

export async function DELETE() {
    cookies().delete(COOKIE_SESION);
    return NextResponse.json({ ok: true });
}
