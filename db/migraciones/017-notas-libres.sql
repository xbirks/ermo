-- =============================================================
-- Migración 017 · Notas libres desde Discord
--
-- Apuntes rápidos que Andrés escribe con /nota en Discord: contexto
-- para cuando se revise el estado de las cuentas, sin atarlos a un
-- mes concreto como pasa con notas_mes (que es un único texto por
-- mes y se sobrescribe). Esto es un cuaderno que sólo crece: se
-- guarda tal cual, con su fecha, y no se edita desde aquí.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

CREATE TABLE IF NOT EXISTS notas_libres (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texto      TEXT NOT NULL,
  origen     TEXT NOT NULL DEFAULT 'discord',
  creada_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notas_libres_fecha ON notas_libres (creada_en DESC);

-- Comprobación.
SELECT texto, origen, creada_en FROM notas_libres ORDER BY creada_en DESC LIMIT 5;
