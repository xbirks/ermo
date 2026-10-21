-- 024 · Usuarios, sesiones y código por correo
--
-- Hasta ahora se entraba con una contraseña única en una variable de
-- entorno y una cookie firmada de 30 días que no se podía revocar.
--
-- A partir de aquí:
--   - sólo entran los emails de la tabla `usuarios`, cada uno con su
--     contraseña (hash scrypt) y su rol;
--   - tras la contraseña llega un código de 6 dígitos al correo;
--   - cada sesión es una fila: se puede cerrar desde el servidor;
--   - los intentos fallidos se cuentan para frenar la fuerza bruta;
--   - todo lo que se escribe queda en `auditoria` con su autor.

CREATE TABLE IF NOT EXISTS usuarios (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text NOT NULL UNIQUE CHECK (email = lower(email)),
    nombre        text NOT NULL,
    -- propietario: todo. asistente: leer, apuntar movimientos y anotar
    -- (nota y categoría) los existentes. Nunca borrar.
    rol           text NOT NULL CHECK (rol IN ('propietario', 'asistente')),
    password_hash text NOT NULL,
    activo        boolean NOT NULL DEFAULT true,
    creado_en     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sesiones (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    creada_en   timestamptz NOT NULL DEFAULT now(),
    expira_en   timestamptz NOT NULL,
    revocada_en timestamptz,
    ultimo_uso  timestamptz NOT NULL DEFAULT now(),
    ip          text,
    lugar       text,
    agente      text
);
CREATE INDEX IF NOT EXISTS sesiones_usuario ON sesiones (usuario_id) WHERE revocada_en IS NULL;

CREATE TABLE IF NOT EXISTS codigos_acceso (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_hash text NOT NULL,           -- HMAC del código: nunca en claro
    expira_en   timestamptz NOT NULL,
    intentos    smallint NOT NULL DEFAULT 0,
    usado_en    timestamptz,
    creado_en   timestamptz NOT NULL DEFAULT now(),
    ip          text
);

CREATE TABLE IF NOT EXISTS intentos_acceso (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email      text,
    ip         text,
    resultado  text NOT NULL,            -- ok, password_mal, codigo_mal, bloqueado, codigo_enviado
    creado_en  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS intentos_recientes ON intentos_acceso (creado_en DESC);

CREATE TABLE IF NOT EXISTS auditoria (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id  uuid REFERENCES usuarios(id),
    fecha       timestamptz NOT NULL DEFAULT now(),
    metodo      text NOT NULL,
    ruta        text NOT NULL,
    cuerpo      jsonb,
    ip          text
);
CREATE INDEX IF NOT EXISTS auditoria_fecha ON auditoria (fecha DESC);

-- Quién apuntó o tocó por última vez cada movimiento.
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS creada_por     uuid REFERENCES usuarios(id);
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS modificada_por uuid REFERENCES usuarios(id);

-- Las tablas nuevas, igual de cerradas que el resto (ver 023).
ALTER TABLE usuarios        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_acceso  ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentos_acceso ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria       ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON usuarios, sesiones, codigos_acceso, intentos_acceso, auditoria FROM anon, authenticated;
