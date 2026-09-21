-- =============================================================
-- Migración 021 · Que «fuera de la cascada» también valga para los
--                 ingresos
--
-- EL FALLO
--
-- `categorias.fuera_de_cascada` nació en la migración 007 para un
-- único caso: el pago del IVA a Hacienda, que es un gasto del
-- extracto y no debe restarse dos veces. Por eso la vista
-- `v_resumen_mensual` sólo mira esa marca en los gastos. En los
-- ingresos la ignora por completo.
--
-- Al meter en la 020 la categoría «Indemnización del siniestro» con
-- la marca puesta, se dio por hecho que funcionaría en los dos
-- sentidos. No funciona: los 1.950 € de Admiral siguen contando como
-- ingreso de septiembre, que es justo lo que se quería evitar.
--
--   ingresos de septiembre    2.140,26 €   ← incluye los 1.950
--   limpio de septiembre       −451,23 €
--
--   ingresos de verdad          190,26 €   ← Stripe, un Bizum y poco más
--   limpio de verdad         −2.401,23 €
--
-- La diferencia entre perder 451 € en un mes y perder 2.401 € es la
-- diferencia entre un mes flojo y un mes sin ingresos.
--
--
-- OJO: ESTA MIGRACIÓN PARTE DE LA VISTA DE LA 007, NO DE LA 010
--
-- El primer intento de esta migración falló con:
--
--   42P16: cannot change name of view column "iva_provisionado"
--          to "iva_pagado"
--
-- Al leer la vista que está viva en el servidor, resulta que **la
-- migración 010 nunca se ejecutó**. La vista real es la de la 007:
-- tiene nueve columnas, no diez, no existe `iva_pagado`, y
-- `total_limpio` sí resta `iva_provisionado`.
--
-- Así que aquí se toca lo mínimo: se parte de la vista que de verdad
-- existe y sólo se cambia lo de los ingresos. El `total_limpio` se
-- deja exactamente como está, restando la provisión de IVA.
--
-- Lo que la 010 quería cambiar (dejar de restar la provisión y
-- mostrar aparte el IVA ya pagado) es otra discusión, y no está
-- claro que su criterio fuera el bueno: los ingresos se apuntan con
-- IVA incluido, así que si no se resta por ningún lado, el limpio
-- cuenta como tuyo un dinero que es de Hacienda. Se deja como está y
-- se decide aparte.
--
-- Efecto de esto en `cascada.jsx`: el componente lee `iva_pagado`,
-- que no existe en la vista. Hoy ya llega `undefined` y esa línea no
-- se pinta nunca. No es una regresión de esta migración, pero
-- conviene saberlo.
--
-- QUÉ CAMBIA, ENTONCES
--
-- 1. Los ingresos de una categoría marcada dejan de sumar a
--    `ingresos_banco` e `ingresos_efectivo`, y por tanto al limpio.
-- 2. Aparecen aparte, en una columna nueva `ingresos_fuera`, para
--    que se vean. La idea es no contarlos como mes bueno, no
--    esconderlos.
--
-- La columna nueva va al final a propósito: CREATE OR REPLACE VIEW
-- sólo admite añadir columnas por el final, y así no hace falta
-- destruir la vista ni nada que dependa de ella.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

CREATE OR REPLACE VIEW v_resumen_mensual AS
WITH meses AS (
  SELECT DISTINCT date_trunc('month', fecha)::date AS mes FROM transacciones
),
mov AS (
  SELECT
    date_trunc('month', t.fecha)::date AS mes,

    -- Los ingresos que cuentan como mes: los que NO están marcados
    -- como fuera de la cascada.
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso' AND c.tipo <> 'efectivo'
                  AND NOT COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS ingresos_banco,
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso' AND c.tipo = 'efectivo'
                  AND NOT COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS ingresos_efectivo,

    -- El dinero que entró pero no es fruto del trabajo del mes: una
    -- indemnización, por ejemplo. Mueve el saldo del banco, pero no
    -- hace bueno el mes.
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso'
                  AND COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS ingresos_fuera,

    SUM(CASE WHEN t.tipo_movimiento = 'gasto' AND cat.es_fijo
                  AND NOT COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS gastos_fijos,
    SUM(CASE WHEN t.tipo_movimiento = 'gasto' AND NOT COALESCE(cat.es_fijo, false)
                  AND NOT COALESCE(cat.fuera_de_cascada, false)
             THEN t.importe ELSE 0 END)                       AS gastos_variables,

    SUM(CASE WHEN t.tipo_movimiento = 'transferencia_interna'
                  AND cd.tipo IN ('ahorro', 'inversion')
             THEN t.importe ELSE 0 END)                       AS a_ahorro_inversion
  FROM transacciones t
  JOIN cuentas c            ON c.id  = t.cuenta_id
  LEFT JOIN cuentas cd      ON cd.id = t.cuenta_destino_id
  LEFT JOIN categorias cat  ON cat.id = t.categoria_id
  GROUP BY 1
)
-- Las nueve primeras columnas, con el mismo nombre y en el mismo
-- orden que la vista actual. No se toca ni una.
SELECT
  m.mes,
  COALESCE(mov.ingresos_banco, 0)                      AS ingresos_banco,
  COALESCE(mov.ingresos_efectivo, 0)                   AS ingresos_efectivo,
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)               AS ingresos_totales,
  COALESCE(mov.gastos_fijos, 0)                        AS gastos_fijos,
  COALESCE(mov.gastos_variables, 0)                    AS gastos_variables,
  COALESCE(iva.importe_calculado, 0)                   AS iva_provisionado,
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)
    - COALESCE(mov.gastos_fijos, 0)
    - COALESCE(mov.gastos_variables, 0)
    - COALESCE(iva.importe_calculado, 0)               AS total_limpio,
  COALESCE(mov.a_ahorro_inversion, 0)                  AS a_ahorro_inversion,
  -- Décima columna, nueva, al final.
  COALESCE(mov.ingresos_fuera, 0)                      AS ingresos_fuera
FROM meses m
LEFT JOIN mov ON mov.mes = m.mes
LEFT JOIN provisiones_iva iva ON iva.mes_referencia = m.mes
ORDER BY m.mes DESC;


-- -------------------------------------------------------------
-- COMPROBACIÓN
--
-- Septiembre debería quedar así:
--   ingresos_totales    190,26 €
--   ingresos_fuera    1.950,00 €
--   total_limpio     −2.401,23 €
--
-- Y los meses anteriores no deben moverse ni un céntimo: ninguna
-- categoría de ingreso tenía la marca hasta ahora.
-- -------------------------------------------------------------
SELECT to_char(mes, 'YYYY-MM') AS mes,
       ingresos_totales, ingresos_fuera,
       gastos_fijos + gastos_variables AS gastos,
       iva_provisionado, total_limpio
FROM v_resumen_mensual
WHERE mes >= '2026-05-01'
ORDER BY mes;
