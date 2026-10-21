import { NextResponse } from 'next/server';
import { exigirAcceso } from '@/app/lib/finanzas/acceso';
import { declararSaldo } from '@/app/lib/finanzas/consultas';
import { sql } from '@/app/lib/finanzas/db';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/finanzas/cuentas
 *
 * Pone a mano el saldo de una cuenta de ahorro o inversión, donde
 * sumar movimientos no da el valor real.
 */
export async function PATCH(request) {
    const acceso = await exigirAcceso(request, 'escribir');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const { id, saldo } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Falta la cuenta' }, { status: 400 });
        }

        const valor = Number(saldo);
        if (!Number.isFinite(valor)) {
            return NextResponse.json({ error: 'El saldo no es un número' }, { status: 400 });
        }
        // Un saldo negativo es posible en una cuenta corriente, pero no
        // en ahorro o inversión, que es donde se usa esto.
        if (valor < 0) {
            return NextResponse.json(
                { error: 'El saldo no puede ser negativo' }, { status: 400 }
            );
        }

        // Las cuentas conectadas toman el saldo del banco en cada lectura.
        const [conectada] = await sql`
            SELECT 1 FROM conexiones_banco WHERE cuenta_id = ${id}::uuid AND activa AND valida_hasta > now()
        `;
        if (conectada) {
            return NextResponse.json(
                { error: 'El saldo de esta cuenta viene del banco y no se escribe a mano.' }, { status: 409 }
            );
        }

        await declararSaldo(id, valor);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/cuentas PATCH]', error);
        if (error?.code === '42703') {
            return NextResponse.json(
                { error: 'Falta ejecutar db/migraciones/004-saldos-reales.sql en Supabase' },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: 'Error al guardar el saldo' }, { status: 500 });
    }
}
