import { sql } from './db';

// Consultas de lectura y escritura de la app.
//
// Nota sobre importes: Postgres devuelve NUMERIC como string para no
// perder precisión. Se convierte a número en el borde (aquí) y no en
// los componentes, para que la interfaz reciba siempre números.

const num = (v) => (v === null || v === undefined ? 0 : Number(v));

/**
 * Código de Postgres para "esa columna no existe".
 *
 * Se usa para tolerar que una migración aún no esté aplicada: la
 * pantalla sigue funcionando con lo que sí hay, en lugar de caerse
 * entera. Sin esto, subir código nuevo antes de migrar deja la app
 * inservible en vez de degradarla.
 */
const COLUMNA_INEXISTENTE = '42703';


/** Primer día del mes, en formato YYYY-MM-DD. */
export function primerDiaDelMes(fecha) {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

// -------------------------------------------------------------
// CUENTAS
// -------------------------------------------------------------

/**
 * Saldos con la distinción que importa: lo que dice el banco frente a
 * lo que realmente puedes gastar, una vez apartado el IVA retenido y
 * las reservas activas.
 */
export async function getCuentas() {
    let filas;
    try {
        filas = await sql`
            SELECT id, nombre, tipo, saldo_actual, iva_retenido, reservado,
                   disponible, saldo_manual, saldo_declarado_en
            FROM v_saldo_disponible
            ORDER BY (SELECT orden FROM cuentas c WHERE c.id = v_saldo_disponible.id)
        `;
    } catch (e) {
        // Falta la migración 004: se leen sin los campos de saldo manual.
        if (e?.code !== COLUMNA_INEXISTENTE) throw e;
        filas = await sql`
            SELECT id, nombre, tipo, saldo_actual, iva_retenido, reservado, disponible
            FROM v_saldo_disponible
            ORDER BY (SELECT orden FROM cuentas c WHERE c.id = v_saldo_disponible.id)
        `;
    }
    return filas.map((f) => ({
        ...f,
        saldo_actual: num(f.saldo_actual),
        iva_retenido: num(f.iva_retenido),
        reservado: num(f.reservado),
        disponible: num(f.disponible),
    }));
}

/**
 * Pone a mano el saldo de una cuenta.
 *
 * Vale para cualquiera, no sólo ahorro e inversión: el efectivo tampoco
 * se puede calcular sumando movimientos, porque los gastos en metálico
 * no dejan rastro en ningún extracto. Y con años de histórico
 * importado, sumar todo daría un saldo ficticio en cualquier cuenta.
 */
export async function declararSaldo(id, saldo) {
    await sql`
        UPDATE cuentas
        SET saldo_declarado = ${saldo}::numeric,
            saldo_declarado_en = CURRENT_DATE,
            saldo_manual = true
        WHERE id = ${id}::uuid
    `;
}

export async function getCategorias() {
    let filas;
    try {
        filas = await sql`
            SELECT id, nombre, es_fijo, importe_previsto, activa
            FROM categorias
            WHERE activa
            ORDER BY es_fijo DESC, nombre ASC
        `;
    } catch (e) {
        if (e?.code !== COLUMNA_INEXISTENTE) throw e;
        // Falta la migración 001: se leen las categorías sin el filtro.
        filas = await sql`
            SELECT id, nombre, es_fijo, importe_previsto
            FROM categorias
            ORDER BY es_fijo DESC, nombre ASC
        `;
    }
    return filas.map((f) => ({ ...f, importe_previsto: f.importe_previsto === null ? null : num(f.importe_previsto) }));
}

// -------------------------------------------------------------
// GASTOS FIJOS
// Los recibos que se repiten. Se editan de vez en cuando (sube el
// seguro, cambia una tarifa) y se cargan de una vez al empezar el mes.
// -------------------------------------------------------------

/**
 * Los recibos fijos con su cuenta, su día y su periodicidad, más si
 * ya está apuntado el de este mes.
 *
 * `toca` dice si corresponde cargarlo en el mes pedido: los mensuales
 * siempre, el seguro de la moto sólo cada seis meses.
 */
export async function getGastosFijos(mes) {
    const inicio = primerDiaDelMes(mes);
    let filas;
    try {
        filas = await sql`
            SELECT
                c.id, c.nombre, c.importe_previsto, c.dia_cobro,
                c.cada_meses, c.primer_mes, c.activa, c.notas,
                c.cuenta_id, cu.nombre AS cuenta,
                fn_toca_en_mes(c.cada_meses, c.primer_mes, ${inicio}::date) AS toca,
                -- ¿Ya hay un apunte de esta categoría en el mes?
                EXISTS (
                    SELECT 1 FROM transacciones t
                    WHERE t.categoria_id = c.id
                      AND t.fecha >= ${inicio}::date
                      AND t.fecha <  (${inicio}::date + INTERVAL '1 month')
                ) AS ya_apuntado
            FROM categorias c
            LEFT JOIN cuentas cu ON cu.id = c.cuenta_id
            WHERE c.es_fijo AND c.activa
            ORDER BY cu.nombre NULLS LAST, c.dia_cobro NULLS LAST, c.nombre
        `;
    } catch (e) {
        // Códigos 42703 (falta columna) y 42883 (falta la función
        // fn_toca_en_mes): la migración 001 no está aplicada. Se
        // devuelve la lista vacía para que el resto del mes se vea
        // igualmente, y la sección avisará de que falta migrar.
        if (e?.code !== COLUMNA_INEXISTENTE && e?.code !== '42883') throw e;
        console.warn('[finanzas] falta la migración 001-gastos-fijos');
        return [];
    }
    return filas.map((f) => ({
        ...f,
        importe_previsto: f.importe_previsto === null ? null : num(f.importe_previsto),
        cada_meses: Number(f.cada_meses),
        dia_cobro: f.dia_cobro === null ? null : Number(f.dia_cobro),
    }));
}

export async function guardarGastoFijo(datos) {
    const {
        id, nombre, importe_previsto, cuenta_id,
        dia_cobro, cada_meses, primer_mes, notas,
    } = datos;

    if (id) {
        await sql`
            UPDATE categorias SET
                nombre           = ${nombre},
                importe_previsto = ${importe_previsto}::numeric,
                cuenta_id        = ${cuenta_id || null}::uuid,
                dia_cobro        = ${dia_cobro || null}::smallint,
                cada_meses       = ${cada_meses}::smallint,
                primer_mes       = ${primer_mes || null}::date,
                notas            = ${notas || null}
            WHERE id = ${id}::uuid
        `;
        return { id };
    }

    const [fila] = await sql`
        INSERT INTO categorias
            (nombre, es_fijo, importe_previsto, cuenta_id, dia_cobro, cada_meses, primer_mes, notas)
        VALUES (
            ${nombre}, true, ${importe_previsto}::numeric, ${cuenta_id || null}::uuid,
            ${dia_cobro || null}::smallint, ${cada_meses}::smallint,
            ${primer_mes || null}::date, ${notas || null}
        )
        RETURNING id
    `;
    return fila;
}

/**
 * Da de baja un recibo sin borrarlo.
 *
 * Borrarlo dejaría sin categoría los movimientos de meses anteriores,
 * y el histórico dejaría de cuadrar.
 */
export async function desactivarGastoFijo(id) {
    await sql`UPDATE categorias SET activa = false WHERE id = ${id}::uuid`;
}

/** Vuelve a activar un recibo dado de baja. */
export async function reactivarGastoFijo(id) {
    await sql`
        UPDATE categorias
        SET activa = true, es_fijo = true
        WHERE id = ${id}::uuid
    `;
}

/**
 * Los recibos dados de baja.
 *
 * Sin esta lista, un recibo desactivado desaparece para siempre de la
 * interfaz: al volver a contratarlo habría que crearlo de nuevo, y el
 * nombre único de la tabla lo impediría.
 */
export async function getGastosFijosDeBaja() {
    const filas = await sql`
        SELECT c.id, c.nombre, c.importe_previsto, c.notas, cu.nombre AS cuenta
        FROM categorias c
        LEFT JOIN cuentas cu ON cu.id = c.cuenta_id
        WHERE NOT c.activa
        ORDER BY c.nombre
    `;
    return filas.map((f) => ({
        ...f,
        importe_previsto: f.importe_previsto === null ? null : num(f.importe_previsto),
    }));
}

/**
 * Apunta de una vez los recibos del mes.
 *
 * Sólo crea los que tocan y no estén ya apuntados, así que se puede
 * pulsar dos veces sin duplicar nada. Devuelve cuántos ha creado.
 */
export async function cargarFijosDelMes(mes, seleccion) {
    const inicio = primerDiaDelMes(mes);

    const candidatos = await sql`
        SELECT c.id, c.nombre, c.importe_previsto, c.cuenta_id, c.dia_cobro
        FROM categorias c
        WHERE c.es_fijo AND c.activa
          AND c.cuenta_id IS NOT NULL
          AND c.importe_previsto IS NOT NULL
          AND fn_toca_en_mes(c.cada_meses, c.primer_mes, ${inicio}::date)
          AND NOT EXISTS (
              SELECT 1 FROM transacciones t
              WHERE t.categoria_id = c.id
                AND t.fecha >= ${inicio}::date
                AND t.fecha <  (${inicio}::date + INTERVAL '1 month')
          )
    `;

    // Si se pasa una selección, sólo esos. Sin ella, todos los que tocan.
    const lista = Array.isArray(seleccion) && seleccion.length
        ? candidatos.filter((c) => seleccion.includes(c.id))
        : candidatos;

    let creados = 0;
    for (const c of lista) {
        // El día de cobro no puede salirse del mes: un recibo del 31
        // en febrero se apunta el último día que existe.
        const [a, m] = inicio.split('-').map(Number);
        const ultimoDia = new Date(a, m, 0).getDate();
        const dia = Math.min(c.dia_cobro || 1, ultimoDia);
        const fecha = `${a}-${String(m).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        await sql`
            INSERT INTO transacciones
                (fecha, cuenta_id, categoria_id, concepto, importe, tipo_movimiento)
            VALUES (
                ${fecha}::date, ${c.cuenta_id}::uuid, ${c.id}::uuid,
                ${c.nombre}, ${c.importe_previsto}::numeric, 'gasto'
            )
        `;
        creados++;
    }
    return { creados, total: candidatos.length };
}

// -------------------------------------------------------------
// TRANSACCIONES
// -------------------------------------------------------------

export async function getTransaccionesDelMes(mes) {
    const inicio = primerDiaDelMes(mes);
    const filas = await sql`
        SELECT
            t.id, t.fecha, t.concepto, t.importe, t.tipo_movimiento, t.notas,
            c.nombre  AS cuenta,
            cd.nombre AS cuenta_destino,
            cat.nombre AS categoria,
            cat.es_fijo
        FROM transacciones t
        JOIN cuentas c           ON c.id = t.cuenta_id
        LEFT JOIN cuentas cd     ON cd.id = t.cuenta_destino_id
        LEFT JOIN categorias cat ON cat.id = t.categoria_id
        WHERE t.fecha >= ${inicio}::date
          AND t.fecha <  (${inicio}::date + INTERVAL '1 month')
        ORDER BY t.fecha DESC, t.creada_en DESC
    `;
    return filas.map((f) => ({ ...f, importe: num(f.importe) }));
}

export async function crearTransaccion(datos) {
    const {
        fecha, cuenta_id, cuenta_destino_id, categoria_id,
        concepto, importe, tipo_movimiento, notas,
    } = datos;

    const esTransferencia = tipo_movimiento === 'transferencia_interna';

    const [fila] = await sql`
        INSERT INTO transacciones
            (fecha, cuenta_id, cuenta_destino_id, categoria_id,
             concepto, importe, tipo_movimiento, notas)
        VALUES (
            ${fecha}::date,
            ${cuenta_id}::uuid,
            ${esTransferencia ? cuenta_destino_id : null}::uuid,
            ${categoria_id || null}::uuid,
            ${concepto},
            ${importe}::numeric,
            ${tipo_movimiento}::tipo_movimiento,
            ${notas || null}
        )
        RETURNING id
    `;
    return fila;
}

export async function borrarTransaccion(id) {
    await sql`DELETE FROM transacciones WHERE id = ${id}::uuid`;
}

// -------------------------------------------------------------
// IVA
// El IVA se devenga por mes y se paga por trimestre. Estas consultas
// mantienen las dos vistas: el detalle mensual y el total del
// trimestre que toca liquidar.
// -------------------------------------------------------------

export async function getProvisionesIva() {
    const filas = await sql`
        SELECT
            p.id, p.mes_referencia, p.importe_calculado, p.estado,
            p.trimestre_fiscal, p.fecha_pago, p.notas,
            c.nombre AS cuenta
        FROM provisiones_iva p
        LEFT JOIN cuentas c ON c.id = p.cuenta_id
        ORDER BY p.mes_referencia DESC
    `;
    return filas.map((f) => ({ ...f, importe_calculado: num(f.importe_calculado) }));
}

/**
 * Lo retenido agrupado por trimestre. Es la cifra que en las hojas
 * aparece como "452 + 452 + 525 = 1429€": lo que hay que tener listo
 * para Hacienda cuando venga la liquidación.
 */
export async function getIvaPorTrimestre() {
    const filas = await sql`
        SELECT
            trimestre_fiscal,
            SUM(importe_calculado) AS total,
            COUNT(*)               AS meses,
            SUM(CASE WHEN estado = 'retenido' THEN importe_calculado ELSE 0 END) AS pendiente
        FROM provisiones_iva
        GROUP BY trimestre_fiscal
        ORDER BY trimestre_fiscal DESC
    `;
    return filas.map((f) => ({
        ...f,
        total: num(f.total),
        pendiente: num(f.pendiente),
        meses: Number(f.meses),
    }));
}

export async function guardarProvisionIva({ mes_referencia, importe_calculado, cuenta_id, notas }) {
    const mes = primerDiaDelMes(mes_referencia);
    // Un solo apunte de IVA por mes: si se vuelve a guardar, se actualiza.
    const [fila] = await sql`
        INSERT INTO provisiones_iva (mes_referencia, importe_calculado, cuenta_id, notas)
        VALUES (${mes}::date, ${importe_calculado}::numeric, ${cuenta_id || null}::uuid, ${notas || null})
        ON CONFLICT (mes_referencia) DO UPDATE
            SET importe_calculado = EXCLUDED.importe_calculado,
                cuenta_id         = EXCLUDED.cuenta_id,
                notas             = EXCLUDED.notas
        RETURNING id
    `;
    return fila;
}

/**
 * Marca pagado un trimestre completo y registra el gasto real en la
 * cuenta desde la que sale el dinero. Las dos cosas van juntas: si el
 * gasto no se apunta, el saldo del banco y el de la app se separan.
 */
export async function pagarTrimestreIva({ trimestre_fiscal, fecha_pago, cuenta_id }) {
    const [{ total } = { total: 0 }] = await sql`
        SELECT SUM(importe_calculado) AS total
        FROM provisiones_iva
        WHERE trimestre_fiscal = ${trimestre_fiscal} AND estado = 'retenido'
    `;
    const importe = num(total);
    if (importe <= 0) return { pagado: 0 };

    await sql`
        UPDATE provisiones_iva
        SET estado = 'pagado_hacienda', fecha_pago = ${fecha_pago}::date
        WHERE trimestre_fiscal = ${trimestre_fiscal} AND estado = 'retenido'
    `;

    await sql`
        INSERT INTO transacciones
            (fecha, cuenta_id, categoria_id, concepto, importe, tipo_movimiento)
        VALUES (
            ${fecha_pago}::date,
            ${cuenta_id}::uuid,
            (SELECT id FROM categorias WHERE nombre = 'Impuestos'),
            ${'Liquidación IVA ' + trimestre_fiscal},
            ${importe}::numeric,
            'gasto'
        )
    `;
    return { pagado: importe };
}

// -------------------------------------------------------------
// RESERVAS
// Dinero intocable con el motivo escrito al lado.
// -------------------------------------------------------------

export async function getReservas() {
    const filas = await sql`
        SELECT r.id, r.concepto, r.importe, r.motivo, r.estado,
               r.creada_en, r.liberada_en, c.nombre AS cuenta
        FROM reservas r
        JOIN cuentas c ON c.id = r.cuenta_id
        ORDER BY r.estado ASC, r.creada_en DESC
    `;
    return filas.map((f) => ({ ...f, importe: num(f.importe) }));
}

export async function crearReserva({ id, concepto, importe, cuenta_id, motivo }) {
    // Con id se edita la que ya existe: cambiar un importe apartado es
    // tan cotidiano como crearlo, y no debe pasar por la base de datos.
    if (id) {
        await sql`
            UPDATE reservas SET
                concepto  = ${concepto},
                importe   = ${importe}::numeric,
                cuenta_id = ${cuenta_id}::uuid,
                motivo    = ${motivo || null}
            WHERE id = ${id}::uuid
        `;
        return { id };
    }

    const [fila] = await sql`
        INSERT INTO reservas (concepto, importe, cuenta_id, motivo)
        VALUES (${concepto}, ${importe}::numeric, ${cuenta_id}::uuid, ${motivo || null})
        RETURNING id
    `;
    return fila;
}

/** Borra una reserva del todo, no sólo la libera. */
export async function borrarReserva(id) {
    await sql`DELETE FROM reservas WHERE id = ${id}::uuid`;
}

export async function liberarReserva(id) {
    await sql`
        UPDATE reservas
        SET estado = 'liberada', liberada_en = CURRENT_DATE
        WHERE id = ${id}::uuid AND estado = 'activa'
    `;
}

// -------------------------------------------------------------
// RESUMEN MENSUAL EN CASCADA
// -------------------------------------------------------------

/**
 * Devuelve el mes en el mismo orden que la hoja de papel: ingresos
 * arriba, restas encajadas una debajo de otra, total limpio, y el
 * reparto aparte porque ocurre después.
 */
export async function getResumenMes(mes) {
    const inicio = primerDiaDelMes(mes);

    const [resumen] = await sql`
        SELECT * FROM v_resumen_mensual WHERE mes = ${inicio}::date
    `;

    // Desglose de gastos fijos por categoría, para ver el bloque de
    // 512€ partido en gestoría / seguro / coche / Digi.
    const desglose = await sql`
        SELECT COALESCE(cat.nombre, 'Sin categoría') AS categoria,
               cat.es_fijo,
               SUM(t.importe) AS total
        FROM transacciones t
        LEFT JOIN categorias cat ON cat.id = t.categoria_id
        WHERE t.tipo_movimiento = 'gasto'
          AND t.fecha >= ${inicio}::date
          AND t.fecha <  (${inicio}::date + INTERVAL '1 month')
        GROUP BY cat.nombre, cat.es_fijo
        ORDER BY cat.es_fijo DESC NULLS LAST, SUM(t.importe) DESC
    `;

    const vacio = {
        mes: inicio,
        ingresos_banco: 0, ingresos_efectivo: 0, ingresos_totales: 0,
        gastos_fijos: 0, gastos_variables: 0, iva_provisionado: 0,
        total_limpio: 0, a_ahorro_inversion: 0,
    };

    const base = resumen
        ? Object.fromEntries(
              Object.entries(resumen).map(([k, v]) => [k, k === 'mes' ? v : num(v)])
          )
        : vacio;

    return {
        ...base,
        desglose: desglose.map((d) => ({ ...d, total: num(d.total) })),
    };
}

/** Meses con movimientos, para el selector. */
export async function getMesesDisponibles() {
    const filas = await sql`
        SELECT DISTINCT date_trunc('month', fecha)::date AS mes
        FROM transacciones
        ORDER BY mes DESC
    `;
    return filas.map((f) => f.mes);
}

// -------------------------------------------------------------
// VISTA ANUAL
// Con tres años de histórico, la navegación mes a mes no basta para
// ver la evolución. Aquí van los doce meses de un año, con sus totales.
// -------------------------------------------------------------

/** Los años que tienen movimientos, del más reciente al más antiguo. */
export async function getAniosDisponibles() {
    const filas = await sql`
        SELECT DISTINCT EXTRACT(YEAR FROM fecha)::int AS anio
        FROM transacciones
        ORDER BY anio DESC
    `;
    return filas.map((f) => f.anio);
}

/**
 * Los doce meses de un año, con lo que entró, salió y quedó.
 *
 * Incluye los meses sin movimientos, para que la tabla no tenga huecos
 * y se vea que ese mes estuvo vacío en lugar de faltar.
 */
export async function getResumenAnual(anio) {
    const filas = await sql`
        WITH meses AS (
            SELECT generate_series(
                make_date(${anio}::int, 1, 1),
                make_date(${anio}::int, 12, 1),
                INTERVAL '1 month'
            )::date AS mes
        )
        SELECT
            m.mes,
            COALESCE(r.ingresos_totales, 0)   AS ingresos,
            COALESCE(r.gastos_fijos, 0)
              + COALESCE(r.gastos_variables, 0) AS gastos,
            COALESCE(r.iva_provisionado, 0)   AS iva,
            COALESCE(r.total_limpio, 0)       AS limpio,
            COALESCE(r.a_ahorro_inversion, 0) AS a_ahorro,
            EXISTS (
                SELECT 1 FROM transacciones t
                WHERE t.fecha >= m.mes AND t.fecha < m.mes + INTERVAL '1 month'
            ) AS tiene_datos
        FROM meses m
        LEFT JOIN v_resumen_mensual r ON r.mes = m.mes
        ORDER BY m.mes
    `;
    return filas.map((f) => ({
        mes: f.mes,
        ingresos: num(f.ingresos),
        gastos: num(f.gastos),
        iva: num(f.iva),
        limpio: num(f.limpio),
        a_ahorro: num(f.a_ahorro),
        tiene_datos: f.tiene_datos,
    }));
}

/** Lo que se debe: préstamos y créditos pendientes. */
export async function getDeudas() {
    try {
        const filas = await sql`
            SELECT d.id, d.concepto, d.pendiente, d.cuota, d.dia_cobro,
                   d.actualizada_en, d.notas, c.nombre AS cuenta
            FROM deudas d
            LEFT JOIN cuentas c ON c.id = d.cuenta_id
            ORDER BY d.pendiente DESC
        `;
        return filas.map((f) => ({
            ...f,
            pendiente: num(f.pendiente),
            cuota: f.cuota === null ? null : num(f.cuota),
        }));
    } catch (e) {
        // Falta la migración 006.
        if (e?.code !== '42P01') throw e;
        return [];
    }
}

// -------------------------------------------------------------
// NOTAS DEL MES
// Por qué un mes salió como salió. Marzo de 2026 aparece en negativo
// porque el cobro se retrasó a abril, no porque se gastara de más: sin
// una nota, dentro de un año ese número no se puede interpretar.
// -------------------------------------------------------------

export async function getNotaMes(mes) {
    const inicio = primerDiaDelMes(mes);
    try {
        const [fila] = await sql`
            SELECT mes, texto, editada_en FROM notas_mes WHERE mes = ${inicio}::date
        `;
        return fila || null;
    } catch (e) {
        // Falta la migración 009.
        if (e?.code !== '42P01') throw e;
        return null;
    }
}

/** Guarda o borra la nota de un mes. Texto vacío = borrar. */
export async function guardarNotaMes(mes, texto) {
    const inicio = primerDiaDelMes(mes);
    const limpio = (texto || '').trim();

    if (!limpio) {
        await sql`DELETE FROM notas_mes WHERE mes = ${inicio}::date`;
        return { borrada: true };
    }

    await sql`
        INSERT INTO notas_mes (mes, texto)
        VALUES (${inicio}::date, ${limpio})
        ON CONFLICT (mes) DO UPDATE
            SET texto = EXCLUDED.texto, editada_en = now()
    `;
    return { ok: true };
}

/** Todas las notas de un año, para pintarlas en la vista anual. */
export async function getNotasDelAnio(anio) {
    try {
        const filas = await sql`
            SELECT mes, texto FROM notas_mes
            WHERE EXTRACT(YEAR FROM mes) = ${anio}::int
        `;
        return Object.fromEntries(
            filas.map((f) => [String(f.mes).slice(0, 10), f.texto])
        );
    } catch (e) {
        if (e?.code !== '42P01') throw e;
        return {};
    }
}
