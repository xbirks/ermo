-- =============================================================
-- Comprobación rápida de que la base quedó bien montada.
-- Devuelve una fila por cosa a verificar, con OK o FALTA.
-- Ejecutar en el SQL Editor después de schema.sql y seed.sql.
-- =============================================================

SELECT 'cuentas' AS que,
       COUNT(*)::text || ' de 5' AS valor,
       CASE WHEN COUNT(*) = 5 THEN 'OK' ELSE 'FALTA' END AS estado
FROM cuentas
UNION ALL
SELECT 'categorías',
       COUNT(*)::text || ' de 18',
       CASE WHEN COUNT(*) = 18 THEN 'OK' ELSE 'FALTA' END
FROM categorias
UNION ALL
SELECT 'reserva de 409 €',
       COALESCE(SUM(importe)::text || ' €', 'ninguna'),
       CASE WHEN SUM(importe) = 409 THEN 'OK' ELSE 'FALTA' END
FROM reservas WHERE estado = 'activa'
UNION ALL
SELECT 'tipos ENUM',
       COUNT(DISTINCT typname)::text || ' de 4',
       CASE WHEN COUNT(DISTINCT typname) = 4 THEN 'OK' ELSE 'FALTA' END
FROM pg_type
WHERE typname IN ('tipo_cuenta','tipo_movimiento','estado_provision','estado_reserva')
UNION ALL
SELECT 'vistas de cálculo',
       COUNT(*)::text || ' de 2',
       CASE WHEN COUNT(*) = 2 THEN 'OK' ELSE 'FALTA' END
FROM pg_views
WHERE viewname IN ('v_saldo_disponible','v_resumen_mensual')
UNION ALL
SELECT 'triggers',
       COUNT(*)::text || ' de 2',
       CASE WHEN COUNT(*) = 2 THEN 'OK' ELSE 'FALTA' END
FROM pg_trigger
WHERE tgname IN ('trg_saldos','trg_trimestre_fiscal')
UNION ALL
SELECT 'gastos fijos previstos',
       COALESCE(SUM(importe_previsto)::text || ' €', '0'),
       CASE WHEN SUM(importe_previsto) > 0 THEN 'OK' ELSE 'FALTA' END
FROM categorias WHERE es_fijo;
