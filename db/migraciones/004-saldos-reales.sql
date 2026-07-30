-- =============================================================
-- Migración 004 · Saldo declarado a mano
--
-- El saldo calculado sumando movimientos vale para una cuenta
-- corriente, pero no para ahorro ni inversión:
--
--   · B100 guarda el dinero en la "Hucha", un producto aparte que el
--     extracto de la cuenta no refleja. Además, las entradas vienen de
--     transferencias propias, que no se importan para no inflar los
--     ingresos: quedaban las salidas sin sus entradas y el saldo salía
--     en −4.200 € cuando en realidad hay 8.295 €.
--
--   · MyInvestor vale hoy más que lo aportado, porque los fondos se
--     revalorizan. Ningún extracto de movimientos recoge eso: sumando
--     aportaciones salen 1.770 € frente a los 4.217 € reales.
--
-- Para esas cuentas el saldo se declara a mano y la app lo respeta en
-- lugar de calcularlo.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- Saldo puesto a mano. NULL = calcúlalo con los movimientos.
ALTER TABLE cuentas
  ADD COLUMN IF NOT EXISTS saldo_declarado NUMERIC(12,2);

-- Cuándo se puso, para saber si está al día.
ALTER TABLE cuentas
  ADD COLUMN IF NOT EXISTS saldo_declarado_en DATE;

-- Marca las cuentas cuyo saldo no puede deducirse de los movimientos.
ALTER TABLE cuentas
  ADD COLUMN IF NOT EXISTS saldo_manual BOOLEAN NOT NULL DEFAULT false;

-- Ahorro e inversión pasan a saldo declarado.
UPDATE cuentas SET saldo_manual = true
WHERE tipo IN ('ahorro', 'inversion');

-- -------------------------------------------------------------
-- La vista de saldos usa el declarado cuando existe.
--
-- Hay que borrarla antes de recrearla: `CREATE OR REPLACE VIEW` no
-- admite añadir columnas en medio ni cambiarles el nombre, y aquí se
-- añaden dos (saldo_manual y saldo_declarado_en).
-- -------------------------------------------------------------
DROP VIEW IF EXISTS v_saldo_disponible;

CREATE VIEW v_saldo_disponible AS
SELECT
  c.id,
  c.nombre,
  c.tipo,
  c.saldo_manual,
  c.saldo_declarado_en,
  -- El saldo que se muestra: el declarado manda sobre el calculado.
  CASE
    WHEN c.saldo_manual AND c.saldo_declarado IS NOT NULL THEN c.saldo_declarado
    ELSE c.saldo_actual
  END                                           AS saldo_actual,
  COALESCE(iva.retenido, 0)                     AS iva_retenido,
  COALESCE(res.reservado, 0)                    AS reservado,
  CASE
    WHEN c.saldo_manual AND c.saldo_declarado IS NOT NULL THEN c.saldo_declarado
    ELSE c.saldo_actual
  END
    - COALESCE(iva.retenido, 0)
    - COALESCE(res.reservado, 0)                AS disponible
FROM cuentas c
LEFT JOIN (
  SELECT cuenta_id, SUM(importe_calculado) AS retenido
  FROM provisiones_iva WHERE estado = 'retenido' GROUP BY cuenta_id
) iva ON iva.cuenta_id = c.id
LEFT JOIN (
  SELECT cuenta_id, SUM(importe) AS reservado
  FROM reservas WHERE estado = 'activa' GROUP BY cuenta_id
) res ON res.cuenta_id = c.id;

-- -------------------------------------------------------------
-- Saldos reales a 30 de julio de 2026, dichos por Andrés.
-- -------------------------------------------------------------
UPDATE cuentas
SET saldo_declarado = 8295.43, saldo_declarado_en = DATE '2026-07-30'
WHERE nombre = 'B100' AND saldo_declarado IS NULL;

UPDATE cuentas
SET saldo_declarado = 4217.87, saldo_declarado_en = DATE '2026-07-30'
WHERE nombre = 'MyInvestor' AND saldo_declarado IS NULL;

-- Comprobación.
SELECT nombre, tipo, saldo_manual, saldo_actual, disponible
FROM v_saldo_disponible
ORDER BY nombre;
