import { NextResponse } from 'next/server';
import {
    getTransaccionesDelMes, crearTransaccion, borrarTransaccion,
    editarTransaccion,
} from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

const TIPOS = ['ingreso', 'gasto', 'transferencia_interna'];

export async function GET(request) {
    try {
        const mes = request.nextUrl.searchParams.get('mes') || new Date().toISOString();
        return NextResponse.json(await getTransaccionesDelMes(mes));
    } catch (error) {
        console.error('[finanzas/transacciones GET]', error);
        return NextResponse.json({ error: 'Error al leer los movimientos' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const datos = await request.json();

        // Validación en el servidor: el navegador puede saltarse la del
        // formulario, la base de datos no debe recibir basura.
        if (!datos.fecha) {
            return NextResponse.json({ error: 'Falta la fecha' }, { status: 400 });
        }
        if (!datos.cuenta_id) {
            return NextResponse.json({ error: 'Falta la cuenta' }, { status: 400 });
        }
        if (!TIPOS.includes(datos.tipo_movimiento)) {
            return NextResponse.json({ error: 'Tipo de movimiento no válido' }, { status: 400 });
        }
        if (!datos.concepto || !datos.concepto.trim()) {
            return NextResponse.json({ error: 'Falta el concepto' }, { status: 400 });
        }

        const importe = Number(datos.importe);
        if (!Number.isFinite(importe) || importe <= 0) {
            return NextResponse.json({ error: 'El importe debe ser mayor que cero' }, { status: 400 });
        }

        if (datos.tipo_movimiento === 'transferencia_interna') {
            if (!datos.cuenta_destino_id) {
                return NextResponse.json(
                    { error: 'Una transferencia necesita cuenta de destino' }, { status: 400 }
                );
            }
            if (datos.cuenta_destino_id === datos.cuenta_id) {
                return NextResponse.json(
                    { error: 'El origen y el destino no pueden ser la misma cuenta' }, { status: 400 }
                );
            }
        }

        const fila = await crearTransaccion({
            ...datos,
            importe,
            concepto: datos.concepto.trim(),
        });
        return NextResponse.json({ ok: true, id: fila.id }, { status: 201 });
    } catch (error) {
        console.error('[finanzas/transacciones POST]', error);
        return NextResponse.json({ error: 'Error al guardar el movimiento' }, { status: 500 });
    }
}

/**
 * PATCH /api/finanzas/transacciones
 *
 * Corrige un movimiento ya apuntado. Mismas validaciones que al
 * crearlo: la base no debe recibir basura por venir de otra vía.
 */
export async function PATCH(request) {
    try {
        const datos = await request.json();

        if (!datos.id) {
            return NextResponse.json({ error: 'Falta el movimiento' }, { status: 400 });
        }
        if (!datos.fecha) {
            return NextResponse.json({ error: 'Falta la fecha' }, { status: 400 });
        }
        if (!datos.cuenta_id) {
            return NextResponse.json({ error: 'Falta la cuenta' }, { status: 400 });
        }
        if (!TIPOS.includes(datos.tipo_movimiento)) {
            return NextResponse.json({ error: 'Tipo de movimiento no válido' }, { status: 400 });
        }
        if (!datos.concepto || !datos.concepto.trim()) {
            return NextResponse.json({ error: 'Falta el concepto' }, { status: 400 });
        }

        const importe = Number(datos.importe);
        if (!Number.isFinite(importe) || importe <= 0) {
            return NextResponse.json({ error: 'El importe debe ser mayor que cero' }, { status: 400 });
        }

        if (datos.tipo_movimiento === 'transferencia_interna') {
            if (!datos.cuenta_destino_id) {
                return NextResponse.json(
                    { error: 'Un traspaso necesita cuenta de destino' }, { status: 400 }
                );
            }
            if (datos.cuenta_destino_id === datos.cuenta_id) {
                return NextResponse.json(
                    { error: 'El origen y el destino no pueden ser la misma cuenta' }, { status: 400 }
                );
            }
        }

        await editarTransaccion({
            ...datos,
            importe,
            concepto: datos.concepto.trim(),
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/transacciones PATCH]', error);
        return NextResponse.json({ error: 'Error al corregir el movimiento' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
        }
        await borrarTransaccion(id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/transacciones DELETE]', error);
        return NextResponse.json({ error: 'Error al borrar el movimiento' }, { status: 500 });
    }
}
