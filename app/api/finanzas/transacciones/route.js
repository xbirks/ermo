import { NextResponse } from 'next/server';
import { exigirAcceso } from '@/app/lib/finanzas/acceso';
import { sql } from '@/app/lib/finanzas/db';
import {
    getTransaccionesDelMes, crearTransaccion, borrarTransaccion,
    editarTransaccion, getTransaccion,
} from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

const TIPOS = ['ingreso', 'gasto', 'transferencia_interna'];

export async function GET(request) {
    const acceso = await exigirAcceso(request, 'leer');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const mes = request.nextUrl.searchParams.get('mes') || new Date().toISOString();
        return NextResponse.json(await getTransaccionesDelMes(mes));
    } catch (error) {
        console.error('[finanzas/transacciones GET]', error);
        return NextResponse.json({ error: 'Error al leer los movimientos' }, { status: 500 });
    }
}

export async function POST(request) {
    const acceso = await exigirAcceso(request, 'apuntar');
    if (acceso.respuesta) return acceso.respuesta;

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

        // En una cuenta que se lee del banco, el movimiento llega solo:
        // apuntarlo a mano lo duplicaría. Un traspaso que la toque se hace
        // convirtiendo el movimiento que trae el banco.
        const [conectada] = await sql`
            SELECT c.nombre FROM conexiones_banco b JOIN cuentas c ON c.id = b.cuenta_id
            WHERE b.activa AND b.valida_hasta > now()
              AND b.cuenta_id IN (${datos.cuenta_id}::uuid, ${datos.cuenta_destino_id || datos.cuenta_id}::uuid)
            LIMIT 1
        `;
        if (conectada) {
            return NextResponse.json(
                { error: `${conectada.nombre} se lee del banco: sus movimientos llegan solos. Para un traspaso, edita el movimiento que trae el banco y conviértelo.` },
                { status: 409 }
            );
        }

        const fila = await crearTransaccion({
            ...datos,
            importe,
            concepto: datos.concepto.trim(),
            creada_por: acceso.usuario.id,
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
    const acceso = await exigirAcceso(request, 'anotar');
    if (acceso.respuesta) return acceso.respuesta;

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

        const actual = await getTransaccion(datos.id);
        if (!actual) {
            return NextResponse.json({ error: 'Ese movimiento no existe' }, { status: 404 });
        }
        const cambiaLoDelBanco =
            actual.fecha !== datos.fecha
            || actual.cuenta_id !== datos.cuenta_id
            || actual.concepto !== datos.concepto.trim()
            || Math.abs(actual.importe - importe) > 0.001;
        const cambiaTipo =
            actual.tipo_movimiento !== datos.tipo_movimiento
            || (actual.cuenta_destino_id || null) !== (datos.cuenta_destino_id || null);

        // Lo que viene del banco es lo que pasó: importe, fecha, cuenta y
        // concepto no se tocan, ni siquiera el propietario. Sí se puede
        // convertir en traspaso entre cuentas propias.
        if (actual.origen === 'banco' && cambiaLoDelBanco) {
            return NextResponse.json(
                { error: 'Este movimiento viene del banco: el importe, la fecha, la cuenta y el concepto no se cambian.' },
                { status: 403 }
            );
        }

        // El asistente sólo añade contexto: nota y categoría.
        if (acceso.usuario.rol !== 'propietario' && (cambiaLoDelBanco || cambiaTipo)) {
            return NextResponse.json(
                { error: 'Tu cuenta sólo puede cambiar la nota y la categoría de un movimiento.' },
                { status: 403 }
            );
        }

        await editarTransaccion({
            ...datos,
            importe,
            concepto: datos.concepto.trim(),
            modificada_por: acceso.usuario.id,
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/transacciones PATCH]', error);
        return NextResponse.json({ error: 'Error al corregir el movimiento' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const acceso = await exigirAcceso(request, 'escribir');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
        }

        // Si estaba enlazado con el banco, la siguiente lectura lo volvería
        // a traer: se apunta su referencia como descartada.
        const actual = await getTransaccion(id);
        if (actual?.ref_banco) {
            await sql`INSERT INTO banco_ignorados (cuenta_id, ref) VALUES (${actual.cuenta_id}::uuid, ${actual.ref_banco}) ON CONFLICT DO NOTHING`;
        }
        if (actual?.ref_banco_destino && actual.cuenta_destino_id) {
            await sql`INSERT INTO banco_ignorados (cuenta_id, ref) VALUES (${actual.cuenta_destino_id}::uuid, ${actual.ref_banco_destino}) ON CONFLICT DO NOTHING`;
        }

        await borrarTransaccion(id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/transacciones DELETE]', error);
        return NextResponse.json({ error: 'Error al borrar el movimiento' }, { status: 500 });
    }
}
