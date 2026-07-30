-- =============================================================
-- Migración 005 · Saldo real de las cuentas corrientes
--
-- Santander salía en −4.694 € cuando el propio extracto dice 68,04 €.
--
-- La causa: al importar se excluyen las transferencias entre cuentas
-- propias, para que mover dinero de Imagin a Santander no cuente como
-- un ingreso del mes (inflaría los ingresos con dinero que ya tenías).
-- Pero al no registrarlas de ninguna forma, la cuenta se queda con los
-- gastos y sin las entradas que los compensan: 224 gastos frente a 11
-- ingresos.
--
-- Mientras no estén todas las cuentas conectadas, el saldo de las
-- corrientes también se declara a mano, con la cifra que da el propio
-- extracto del banco.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- Saldo de Santander a 30 de julio de 2026, según su extracto.
UPDATE cuentas
SET saldo_manual = true,
    saldo_declarado = 68.04,
    saldo_declarado_en = DATE '2026-07-30'
WHERE nombre = 'Santander' AND saldo_declarado IS NULL;

-- Comprobación.
SELECT nombre, saldo_manual, saldo_actual, disponible
FROM v_saldo_disponible
ORDER BY nombre;
