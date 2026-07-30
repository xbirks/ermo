-- =============================================================
-- Migración 011 · Los traspasos de Imagin dejan de ser gastos
--
-- Imagin es la caja del negocio, no una cuenta de uso diario. Entran
-- los cobros de clientes; salen los recibos fijos domiciliados y el
-- IVA. Cuando en su extracto aparece «Mercadona», «Compra» o
-- «Gastos», no es un gasto: es dinero que se pasa a Santander para
-- gastarlo allí. Contarlo como gasto lo cuenta dos veces, porque el
-- gasto real aparece luego en Santander.
--
-- Lo mismo con los traspasos a cuentas de ahorro propias («Ahorro
-- casa», «Ahorro mensual», «Ahorro Openbank»): el dinero sigue siendo
-- suyo.
--
-- Y la cuota del préstamo del coche, que en el extracto aparece con su
-- referencia (PRS80181365477), pasa a estar categorizada como Coche
-- para que cuente como el recibo fijo que es.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- -------------------------------------------------------------
-- 1. La cuota del coche, con su categoría.
-- -------------------------------------------------------------
UPDATE transacciones t
SET categoria_id = (SELECT id FROM categorias WHERE nombre = 'Coche')
WHERE t.tipo_movimiento = 'gasto'
  AND t.concepto ILIKE 'PRS80181365477%'
  AND t.categoria_id IS DISTINCT FROM (SELECT id FROM categorias WHERE nombre = 'Coche');

-- -------------------------------------------------------------
-- 2. Traspasos de Imagin a Santander para gastar allí.
--
-- Se reconocen por el concepto: son cantidades redondas que se sacan
-- para el día a día. El gasto real ya está en el extracto de
-- Santander, así que aquí sólo es un movimiento entre cuentas.
-- -------------------------------------------------------------
UPDATE transacciones t
SET tipo_movimiento = 'transferencia_interna',
    cuenta_destino_id = (SELECT id FROM cuentas WHERE nombre = 'Santander'),
    categoria_id = NULL,
    notas = COALESCE(t.notas, '') ||
            ' · Traspaso a Santander para gastar allí, no un gasto de Imagin.'
WHERE t.tipo_movimiento = 'gasto'
  AND t.cuenta_id = (SELECT id FROM cuentas WHERE nombre = 'Imagin')
  AND t.concepto ~* '^(compra|compra semanal|mercadona|gastos|gastos varios|gastos varios men|personal transfer)$';

-- -------------------------------------------------------------
-- 3. Traspasos a cuentas de ahorro propias.
--
-- Van a B100 por defecto, que es la de ahorro habitual. Los que
-- fueron a otra entidad se pueden corregir desde la app.
-- -------------------------------------------------------------
UPDATE transacciones t
SET tipo_movimiento = 'transferencia_interna',
    cuenta_destino_id = (SELECT id FROM cuentas WHERE nombre = 'B100'),
    categoria_id = NULL,
    notas = COALESCE(t.notas, '') || ' · Traspaso a ahorro, no un gasto.'
WHERE t.tipo_movimiento = 'gasto'
  AND t.concepto ~* '^ahorro|ahorro casa$|ahorro mensual$|ahorro openbank$'
  AND t.cuenta_id <> (SELECT id FROM cuentas WHERE nombre = 'B100');

-- -------------------------------------------------------------
-- Comprobación: cuánto deja de contarse como gasto.
-- -------------------------------------------------------------
SELECT
  to_char(date_trunc('month', fecha), 'YYYY-MM') AS mes,
  COUNT(*)::int                                  AS traspasos,
  SUM(importe)                                   AS total
FROM transacciones
WHERE tipo_movimiento = 'transferencia_interna'
  AND notas ILIKE '%no un gasto%'
GROUP BY 1
ORDER BY 1 DESC
LIMIT 8;
