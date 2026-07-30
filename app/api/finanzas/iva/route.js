import { NextResponse } from 'next/server';
import {
    getProvisionesIva, getIvaPorTrimestre,
    guardarProvisionIva, pagarTrimestreIva, deshacerPagoIva,
    borrarProvisionIva,
} from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

/** DELETE /api/finanzas/iva?id=... borra una provisión anotada. */
export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Falta el id' }, { status: 400 });
        }
        await borrarProvisionIva(id);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/iva DELETE]', error);
        return NextResponse.json({ error: 'Error al borrar el IVA' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const [provisiones, trimestres] = await Promise.all([
            getProvisionesIva(),
            getIvaPorTrimestre(),
        ]);
        return NextResponse.json({ provisiones, trimestres });
    } catch (error) {
        console.error('[finanzas/iva GET]', error);
        return NextResponse.json({ error: 'Error al leer el IVA' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const datos = await request.json();

        // Tres operaciones en el mismo endpoint: anotar el IVA de un
        // mes, liquidar un trimestre, o deshacer una liquidación
        // marcada por error.
        if (datos.accion === 'deshacer_pago') {
            if (!datos.trimestre_fiscal) {
                return NextResponse.json({ error: 'Falta el trimestre' }, { status: 400 });
            }
            await deshacerPagoIva(datos.trimestre_fiscal);
            return NextResponse.json({ ok: true });
        }

        if (datos.accion === 'pagar_trimestre') {
            if (!datos.trimestre_fiscal || !datos.fecha_pago) {
                return NextResponse.json(
                    { error: 'Para marcarlo hacen falta el trimestre y la fecha' }, { status: 400 }
                );
            }
            const res = await pagarTrimestreIva(datos);
            return NextResponse.json({ ok: true, ...res });
        }

        if (!datos.mes_referencia) {
            return NextResponse.json({ error: 'Falta el mes' }, { status: 400 });
        }
        const importe = Number(datos.importe_calculado);
        if (!Number.isFinite(importe) || importe < 0) {
            return NextResponse.json({ error: 'Importe de IVA no válido' }, { status: 400 });
        }

        const fila = await guardarProvisionIva({ ...datos, importe_calculado: importe });
        return NextResponse.json({ ok: true, id: fila.id });
    } catch (error) {
        console.error('[finanzas/iva POST]', error);
        return NextResponse.json({ error: 'Error al guardar el IVA' }, { status: 500 });
    }
}
