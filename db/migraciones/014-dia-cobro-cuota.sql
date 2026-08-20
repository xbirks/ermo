-- =============================================================
-- Migración 014 · El día de cobro de la cuota de autónomos
--
-- Estaba puesto a 10, un valor a ojo sacado del papel cuando aún no
-- había ningún extracto real que lo confirmara. El único cargo real
-- que se ha visto en un extracto fue el 31 de julio de 2026.
--
-- Se pone a 31, no porque vaya a cobrarse siempre ese día exacto, sino
-- porque la app recorta cualquier día por encima del último real del
-- mes: en un mes de 30 días queda en 30, en febrero en 28. Funciona
-- como "el último día del mes" sin tener que guardar un valor distinto
-- para cada uno.
--
-- Con esto empieza a mostrarse una fecha prevista de cobro junto al
-- aviso de "Para Hacienda". Habrá que confirmar con un par de meses
-- más si el día real varía.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

UPDATE categorias
SET dia_cobro = 31,
    notas = COALESCE(notas, 'Cargo real visto el 31/07/2026. dia_cobro=31 funciona como "fin de mes".')
WHERE nombre = 'Cuota autónomos'
  AND dia_cobro = 10;

-- Comprobación.
SELECT nombre, dia_cobro FROM categorias WHERE nombre = 'Cuota autónomos';
