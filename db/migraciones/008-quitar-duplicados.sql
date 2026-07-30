-- =============================================================
-- Migración 008 · Quitar movimientos duplicados
--
-- La importación se ejecutó dos veces y entraron 254 movimientos
-- repetidos: el mismo gasto de Mercadona dos veces, la misma cuota de
-- autónomos dos veces. Los meses salían con el doble de gastos de los
-- reales.
--
-- La comprobación de duplicados del importador guarda en memoria lo que
-- ya existe, pero en la segunda pasada partía de una lista cargada
-- antes de que la primera terminara de escribir.
--
-- Se conserva el más antiguo de cada grupo (el primero que entró) y se
-- borran los demás.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente: si no hay
-- duplicados, no borra nada.
-- =============================================================

-- Cuántos hay antes de tocar nada.
SELECT COUNT(*)::int AS movimientos_antes FROM transacciones;

WITH numerados AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY fecha, cuenta_id, importe, tipo_movimiento, concepto
      ORDER BY creada_en, id
    ) AS n
  FROM transacciones
)
DELETE FROM transacciones
WHERE id IN (SELECT id FROM numerados WHERE n > 1);

-- Comprobación: cuántos quedan y si sigue habiendo repetidos.
SELECT
  (SELECT COUNT(*)::int FROM transacciones) AS movimientos_despues,
  (SELECT COALESCE(SUM(veces - 1), 0)::int FROM (
     SELECT COUNT(*) AS veces
     FROM transacciones
     GROUP BY fecha, cuenta_id, importe, tipo_movimiento, concepto
     HAVING COUNT(*) > 1
   ) x) AS duplicados_restantes;
