import { NextResponse } from 'next/server';
import {
    getGastosFijos, guardarGastoFijo,
    desactivarGastoFijo, cargarFijosDelMes,
} from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const mes = request.nextUrl.searchParams.get('mes') || new Date().toISOString();
        return NextResponse.json(await getGastosFijos(mes));
    } catch (error) {
        console.error('[finanzas/fijos GET]', error);
        return NextResponse.json({ error: 'Error al leer los gastos fijos' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const datos = await request.json();

        // Dos operaciones: apuntar los recibos del mes de golpe, o
        // crear/editar un recibo de la lista.
        if (datos.accion === 'cargar_mes') {
            if (!datos.mes) {
                return NextResponse.json({ error: 'Falta el mes' }, { status: 400 });
            }
            const res = await cargarFijosDelMes(datos.mes, datos.seleccion);
            return NextResponse.json({ ok: true, ...res });
        }

        if (!datos.nombre || !datos.nombre.trim()) {
            return NextResponse.json({ error: 'Falta el nombre del recibo' }, { status: 400 });
        }

        const importe = Number(datos.importe_previsto);
        if (!Number.isFinite(importe) || importe <= 0) {
            return NextResponse.json(
                { error: 'El importe debe ser mayor que cero' }, { status: 400 }
            );
        }

        const cada = Number(datos.cada_meses);
        if (!Number.isInteger(cada) || cada < 1 || cada > 60) {
            return NextResponse.json(
                { error: 'La periodicidad debe estar entre 1 y 60 meses' }, { status: 400 }
            );
        }

        const dia = datos.dia_cobro ? Number(datos.dia_cobro) : null;
        if (dia !== null && (!Number.isInteger(dia) || dia < 1 || dia > 31)) {
            return NextResponse.json(
                { error: 'El día de cobro debe estar entre 1 y 31' }, { status: 400 }
            );
        }

        // Un recibo que no es mensual necesita saber desde cuándo
        // cuenta el ciclo, o no se puede calcular en qué meses toca.
        if (cada > 1 && !datos.primer_mes) {
            return NextResponse.json(
                { error: 'Un recibo que no es mensual necesita el mes en que toca por primera vez' },
                { status: 400 }
            );
        }

        const fila = await guardarGastoFijo({
            ...datos,
            nombre: datos.nombre.trim(),
            importe_previsto: importe,
            cada_meses: cada,
            dia_cobro: dia,
        });
        return NextResponse.json({ ok: true, id: fila.id });
    } catch (error) {
        console.error('[finanzas/fijos POST]', error);
        // Nombre repetido: la tabla tiene un índice único.
        if (error?.code === '23505') {
            return NextResponse.json(
                { error: 'Ya existe un recibo con ese nombre' }, { status: 400 }
            );
        }
        return NextResponse.json({ error: 'Error al guardar el recibo' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
        }
        // Se desactiva, no se borra: los movimientos de meses
        // anteriores siguen apuntando a esta categoría.
        await desactivarGastoFijo(id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/fijos DELETE]', error);
        return NextResponse.json({ error: 'Error al dar de baja el recibo' }, { status: 500 });
    }
}
