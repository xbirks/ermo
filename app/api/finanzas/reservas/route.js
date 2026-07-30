import { NextResponse } from 'next/server';
import { getReservas, crearReserva, liberarReserva } from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        return NextResponse.json(await getReservas());
    } catch (error) {
        console.error('[finanzas/reservas GET]', error);
        return NextResponse.json({ error: 'Error al leer las reservas' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const datos = await request.json();
        if (!datos.concepto || !datos.concepto.trim()) {
            return NextResponse.json({ error: 'Falta el concepto' }, { status: 400 });
        }
        if (!datos.cuenta_id) {
            return NextResponse.json({ error: 'Falta la cuenta' }, { status: 400 });
        }
        const importe = Number(datos.importe);
        if (!Number.isFinite(importe) || importe <= 0) {
            return NextResponse.json({ error: 'El importe debe ser mayor que cero' }, { status: 400 });
        }

        const fila = await crearReserva({ ...datos, importe, concepto: datos.concepto.trim() });
        return NextResponse.json({ ok: true, id: fila.id }, { status: 201 });
    } catch (error) {
        console.error('[finanzas/reservas POST]', error);
        return NextResponse.json({ error: 'Error al guardar la reserva' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
        }
        await liberarReserva(id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/reservas PATCH]', error);
        return NextResponse.json({ error: 'Error al liberar la reserva' }, { status: 500 });
    }
}
