-- =============================================================
-- Migración 007 · Reclasificar traspasos y liquidaciones de IVA
--
-- Julio de 2026 salía en −3.437 € sin que hubiera ningún agujero real.
-- Tres cosas que se contaban como gasto y no lo son:
--
-- 1. REINT.CAJERO (1.000 €). Sacar efectivo no es gastar: el dinero
--    pasa de la cuenta a la cartera y sigue siendo tuyo.
--
-- 2. Traspasos a ahorro ("ahorro", "TRASPASO"). Mandar dinero a B100 o
--    a MyInvestor no es un gasto, es cambiarlo de sitio. El importador
--    sólo detectaba los que llevan el nombre del titular.
--
-- 3. La liquidación del IVA (I.V.A. MOD.303, 2.138,64 €). Es el pago
--    de un trimestre entero, con dinero que se venía reteniendo desde
--    meses atrás. Cargarlo como gasto del mes en que se paga hunde ese
--    mes y deja limpios de más los tres anteriores.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Los reintegros de cajero pasan a traspaso a la cartera.
-- -------------------------------------------------------------
UPDATE transacciones t
SET tipo_movimiento = 'transferencia_interna',
    cuenta_destino_id = (SELECT id FROM cuentas WHERE nombre = 'Cartera Efectivo'),
    categoria_id = NULL
WHERE t.tipo_movimiento = 'gasto'
  AND t.concepto ~* 'reint\.?\s?cajero|reintegro'
  AND t.cuenta_id <> (SELECT id FROM cuentas WHERE nombre = 'Cartera Efectivo');

-- -------------------------------------------------------------
-- 2. Los traspasos a ahorro dejan de ser gasto.
--
-- No se puede saber a qué cuenta fue cada uno, así que se marcan como
-- traspaso a B100, que es la de ahorro habitual. Si alguno fue a
-- MyInvestor, se corrige desde la app.
-- -------------------------------------------------------------
UPDATE transacciones t
SET tipo_movimiento = 'transferencia_interna',
    cuenta_destino_id = (SELECT id FROM cuentas WHERE nombre = 'B100'),
    categoria_id = NULL
WHERE t.tipo_movimiento = 'gasto'
  AND t.concepto ~* '^ahorro$|^traspaso$|ahorro b100|traspaso ahorro'
  AND t.cuenta_id <> (SELECT id FROM cuentas WHERE nombre = 'B100');

-- -------------------------------------------------------------
-- 3. Las liquidaciones de IVA salen de la cascada del mes.
--
-- Se marcan con una categoría propia excluida del cálculo: el IVA ya
-- se resta mes a mes como provisión, así que cargar además la
-- liquidación trimestral sería contarlo dos veces.
-- -------------------------------------------------------------
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS fuera_de_cascada BOOLEAN NOT NULL DEFAULT false;

INSERT INTO categorias (nombre, es_fijo, fuera_de_cascada, notas)
VALUES (
  'Liquidación de IVA',
  false,
  true,
  'Pago trimestral a Hacienda. No entra en la cascada: el IVA ya se resta mes a mes como provisión.'
)
ON CONFLICT (nombre) DO UPDATE SET fuera_de_cascada = true;

UPDATE transacciones t
SET categoria_id = (SELECT id FROM categorias WHERE nombre = 'Liquidación de IVA')
WHERE t.tipo_movimiento = 'gasto'
  AND t.concepto ~* 'i\.?v\.?a\.?\s*mod|mod\.?\s?303|modelo 303';

-- -------------------------------------------------------------
-- La cascada mensual ignora lo que está fuera de cascada.
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW v_resumen_mensual AS
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
  COALESCE(iva.importe_calculado, 0)                   AS iva_provisionado,
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)
    - COALESCE(mov.gastos_fijos, 0)
    - COALESCE(mov.gastos_variables, 0)
    - COALESCE(iva.importe_calculado, 0)               AS total_limpio,
  COALESCE(mov.a_ahorro_inversion, 0)                  AS a_ahorro_inversion
FROM meses m
LEFT JOIN mov ON mov.mes = m.mes
LEFT JOIN provisiones_iva iva ON iva.mes_referencia = m.mes
ORDER BY m.mes DESC;

-- Comprobación: julio de 2026 debería dejar de estar hundido.
SELECT to_char(mes, 'YYYY-MM') AS mes, ingresos_totales,
       gastos_fijos + gastos_variables AS gastos, total_limpio
FROM v_resumen_mensual
WHERE mes >= '2026-05-01'
ORDER BY mes;
