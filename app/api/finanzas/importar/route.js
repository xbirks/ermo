import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/finanzas/db';
import { getCuentas, getCategorias, crearTransaccion } from '@/app/lib/finanzas/consultas';
import { parseImagin, parseSantander } from '@/app/lib/finanzas/parsear-pegado';
import { clasificar, esTraspasoPropio } from '@/app/lib/finanzas/clasificar.mjs';

// Nunca se cachea: cada análisis depende de lo que se acaba de pegar.
export const dynamic = 'force-dynamic';

const NOTA_IMPORTACION = 'Importado del extracto del banco.';

/**
 * POST /api/finanzas/importar
 *
 * Analiza el texto pegado del banco: lo trocea, sugiere categoría y
 * avisa de lo que ya podría estar apuntado. No escribe nada — es la
 * vista previa que se revisa antes de guardar.
 */
export async function POST(request) {
    try {
        const { cuenta, texto, anio } = await request.json();

        if (!texto || !texto.trim()) {
            return NextResponse.json({ error: 'Pega primero el texto del extracto' }, { status: 400 });
        }
        if (cuenta !== 'Imagin' && cuenta !== 'Santander') {
            return NextResponse.json({ error: 'Elige de qué banco es el extracto' }, { status: 400 });
        }

        const filasBrutas = cuenta === 'Imagin'
            ? parseImagin(texto)
            : parseSantander(texto, anio || undefined);

        if (!filasBrutas.length) {
            return NextResponse.json({
                error: 'No he reconocido ningún movimiento en ese texto. '
                     + 'Comprueba que sea el pegado tal cual del banco, sin recortar.',
            }, { status: 422 });
        }

        const [cuentas, categorias] = await Promise.all([getCuentas(), getCategorias()]);
        const cuentaFila = cuentas.find((c) => c.nombre === cuenta);
        if (!cuentaFila) {
            return NextResponse.json({ error: `No existe la cuenta "${cuenta}"` }, { status: 400 });
        }
        const idCategoriaPorNombre = Object.fromEntries(categorias.map((c) => [c.nombre, c.id]));

        // Lo ya apuntado en el rango de fechas del pegado, para no
        // duplicar si se vuelve a pegar un tramo que se solapa con el
        // anterior. Misma fecha + mismo importe en la misma cuenta ya es
        // una coincidencia fuerte.
        const fechas = filasBrutas.map((f) => f.fecha).sort();
        const existentes = await sql`
            SELECT fecha, importe, tipo_movimiento FROM transacciones
            WHERE cuenta_id = ${cuentaFila.id}::uuid
              AND fecha BETWEEN ${fechas[0]}::date AND ${fechas[fechas.length - 1]}::date
        `;
        const clave = (fecha, importe) => `${String(fecha).slice(0, 10)}|${Number(importe).toFixed(2)}`;
        const yaApuntado = new Set(existentes.map((e) => clave(e.fecha, e.importe)));

        const filas = filasBrutas.map((f) => {
            const traspasoPropio = esTraspasoPropio(f.concepto);
            const categoriaSugerida = f.tipo ? clasificar(f.concepto, f.importe) : null;
            return {
                fecha: f.fecha,
                concepto: f.concepto,
                importe: f.importe,
                tipo_movimiento: f.tipo, // null si no se pudo deducir el signo (Imagin, apunte más antiguo del pegado)
                categoria_id: categoriaSugerida ? (idCategoriaPorNombre[categoriaSugerida] || null) : null,
                categoria_sugerida: categoriaSugerida,
                traspaso_propio: traspasoPropio,
                ya_apuntado: yaApuntado.has(clave(f.fecha, f.importe)),
            };
        });

        return NextResponse.json({
            cuenta_id: cuentaFila.id,
            cuenta_nombre: cuentaFila.nombre,
            filas,
        });
    } catch (error) {
        console.error('[finanzas/importar POST]', error);
        return NextResponse.json({ error: 'Error al analizar el texto' }, { status: 500 });
    }
}

/**
 * PUT /api/finanzas/importar
 *
 * Guarda las filas ya revisadas. Cada una se valida igual que un alta
 * manual: la base no debe recibir nada que no pasaría por el
 * formulario de uno en uno.
 */
export async function PUT(request) {
    try {
        const { cuenta_id, filas } = await request.json();

        if (!cuenta_id) {
            return NextResponse.json({ error: 'Falta la cuenta' }, { status: 400 });
        }
        if (!Array.isArray(filas) || !filas.length) {
            return NextResponse.json({ error: 'No hay nada que guardar' }, { status: 400 });
        }

        let guardados = 0;
        for (const f of filas) {
            const importe = Number(f.importe);
            if (!f.fecha || !Number.isFinite(importe) || importe <= 0) continue;
            if (f.tipo_movimiento !== 'ingreso' && f.tipo_movimiento !== 'gasto') continue;
            if (!f.concepto || !f.concepto.trim()) continue;

            await crearTransaccion({
                fecha: f.fecha,
                cuenta_id,
                categoria_id: f.categoria_id || null,
                concepto: f.concepto.trim(),
                importe,
                tipo_movimiento: f.tipo_movimiento,
                notas: NOTA_IMPORTACION,
            });
            guardados++;
        }

        return NextResponse.json({ ok: true, guardados });
    } catch (error) {
        console.error('[finanzas/importar PUT]', error);
        return NextResponse.json({ error: 'Error al guardar los movimientos' }, { status: 500 });
    }
}
