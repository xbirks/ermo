-- =============================================================
-- Migración 013 (db/migraciones) · Dos cabos sueltos de agosto
--
-- Después de aplicar db/datos-bancos/013-agosto-2026.sql (que no se
-- sube al repositorio: lleva movimientos reales) salieron dos
-- correcciones que sí conviene dejar escritas, porque no exponen
-- ningún dato personal:
--
-- 1. El aire acondicionado se pagó el 30 de julio, no el 27 que se
--    había asumido a falta de la fecha exacta.
--
-- 2. El accidente de moto fue el 29 de mayo de 2026. Cualquier taxi
--    fechado antes de ese día no lo puede haber causado el accidente,
--    así que no es reembolsable: se saca de "Taxis del accidente" y
--    pasa a gasto normal.
--
-- Escrita para poder relanzarse sin importar si ya se aplicó el
-- ajuste puntual que se dio antes de tener esta migración: si no
-- encuentra nada que corregir, no hace nada.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Fecha del aire acondicionado.
-- -------------------------------------------------------------
UPDATE transacciones
SET fecha = DATE '2026-07-30'
WHERE cuenta_id = (SELECT id FROM cuentas WHERE nombre = 'Cartera Efectivo')
  AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Casa y reformas')
  AND importe = 1100.00
  AND fecha = DATE '2026-07-27';

-- -------------------------------------------------------------
-- 2. Taxis anteriores al accidente (29/05/2026) dejan de marcarse
--    como reembolsables. Se quedan como gasto normal, sin tocar
--    fecha ni importe.
-- -------------------------------------------------------------
UPDATE transacciones
SET categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos varios')
WHERE categoria_id = (SELECT id FROM categorias WHERE nombre = 'Taxis del accidente')
  AND fecha < DATE '2026-05-29';

-- -------------------------------------------------------------
-- Comprobaciones.
-- -------------------------------------------------------------

-- El aire, con su fecha ya corregida.
SELECT fecha, importe FROM transacciones
WHERE categoria_id = (SELECT id FROM categorias WHERE nombre = 'Casa y reformas');

-- No debería quedar ningún taxi antes del 29 de mayo.
SELECT COUNT(*) AS taxis_antes_del_accidente
FROM transacciones
WHERE categoria_id = (SELECT id FROM categorias WHERE nombre = 'Taxis del accidente')
  AND fecha < DATE '2026-05-29';

-- Lo que queda pendiente de cobrar al seguro, ya limpio.
SELECT COUNT(*) AS num_taxis, SUM(t.importe) AS total_pendiente
FROM transacciones t
JOIN categorias c ON c.id = t.categoria_id
WHERE c.recuperable AND t.reembolsado_en IS NULL;
