-- =============================================================
-- Migración 010 · Efectivo real en mano
--
-- La Cartera Efectivo salía en 2.350 €, que es la suma de todos los
-- reintegros de cajero reclasificados. Pero ese dinero ya se fue
-- gastando: en mano hay 450 €.
--
-- Igual que las demás cuentas, pasa a saldo declarado. El efectivo no
-- se puede calcular sumando movimientos, porque los gastos en metálico
-- no dejan rastro en ningún extracto.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

UPDATE cuentas SET
  saldo_manual = true,
  saldo_declarado = 450.00,
  saldo_declarado_en = CURRENT_DATE
WHERE nombre = 'Cartera Efectivo';

-- Comprobación.
SELECT nombre, saldo_manual, saldo_actual, disponible
FROM v_saldo_disponible
ORDER BY nombre;
