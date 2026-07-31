-- =============================================================
-- Migración 012 · El saldo declarado se actualiza con los movimientos
--
-- Al poner un saldo a mano, la cifra se quedaba congelada: anotar un
-- gasto de 302 € en Santander no la movía. Había que volver a escribir
-- el saldo cada vez, lo que hace inútil apuntar nada.
--
-- Ahora el saldo declarado funciona como un punto de partida con
-- fecha: «el 30 de julio había 2.575 €». A partir de ahí, la app suma
-- lo que entra y resta lo que sale, igual que el banco.
--
-- Así se puede apuntar un traspaso de Imagin a Santander y las dos
-- cuentas se ajustan solas.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

DROP VIEW IF EXISTS v_patrimonio;
DROP VIEW IF EXISTS v_saldo_disponible;

CREATE VIEW v_saldo_disponible AS
WITH
-- Lo que se ha movido DESPUÉS de la fecha en que se declaró el saldo.
-- Los movimientos anteriores ya están dentro de esa cifra, así que
-- contarlos otra vez la falsearía.
posteriores AS (
  SELECT
    c.id AS cuenta_id,
    COALESCE(SUM(
      CASE
        WHEN t.tipo_movimiento = 'ingreso' AND t.cuenta_id = c.id THEN t.importe
        WHEN t.tipo_movimiento = 'transferencia_interna'
             AND t.cuenta_destino_id = c.id THEN t.importe
        WHEN t.tipo_movimiento = 'gasto' AND t.cuenta_id = c.id THEN -t.importe
        WHEN t.tipo_movimiento = 'transferencia_interna'
             AND t.cuenta_id = c.id THEN -t.importe
        ELSE 0
      END
    ), 0) AS variacion
  FROM cuentas c
  LEFT JOIN transacciones t
    ON (t.cuenta_id = c.id OR t.cuenta_destino_id = c.id)
   AND c.saldo_declarado_en IS NOT NULL
   AND t.fecha > c.saldo_declarado_en
  GROUP BY c.id
)
SELECT
  c.id,
  c.nombre,
  c.tipo,
  c.saldo_manual,
  c.saldo_declarado_en,
  -- El saldo de hoy: lo declarado más lo que se ha movido desde
  -- entonces. Sin saldo declarado, lo calculado por el trigger.
  CASE
    WHEN c.saldo_manual AND c.saldo_declarado IS NOT NULL
      THEN c.saldo_declarado + COALESCE(p.variacion, 0)
    ELSE c.saldo_actual
  END                                           AS saldo_actual,
  COALESCE(iva.retenido, 0)                     AS iva_retenido,
  COALESCE(res.reservado, 0)                    AS reservado,
  CASE
    WHEN c.saldo_manual AND c.saldo_declarado IS NOT NULL
      THEN c.saldo_declarado + COALESCE(p.variacion, 0)
    ELSE c.saldo_actual
  END
    - COALESCE(iva.retenido, 0)
    - COALESCE(res.reservado, 0)                AS disponible
FROM cuentas c
LEFT JOIN posteriores p ON p.cuenta_id = c.id
LEFT JOIN (
  SELECT cuenta_id, SUM(importe_calculado) AS retenido
  FROM provisiones_iva WHERE estado = 'retenido' GROUP BY cuenta_id
) iva ON iva.cuenta_id = c.id
LEFT JOIN (
  SELECT cuenta_id, SUM(importe) AS reservado
  FROM reservas WHERE estado = 'activa' GROUP BY cuenta_id
) res ON res.cuenta_id = c.id;

-- La vista de patrimonio depende de la anterior: se recrea igual.
CREATE VIEW v_patrimonio AS
SELECT
  (SELECT COALESCE(SUM(disponible), 0) FROM v_saldo_disponible
    WHERE tipo IN ('corriente', 'efectivo'))            AS para_gastar,
  (SELECT COALESCE(SUM(disponible), 0) FROM v_saldo_disponible
    WHERE tipo IN ('ahorro', 'inversion'))              AS ahorrado,
  (SELECT COALESCE(SUM(pendiente), 0) FROM deudas)      AS se_debe,
  (SELECT COALESCE(SUM(disponible), 0) FROM v_saldo_disponible)
    - (SELECT COALESCE(SUM(pendiente), 0) FROM deudas)  AS patrimonio_neto;

-- Comprobación.
SELECT nombre, saldo_declarado_en, saldo_actual, disponible
FROM v_saldo_disponible
ORDER BY nombre;
