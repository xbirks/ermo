-- =============================================================
-- Migración 010 · El IVA deja de contarse dos veces
--
-- Julio quedaba en 1.046 € limpios y, al anotar 602 € de provisión de
-- IVA, bajaba a 444 €. Pero esos 602 € ya estaban descontados: el 20 de
-- julio salieron 2.138,64 € de la cuenta pagando el modelo 303, y el
-- saldo real de Imagin (2.877,26 €, el que dice el banco) ya lo
-- refleja.
--
-- El planteamiento inicial venía de las hojas de papel, donde el IVA se
-- apuntaba a mano porque no había otra forma de saberlo. Con los
-- extractos importados no hace falta: el pago a Hacienda está en el
-- extracto, con su fecha y su importe exacto.
--
-- Así que la provisión deja de restarse en la cascada. Sigue existiendo
-- para saber cuánto habrá que pagar en el próximo trimestre —eso el
-- banco no lo sabe—, pero como aviso, no como resta.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- Hay que borrarla antes: `CREATE OR REPLACE VIEW` no admite añadir
-- columnas en medio, y aquí se añade iva_pagado.
DROP VIEW IF EXISTS v_resumen_mensual;

CREATE VIEW v_resumen_mensual AS
WITH meses AS (
  SELECT DISTINCT date_trunc('month', fecha)::date AS mes FROM transacciones
),
mov AS (
  SELECT
    date_trunc('month', t.fecha)::date AS mes,
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso' AND c.tipo <> 'efectivo'
             THEN t.importe ELSE 0 END)                       AS ingresos_banco,
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso' AND c.tipo = 'efectivo'
             THEN t.importe ELSE 0 END)                       AS ingresos_efectivo,
    SUM(CASE WHEN t.tipo_movimiento = 'gasto' AND cat.es_fijo
                  AND NOT COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS gastos_fijos,
    SUM(CASE WHEN t.tipo_movimiento = 'gasto' AND NOT COALESCE(cat.es_fijo, false)
                  AND NOT COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS gastos_variables,
    -- El IVA pagado a Hacienda, tal como aparece en el extracto. Se
    -- muestra aparte para que se vea, pero no se resta otra vez: ya
    -- está dentro del saldo que da el banco.
    SUM(CASE WHEN t.tipo_movimiento = 'gasto'
                  AND COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS iva_pagado,
    SUM(CASE WHEN t.tipo_movimiento = 'transferencia_interna'
                  AND cd.tipo IN ('ahorro', 'inversion')
             THEN t.importe ELSE 0 END)                       AS a_ahorro_inversion
  FROM transacciones t
  JOIN cuentas c            ON c.id  = t.cuenta_id
  LEFT JOIN cuentas cd      ON cd.id = t.cuenta_destino_id
  LEFT JOIN categorias cat  ON cat.id = t.categoria_id
  GROUP BY 1
)
SELECT
  m.mes,
  COALESCE(mov.ingresos_banco, 0)                      AS ingresos_banco,
  COALESCE(mov.ingresos_efectivo, 0)                   AS ingresos_efectivo,
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)               AS ingresos_totales,
  COALESCE(mov.gastos_fijos, 0)                        AS gastos_fijos,
  COALESCE(mov.gastos_variables, 0)                    AS gastos_variables,
  -- Lo que se pagó de IVA este mes, si se pagó.
  COALESCE(mov.iva_pagado, 0)                          AS iva_pagado,
  -- La provisión sigue visible, pero informativa: dice cuánto habrá que
  -- pagar el próximo trimestre.
  COALESCE(iva.importe_calculado, 0)                   AS iva_provisionado,
  -- El limpio: ingresos menos gastos reales. El IVA no se resta aquí
  -- porque su pago ya es un gasto del extracto cuando toca.
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)
    - COALESCE(mov.gastos_fijos, 0)
    - COALESCE(mov.gastos_variables, 0)                AS total_limpio,
  COALESCE(mov.a_ahorro_inversion, 0)                  AS a_ahorro_inversion
FROM meses m
LEFT JOIN mov ON mov.mes = m.mes
LEFT JOIN provisiones_iva iva ON iva.mes_referencia = m.mes
ORDER BY m.mes DESC;

-- Comprobación: julio debería volver a 1.046 €.
SELECT to_char(mes, 'YYYY-MM') AS mes, ingresos_totales,
       gastos_fijos + gastos_variables AS gastos,
       iva_pagado, iva_provisionado, total_limpio
FROM v_resumen_mensual
WHERE mes >= '2026-05-01'
ORDER BY mes;
