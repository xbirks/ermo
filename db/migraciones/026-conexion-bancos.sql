-- 026 · Conexión con los bancos (Enable Banking, solo lectura)
--
-- Cada cuenta conectada guarda la sesión de Enable Banking (válida hasta
-- 180 días), desde qué fecha se importa y cómo fue la última lectura.
-- El id de sesión no sirve de nada sin la clave privada de la app, que
-- sólo vive en las variables de entorno.

CREATE TABLE IF NOT EXISTS conexiones_banco (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cuenta_id       uuid NOT NULL REFERENCES cuentas(id),
    aspsp           text NOT NULL,           -- nombre del banco en Enable Banking
    session_id      text NOT NULL,
    account_uid     text NOT NULL,
    iban            text,
    valida_hasta    timestamptz NOT NULL,
    importar_desde  date NOT NULL,           -- lo anterior ya estaba apuntado a mano
    creada_en       timestamptz NOT NULL DEFAULT now(),
    ultima_lectura  timestamptz,
    ultimo_error    text,
    saldo_banco     numeric(12, 2),
    saldo_banco_en  timestamptz,
    activa          boolean NOT NULL DEFAULT true
);
-- Una conexión activa por cuenta: al renovar, la anterior se desactiva.
CREATE UNIQUE INDEX IF NOT EXISTS conexion_activa_por_cuenta ON conexiones_banco (cuenta_id) WHERE activa;

-- El "state" de cada autorización: evita que alguien cuele en la vuelta
-- del banco un código que no pidió esta app.
CREATE TABLE IF NOT EXISTS estados_banco (
    state       text PRIMARY KEY,
    cuenta_id   uuid NOT NULL REFERENCES cuentas(id),
    usuario_id  uuid NOT NULL REFERENCES usuarios(id),
    creado_en   timestamptz NOT NULL DEFAULT now(),
    usado_en    timestamptz
);

-- De dónde viene cada movimiento y su referencia en el banco, para no
-- importarlo dos veces. Un traspaso entre cuentas propias tiene dos
-- referencias: la salida y la entrada.
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS origen text NOT NULL DEFAULT 'manual'
    CHECK (origen IN ('manual', 'banco'));
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS ref_banco text;
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS ref_banco_destino text;
CREATE UNIQUE INDEX IF NOT EXISTS transacciones_ref_banco ON transacciones (cuenta_id, ref_banco) WHERE ref_banco IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS transacciones_ref_banco_destino ON transacciones (cuenta_destino_id, ref_banco_destino) WHERE ref_banco_destino IS NOT NULL;

-- Igual de cerradas que el resto (ver 023).
ALTER TABLE conexiones_banco ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados_banco    ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON conexiones_banco, estados_banco FROM anon, authenticated;
