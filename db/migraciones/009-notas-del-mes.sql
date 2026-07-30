-- =============================================================
-- Migración 009 · Notas del mes
--
-- Un mes puede salir raro por algo que no se ve en los movimientos:
-- marzo de 2026 aparece en −1.158 € porque el cobro se retrasó a los
-- primeros días de abril mientras se negociaba una subida.
--
-- Sin una nota, dentro de un año ese número no se puede interpretar.
-- Es lo mismo que en las hojas de papel se escribía al margen: "mes muy
-- raro", "ojo con el IVA", "sin datos dec. renta todavía".
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

CREATE TABLE IF NOT EXISTS notas_mes (
  -- Siempre el día 1 del mes: uno por mes, y así se puede editar sin
  -- crear duplicados.
  mes         DATE PRIMARY KEY,
  texto       TEXT NOT NULL,
  creada_en   TIMESTAMPTZ NOT NULL DEFAULT now(),
  editada_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- La nota de marzo de 2026, que es la que motiva esto.
INSERT INTO notas_mes (mes, texto)
VALUES (
  DATE '2026-03-01',
  'Mes en negativo por un desfase de cobro, no por gastar de más: '
  || 'estaba negociando una subida y el ingreso llegó los primeros días '
  || 'de abril. Por eso abril sale tan alto.'
)
ON CONFLICT (mes) DO NOTHING;

-- Comprobación.
SELECT to_char(mes, 'YYYY-MM') AS mes, texto FROM notas_mes ORDER BY mes;
