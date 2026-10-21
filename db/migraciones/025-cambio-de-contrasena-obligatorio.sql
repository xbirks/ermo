-- 025 · Contraseña temporal con cambio obligatorio
--
-- Las cuentas se crean con una contraseña temporal. Mientras
-- `debe_cambiar` sea true, la sesión sólo da acceso a la pantalla de
-- cambio de contraseña: ni datos ni escrituras.

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS debe_cambiar boolean NOT NULL DEFAULT true;
