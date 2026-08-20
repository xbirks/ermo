-- =============================================================
-- Migración 016 · Tabla de avisos
--
-- Recordatorios que no son un gasto ni una deuda pero también son
-- predecibles: mandar una factura, revisar un precio antes de que
-- renueve algo. Reutiliza la misma periodicidad que los gastos fijos
-- (fn_toca_en_mes, de la migración 001), sin atarlos a ninguna cuenta
-- ni categoría de dinero: no son un movimiento, son un recordatorio.
--
-- La consulta el aviso diario de /api/cron/avisos.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

CREATE TABLE IF NOT EXISTS avisos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto    TEXT NOT NULL,
  -- Día del mes en que se manda el aviso (1-31, igual que dia_cobro
  -- en categorías y deudas).
  dia         SMALLINT NOT NULL CHECK (dia BETWEEN 1 AND 31),
  -- Cada cuántos meses se repite. 1 = cada mes, 6 = cada semestre.
  cada_meses  SMALLINT NOT NULL DEFAULT 1 CHECK (cada_meses BETWEEN 0 AND 60),
  primer_mes  DATE,
  activo      BOOLEAN NOT NULL DEFAULT true,
  notas       TEXT,
  creada_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avisos_dia ON avisos (dia) WHERE activo;

-- Comprobación.
SELECT concepto, dia, cada_meses, activo FROM avisos ORDER BY dia;
