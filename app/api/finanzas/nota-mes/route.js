import { NextResponse } from 'next/server';
import { guardarNotaMes } from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

/**
 * PUT /api/finanzas/nota-mes
 *
 * Guarda por qué un mes salió como salió. Con el texto vacío, la borra.
 */
export async function PUT(request) {
    try {
        const { mes, texto } = await request.json();

        if (!mes || !/^\d{4}-\d{2}-\d{2}$/.test(mes)) {
            return NextResponse.json({ error: 'Falta el mes' }, { status: 400 });
        }
        if (typeof texto === 'string' && texto.length > 600) {
            return NextResponse.json(
                { error: 'La nota no puede pasar de 600 caracteres' }, { status: 400 }
            );
        }

        const res = await guardarNotaMes(mes, texto);
        return NextResponse.json({ ok: true, ...res });
    } catch (error) {
        console.error('[finanzas/nota-mes]', error);
        if (error?.code === '42P01') {
            return NextResponse.json(
                { error: 'Falta ejecutar db/migraciones/009-notas-del-mes.sql en Supabase' },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: 'Error al guardar la nota' }, { status: 500 });
    }
}
