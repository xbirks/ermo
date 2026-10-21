import { NextResponse } from 'next/server';
import { exigirAcceso } from '@/app/lib/finanzas/acceso';
import { iniciarConexion, BANCOS } from '@/app/lib/finanzas/banco';

export const dynamic = 'force-dynamic';

/**
 * POST /api/finanzas/banco/conectar   { cuenta: 'Imagin' | 'Santander' }
 *
 * Devuelve la URL del banco donde se autoriza la lectura. Sólo el
 * propietario: es quien tiene que entrar en su banco a confirmarlo.
 */
export async function POST(request) {
    const acceso = await exigirAcceso(request, 'escribir');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const { cuenta } = await request.json().catch(() => ({}));
        if (!BANCOS[cuenta]) {
            return NextResponse.json({ error: 'Banco no válido' }, { status: 400 });
        }
        const url = await iniciarConexion({ cuentaNombre: cuenta, usuarioId: acceso.usuario.id });
        return NextResponse.json({ url });
    } catch (error) {
        console.error('[finanzas/banco/conectar]', error);
        // El motivo ayuda a arreglarlo y no lleva secretos: es el mensaje
        // de Enable Banking o el de una variable mal configurada.
        return NextResponse.json(
            { error: `No se ha podido iniciar la conexión con el banco: ${error.message}` }, { status: 500 }
        );
    }
}
