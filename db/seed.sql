-- =============================================================
-- ERMO · Finanzas · Datos iniciales
--
-- Cuentas y categorías sacadas de las hojas de noviembre a junio.
-- Los importe_previsto son los recibos que se repiten cada mes,
-- para poder detectar cuando uno sube.
--
-- Idempotente: se puede relanzar sin duplicar.
-- =============================================================

INSERT INTO cuentas (nombre, tipo, orden) VALUES
  ('Imagin',          'corriente', 1),
  ('Santander',       'corriente', 2),
  ('B100',            'ahorro',    3),
  ('MyInvestor',      'inversion', 4),
  ('Cartera Efectivo','efectivo',  5)
ON CONFLICT (nombre) DO NOTHING;

-- Gastos operativos fijos: el bloque de 512€ de Imagin.
INSERT INTO categorias (nombre, es_fijo, importe_previsto) VALUES
  ('Gestoría',              true,  60.00),
  ('Seguro',                true,  22.00),
  ('Coche',                 true, 400.00),
  ('Internet Digi',         true,  30.00),
  ('Cuota autónomos',       true, 302.00),
  ('Seguro moto',           true,  68.00),
  ('Impuesto circulación',  false, NULL)
ON CONFLICT (nombre) DO NOTHING;

-- Suscripciones: el bloque de ~50€ de Santander.
INSERT INTO categorias (nombre, es_fijo, importe_previsto) VALUES
  ('Netflix',    true, 19.00),
  ('Vodafone',   true, 10.00),
  ('Lowi',       true, 10.00),
  ('iPhone',     true, 10.00),
  ('ChatGPT',    true, 19.00)
ON CONFLICT (nombre) DO NOTHING;

-- Variables y movimientos de dinero.
INSERT INTO categorias (nombre, es_fijo, importe_previsto) VALUES
  ('Honorarios clientes',  false, NULL),
  ('Comida y supervivencia',false, NULL),
  ('Impuestos',            false, NULL),
  ('Ahorro',               false, NULL),
  ('Inversión',            false, NULL),
  ('Gastos varios',        false, NULL)
ON CONFLICT (nombre) DO NOTHING;

-- -------------------------------------------------------------
-- La reserva de 409€ que arrastras desde abril.
-- De la nota: "queda un residuo de 409€. NO TOCAR. Esperar a la
-- declaración de renta y si no para el seguro".
-- Sólo se inserta si no existe ya.
-- -------------------------------------------------------------
INSERT INTO reservas (concepto, importe, cuenta_id, motivo, creada_en)
SELECT
  'Acumulado caja',
  409.00,
  (SELECT id FROM cuentas WHERE nombre = 'Imagin'),
  'No tocar. Esperar a la declaración de renta; si no, para el seguro.',
  DATE '2026-04-01'
WHERE NOT EXISTS (
  SELECT 1 FROM reservas WHERE concepto = 'Acumulado caja'
);
