-- =============================================================
-- ERMO · Finanzas personales
-- Esquema para Postgres (Neon / Supabase)
--
-- Ejecutar una sola vez, en orden, sobre una base de datos vacía.
-- Es idempotente: se puede volver a lanzar sin romper nada.
-- =============================================================

-- gen_random_uuid() es nativo desde Postgres 13, así que no hace falta
-- ninguna extensión. Neon y Supabase van muy por encima de esa versión.

-- -------------------------------------------------------------
-- CUENTAS
-- Las 5 cuentas reales del sistema. "Cartera Efectivo" es
-- virtual: representa el dinero en mano.
-- -------------------------------------------------------------
-- Postgres no admite `CREATE TYPE IF NOT EXISTS`, así que los tipos se
-- crean con un bloque que ignora el error si ya existen. Sin esto,
-- relanzar el script tras un fallo a medias se cortaría aquí.
DO $$ BEGIN
  CREATE TYPE tipo_cuenta AS ENUM ('corriente', 'ahorro', 'inversion', 'efectivo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cuentas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT NOT NULL UNIQUE,
  tipo          tipo_cuenta NOT NULL,
  -- saldo_actual NO se escribe a mano: lo recalcula el trigger de
  -- abajo a partir de las transacciones. Así nunca puede
  -- desincronizarse del histórico real.
  saldo_actual  NUMERIC(12,2) NOT NULL DEFAULT 0,
  orden         SMALLINT NOT NULL DEFAULT 0,  -- para ordenar en pantalla
  creada_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------------
-- CATEGORIAS
-- es_fijo distingue los gastos que se repiten cada mes (gestoría,
-- seguro, coche, Digi, cuota de autónomos) de los variables.
-- Es lo que permite proyectar el mes antes de que ocurra.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre         TEXT NOT NULL UNIQUE,
  es_fijo        BOOLEAN NOT NULL DEFAULT false,
  -- importe esperado al mes, sólo para las fijas. Sirve para avisar
  -- si un recibo sube (el "OJO SEGURO MOTO / RENOVAR o 68€").
  importe_previsto NUMERIC(12,2),
  creada_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------------
-- TRANSACCIONES
-- Un único registro para ingresos, gastos y movimientos entre
-- cuentas propias. Sacar dinero del cajero es
-- 'transferencia_interna', nunca un gasto.
-- -------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE tipo_movimiento AS ENUM ('ingreso', 'gasto', 'transferencia_interna');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS transacciones (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha             DATE NOT NULL,
  cuenta_id         UUID NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,
  cuenta_destino_id UUID REFERENCES cuentas(id) ON DELETE RESTRICT,
  categoria_id      UUID REFERENCES categorias(id) ON DELETE SET NULL,
  concepto          TEXT NOT NULL,
  -- Siempre positivo. El signo lo determina tipo_movimiento.
  -- Guardar importes negativos es la forma más rápida de que los
  -- totales dejen de cuadrar, así que la BD lo prohíbe.
  importe           NUMERIC(12,2) NOT NULL CHECK (importe > 0),
  tipo_movimiento   tipo_movimiento NOT NULL,
  notas             TEXT,
  creada_en         TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Coherencia: destino obligatorio si y sólo si es transferencia,
  -- y no se puede transferir una cuenta a sí misma.
  CONSTRAINT destino_solo_en_transferencias CHECK (
    (tipo_movimiento = 'transferencia_interna' AND cuenta_destino_id IS NOT NULL)
    OR
    (tipo_movimiento <> 'transferencia_interna' AND cuenta_destino_id IS NULL)
  ),
  CONSTRAINT destino_distinto_origen CHECK (
    cuenta_destino_id IS NULL OR cuenta_destino_id <> cuenta_id
  )
);

-- El índice por fecha ya sirve para las consultas de un mes, porque se
-- filtran con un rango (fecha >= día 1 AND fecha < día 1 del siguiente)
-- en lugar de con date_trunc sobre la columna.
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha   ON transacciones (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_transacciones_cuenta  ON transacciones (cuenta_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_destino ON transacciones (cuenta_destino_id);

-- -------------------------------------------------------------
-- PROVISIONES DE IVA
-- El IVA se devenga por mes pero se paga por trimestre. En las
-- hojas de papel esto aparece como "452 + 452 + 525 = 1429€":
-- tres meses retenidos que se liquidan de golpe.
--
-- Por eso hay trimestre_fiscal además de mes_referencia: permite
-- sumar lo retenido de un trimestre y marcarlo como pagado en un
-- solo gesto.
-- -------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE estado_provision AS ENUM ('retenido', 'pagado_hacienda');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS provisiones_iva (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Siempre el día 1 del mes al que corresponde el IVA.
  mes_referencia     DATE NOT NULL UNIQUE,
  importe_calculado  NUMERIC(12,2) NOT NULL CHECK (importe_calculado >= 0),
  estado             estado_provision NOT NULL DEFAULT 'retenido',
  -- Trimestre en que se liquida, formato '2026-T1'. Se calcula
  -- automáticamente desde mes_referencia (ver trigger).
  trimestre_fiscal   TEXT NOT NULL,
  -- Cuenta donde está aparcado el dinero (normalmente Imagin).
  cuenta_id          UUID REFERENCES cuentas(id) ON DELETE SET NULL,
  fecha_pago         DATE,
  notas              TEXT,
  creada_en          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT pagado_necesita_fecha CHECK (
    estado <> 'pagado_hacienda' OR fecha_pago IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_provisiones_estado    ON provisiones_iva (estado);
CREATE INDEX IF NOT EXISTS idx_provisiones_trimestre ON provisiones_iva (trimestre_fiscal);

-- Rellena trimestre_fiscal solo, para no depender de acordarse.
CREATE OR REPLACE FUNCTION fn_set_trimestre_fiscal()
RETURNS TRIGGER AS $$
BEGIN
  NEW.trimestre_fiscal :=
    to_char(NEW.mes_referencia, 'YYYY') || '-T' ||
    to_char(NEW.mes_referencia, 'Q');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trimestre_fiscal ON provisiones_iva;
CREATE TRIGGER trg_trimestre_fiscal
  BEFORE INSERT OR UPDATE OF mes_referencia ON provisiones_iva
  FOR EACH ROW EXECUTE FUNCTION fn_set_trimestre_fiscal();

-- -------------------------------------------------------------
-- RESERVAS
-- Dinero que está en la cuenta pero NO es gastable, con el motivo
-- escrito al lado. Nace directamente de las notas a mano:
--
--   "queda un residuo de 409€. NO TOCAR. Esperar a la declaración
--    de renta y si no para el seguro"
--
-- Ese 409€ aparece arrastrado en abril, mayo y junio. No es una
-- transacción (el dinero no se ha movido) ni un gasto (no se ha
-- gastado): es saldo bloqueado esperando una condición.
-- -------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE estado_reserva AS ENUM ('activa', 'liberada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS reservas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto       TEXT NOT NULL,
  importe        NUMERIC(12,2) NOT NULL CHECK (importe > 0),
  cuenta_id      UUID NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,
  -- Por qué está retenido y cuándo se podrá tocar. Texto libre a
  -- propósito: "esperar declaración de renta" no es un enum.
  motivo         TEXT,
  estado         estado_reserva NOT NULL DEFAULT 'activa',
  creada_en      DATE NOT NULL DEFAULT CURRENT_DATE,
  liberada_en    DATE,

  CONSTRAINT liberada_necesita_fecha CHECK (
    estado <> 'liberada' OR liberada_en IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas (estado);

-- -------------------------------------------------------------
-- SALDOS AUTOMÁTICOS
-- Recalcula saldo_actual de las cuentas afectadas cada vez que se
-- toca una transacción. Cubre INSERT, UPDATE y DELETE, y también
-- el caso de mover una transacción de una cuenta a otra.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_recalcular_saldo(p_cuenta_id UUID)
RETURNS VOID AS $$
BEGIN
  IF p_cuenta_id IS NULL THEN RETURN; END IF;

  UPDATE cuentas c SET saldo_actual = COALESCE((
    SELECT
      -- entra: ingresos propios + transferencias recibidas
      SUM(CASE
            WHEN t.tipo_movimiento = 'ingreso'  AND t.cuenta_id = c.id THEN t.importe
            WHEN t.tipo_movimiento = 'transferencia_interna'
                 AND t.cuenta_destino_id = c.id THEN t.importe
            -- sale: gastos + transferencias enviadas
            WHEN t.tipo_movimiento = 'gasto'    AND t.cuenta_id = c.id THEN -t.importe
            WHEN t.tipo_movimiento = 'transferencia_interna'
                 AND t.cuenta_id = c.id THEN -t.importe
            ELSE 0
          END)
    FROM transacciones t
    WHERE t.cuenta_id = c.id OR t.cuenta_destino_id = c.id
  ), 0)
  WHERE c.id = p_cuenta_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_trg_saldos()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalcula todas las cuentas implicadas, antes y después del
  -- cambio, para que un UPDATE que cambie de cuenta deje bien las dos.
  IF TG_OP IN ('DELETE', 'UPDATE') THEN
    PERFORM fn_recalcular_saldo(OLD.cuenta_id);
    PERFORM fn_recalcular_saldo(OLD.cuenta_destino_id);
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM fn_recalcular_saldo(NEW.cuenta_id);
    PERFORM fn_recalcular_saldo(NEW.cuenta_destino_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_saldos ON transacciones;
CREATE TRIGGER trg_saldos
  AFTER INSERT OR UPDATE OR DELETE ON transacciones
  FOR EACH ROW EXECUTE FUNCTION fn_trg_saldos();

-- -------------------------------------------------------------
-- VISTA: SALDO DISPONIBLE REAL
-- La diferencia entre lo que dice el banco y lo que puedes gastar.
-- Resta el IVA retenido y las reservas activas de cada cuenta.
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW v_saldo_disponible AS
SELECT
  c.id,
  c.nombre,
  c.tipo,
  c.saldo_actual,
  COALESCE(iva.retenido, 0)   AS iva_retenido,
  COALESCE(res.reservado, 0)  AS reservado,
  c.saldo_actual
    - COALESCE(iva.retenido, 0)
    - COALESCE(res.reservado, 0)                AS disponible
FROM cuentas c
LEFT JOIN (
  SELECT cuenta_id, SUM(importe_calculado) AS retenido
  FROM provisiones_iva
  WHERE estado = 'retenido'
  GROUP BY cuenta_id
) iva ON iva.cuenta_id = c.id
LEFT JOIN (
  SELECT cuenta_id, SUM(importe) AS reservado
  FROM reservas
  WHERE estado = 'activa'
  GROUP BY cuenta_id
) res ON res.cuenta_id = c.id;

-- -------------------------------------------------------------
-- VISTA: RESUMEN MENSUAL EN CASCADA
-- Reproduce la hoja de papel, en el mismo orden y con los mismos
-- cortes. Ojo al orden: el reparto a ahorro/inversión NO se resta
-- para llegar al total limpio, porque en las hojas el reparto se
-- hace DESPUÉS de tener el limpio. Se muestra aparte.
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW v_resumen_mensual AS
WITH meses AS (
  SELECT DISTINCT date_trunc('month', fecha)::date AS mes FROM transacciones
),
mov AS (
  SELECT
    date_trunc('month', t.fecha)::date AS mes,
    -- Ingresos: de banco y de efectivo por separado, porque en las
    -- hojas el cash de clientes se apunta aparte.
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso' AND c.tipo <> 'efectivo'
             THEN t.importe ELSE 0 END)                       AS ingresos_banco,
    SUM(CASE WHEN t.tipo_movimiento = 'ingreso' AND c.tipo = 'efectivo'
             THEN t.importe ELSE 0 END)                       AS ingresos_efectivo,
    -- Gastos fijos vs variables (según categorias.es_fijo).
    SUM(CASE WHEN t.tipo_movimiento = 'gasto' AND cat.es_fijo
             THEN t.importe ELSE 0 END)                       AS gastos_fijos,
    SUM(CASE WHEN t.tipo_movimiento = 'gasto' AND NOT COALESCE(cat.es_fijo, false)
             THEN t.importe ELSE 0 END)                       AS gastos_variables,
    -- Reparto: lo que se aparta a ahorro e inversión. Informativo.
    SUM(CASE WHEN t.tipo_movimiento = 'transferencia_interna'
                  AND cd.tipo IN ('ahorro', 'inversion')
             THEN t.importe ELSE 0 END)                       AS a_ahorro_inversion
  FROM transacciones t
  JOIN cuentas c            ON c.id  = t.cuenta_id
  LEFT JOIN cuentas cd      ON cd.id = t.cuenta_destino_id
  LEFT JOIN categorias cat  ON cat.id = t.categoria_id
  GROUP BY 1
)
SELECT
  m.mes,
  COALESCE(mov.ingresos_banco, 0)                      AS ingresos_banco,
  COALESCE(mov.ingresos_efectivo, 0)                   AS ingresos_efectivo,
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)               AS ingresos_totales,
  COALESCE(mov.gastos_fijos, 0)                        AS gastos_fijos,
  COALESCE(mov.gastos_variables, 0)                    AS gastos_variables,
  COALESCE(iva.importe_calculado, 0)                   AS iva_provisionado,
  -- TOTAL LIMPIO: ingresos - gastos - IVA del mes.
  COALESCE(mov.ingresos_banco, 0)
    + COALESCE(mov.ingresos_efectivo, 0)
    - COALESCE(mov.gastos_fijos, 0)
    - COALESCE(mov.gastos_variables, 0)
    - COALESCE(iva.importe_calculado, 0)               AS total_limpio,
  -- Lo que se reparte a ahorro/inversión, ya con el limpio en mano.
  COALESCE(mov.a_ahorro_inversion, 0)                  AS a_ahorro_inversion
FROM meses m
LEFT JOIN mov ON mov.mes = m.mes
LEFT JOIN provisiones_iva iva ON iva.mes_referencia = m.mes
ORDER BY m.mes DESC;
