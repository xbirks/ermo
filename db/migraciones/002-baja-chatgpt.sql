-- =============================================================
-- Migración 002 · Dar de baja ChatGPT
--
-- Ya no se paga. Se desactiva en lugar de borrarlo para que los
-- movimientos de meses anteriores conserven su categoría.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

UPDATE categorias
SET activa = false,
    es_fijo = false,
    notas = COALESCE(notas, 'Dado de baja: ya no se paga.')
WHERE nombre = 'ChatGPT';

-- Comprobación: los recibos fijos que quedan y lo que suman.
SELECT
  cu.nombre           AS cuenta,
  COUNT(*)            AS recibos,
  SUM(c.importe_previsto) AS total_mes
FROM categorias c
LEFT JOIN cuentas cu ON cu.id = c.cuenta_id
WHERE c.es_fijo AND c.activa AND c.cada_meses = 1
GROUP BY cu.nombre
ORDER BY cu.nombre;
