-- =============================================================
-- Migración 015 · "Parking" y "Plaza de garaje" son el mismo recibo
--
-- Dos categorías fijas de 130 € para el mismo gasto: "Plaza de
-- garaje" (dada de alta en la migración 013, con el pago de agosto ya
-- apuntado) y "Parking" (creada aparte, sin ningún apunte). Por eso
-- seguía saliendo como recibo pendiente en agosto aunque ya estaba
-- pagado: no era el mismo que se marcó, era el otro.
--
-- Se desactiva "Parking" y cualquier movimiento que tuviera esa
-- categoría pasa a "Plaza de garaje", para no perder histórico si
-- llegó a usarse.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

UPDATE transacciones
SET categoria_id = (SELECT id FROM categorias WHERE nombre = 'Plaza de garaje')
WHERE categoria_id = (SELECT id FROM categorias WHERE nombre = 'Parking');

UPDATE categorias
SET activa = false, es_fijo = false,
    notas = COALESCE(notas, 'Duplicado de "Plaza de garaje": mismo gasto, dado de baja.')
WHERE nombre = 'Parking';

-- Comprobación: sólo debería quedar una activa.
SELECT nombre, activa, es_fijo, importe_previsto
FROM categorias
WHERE nombre IN ('Parking', 'Plaza de garaje');
