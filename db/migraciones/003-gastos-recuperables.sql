-- =============================================================
-- Migración 003 · Gastos que se recuperan
--
-- Dinero adelantado que otro devolverá: los taxis del accidente de
-- moto, que paga el seguro. No son gastos propios aunque salgan de la
-- cuenta, así que mezclarlos con el resto distorsiona el mes: sólo los
-- taxis de mayo a julio de 2026 son 741 €, un 15 % de todo lo gastado.
--
-- Se modelan como categoría con la marca `recuperable`, para poder
-- sumarlos aparte y saber cuánto queda por cobrar.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- Marca las categorías cuyo importe se va a recuperar.
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS recuperable BOOLEAN NOT NULL DEFAULT false;

-- Fecha en que se cobró el reembolso; NULL mientras esté pendiente.
ALTER TABLE transacciones
  ADD COLUMN IF NOT EXISTS reembolsado_en DATE;

CREATE INDEX IF NOT EXISTS idx_transacciones_pendiente_reembolso
  ON transacciones (reembolsado_en) WHERE reembolsado_en IS NULL;

INSERT INTO categorias (nombre, es_fijo, recuperable, notas)
VALUES (
  'Taxis del accidente',
  false,
  true,
  'Adelantado por el accidente de moto. Lo reembolsa el seguro.'
)
ON CONFLICT (nombre) DO UPDATE
  SET recuperable = true,
      notas = COALESCE(categorias.notas, EXCLUDED.notas);

-- -------------------------------------------------------------
-- VISTA: lo adelantado y aún no cobrado.
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW v_pendiente_reembolso AS
SELECT
  c.nombre                       AS categoria,
  COUNT(*)                       AS movimientos,
  SUM(t.importe)                 AS total,
  MIN(t.fecha)                   AS desde,
  MAX(t.fecha)                   AS hasta
FROM transacciones t
JOIN categorias c ON c.id = t.categoria_id
WHERE c.recuperable
  AND t.tipo_movimiento = 'gasto'
  AND t.reembolsado_en IS NULL
GROUP BY c.nombre;

-- Comprobación.
SELECT * FROM v_pendiente_reembolso;
