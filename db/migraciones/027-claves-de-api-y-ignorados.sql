-- 027 · Claves de API para el asistente y movimientos del banco descartados
--
-- Claves de API: el asistente (Grok) entra por /api/finanzas/bot/* con
-- una clave propia en lugar de navegar por la web con contraseña y
-- código. La clave tiene los permisos de su usuario (rol asistente), se
-- guarda sólo su hash y se puede revocar desde la terminal.
--
-- Ignorados: si se borra un movimiento que vino del banco (por ejemplo,
-- la otra mitad de un traspaso ya apuntado), su referencia se guarda
-- aquí para que la siguiente lectura no lo vuelva a importar.

CREATE TABLE IF NOT EXISTS claves_api (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre          text NOT NULL,
    hash            text NOT NULL UNIQUE,      -- sha256 de la clave: nunca en claro
    prefijo         text NOT NULL,             -- primeros caracteres, para reconocerla
    creada_en       timestamptz NOT NULL DEFAULT now(),
    revocada_en     timestamptz,
    ultimo_uso      timestamptz,
    ultimo_aviso    date,                      -- un aviso a Discord por día de uso
    ventana_inicio  timestamptz NOT NULL DEFAULT now(),
    peticiones      integer NOT NULL DEFAULT 0 -- en la ventana de una hora
);

CREATE TABLE IF NOT EXISTS banco_ignorados (
    cuenta_id  uuid NOT NULL REFERENCES cuentas(id),
    ref        text NOT NULL,
    creado_en  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (cuenta_id, ref)
);

ALTER TABLE claves_api      ENABLE ROW LEVEL SECURITY;
ALTER TABLE banco_ignorados ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON claves_api, banco_ignorados FROM anon, authenticated;
