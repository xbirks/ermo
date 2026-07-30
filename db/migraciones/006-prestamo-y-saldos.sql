-- =============================================================
-- Migración 006 · Préstamo del coche y saldos de todas las cuentas
--
-- Dos cosas:
--
-- 1. TODAS las cuentas pasan a saldo declarado, no sólo ahorro e
--    inversión. Con tres años de histórico importado, sumar los
--    movimientos daría un saldo ficticio: los ingresos de 2023 ya se
--    gastaron. El saldo real es el que dice el banco hoy, y el
--    histórico sirve para ver cómo se llegó hasta él, no para
--    calcularlo.
--
-- 2. El préstamo del coche. Los 400 € que salen cada día 4 no son un
--    gasto cualquiera: van amortizando una deuda de 5.298,59 €. Sin
--    registrarla, el patrimonio sale inflado, porque se cuenta lo que
--    hay en las cuentas y no lo que se debe.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- -------------------------------------------------------------
-- Saldos reales a 30 de julio de 2026, según cada banco.
-- -------------------------------------------------------------
UPDATE cuentas SET
  saldo_manual = true,
  saldo_declarado = 2877.26,
  saldo_declarado_en = DATE '2026-07-30'
WHERE nombre = 'Imagin' AND saldo_declarado IS NULL;

UPDATE cuentas SET
  saldo_manual = true,
  saldo_declarado = 68.04,
  saldo_declarado_en = DATE '2026-07-30'
WHERE nombre = 'Santander' AND saldo_declarado IS NULL;

-- -------------------------------------------------------------
-- DEUDAS
-- Lo que se debe, para que el patrimonio no salga inflado.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deudas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto          TEXT NOT NULL,
  -- Lo que queda por pagar. Se actualiza a mano o restando cuotas.
  pendiente         NUMERIC(12,2) NOT NULL CHECK (pendiente >= 0),
  cuota             NUMERIC(12,2) CHECK (cuota IS NULL OR cuota > 0),
  dia_cobro         SMALLINT CHECK (dia_cobro IS NULL OR dia_cobro BETWEEN 1 AND 31),
  cuenta_id         UUID REFERENCES cuentas(id) ON DELETE SET NULL,
  -- Categoría con la que se apuntan las cuotas, para poder cruzarlas.
  categoria_id      UUID REFERENCES categorias(id) ON DELETE SET NULL,
  actualizada_en    DATE NOT NULL DEFAULT CURRENT_DATE,
  notas             TEXT,
  creada_en         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- El préstamo del coche: 5.298,59 € pendientes, cuota de 400 € el día 4.
INSERT INTO deudas (concepto, pendiente, cuota, dia_cobro, cuenta_id, categoria_id, actualizada_en, notas)
SELECT
  'Préstamo del coche',
  5298.59,
  400.00,
  4,
  (SELECT id FROM cuentas WHERE nombre = 'Imagin'),
  (SELECT id FROM categorias WHERE nombre = 'Coche'),
  DATE '2026-07-30',
  'Cuota mensual de 400 €. Quedan unos 13 meses.'
WHERE NOT EXISTS (SELECT 1 FROM deudas WHERE concepto = 'Préstamo del coche');

-- -------------------------------------------------------------
-- VISTA: patrimonio real, restando lo que se debe.
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW v_patrimonio AS
SELECT
  (SELECT COALESCE(SUM(disponible), 0) FROM v_saldo_disponible
    WHERE tipo IN ('corriente', 'efectivo'))            AS para_gastar,
  (SELECT COALESCE(SUM(disponible), 0) FROM v_saldo_disponible
    WHERE tipo IN ('ahorro', 'inversion'))              AS ahorrado,
  (SELECT COALESCE(SUM(pendiente), 0) FROM deudas)      AS se_debe,
  (SELECT COALESCE(SUM(disponible), 0) FROM v_saldo_disponible)
    - (SELECT COALESCE(SUM(pendiente), 0) FROM deudas)  AS patrimonio_neto;

-- Comprobación.
SELECT * FROM v_patrimonio;
