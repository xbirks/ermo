-- 023 · Cerrar la base a los roles públicos de Supabase
--
-- Supabase expone el esquema `public` por su API REST (PostgREST) y por
-- GraphQL. Quien tenga la clave pública del proyecto (la "anon key",
-- pensada para ir en el navegador) entra como `anon`; con un login de
-- Supabase Auth, como `authenticated`.
--
-- Hasta ahora las tablas tenían la RLS desactivada y esos dos roles
-- podían leer, modificar y borrar todo: una puerta trasera que no pasaba
-- por el login de /interno/finanzas.
--
-- La app no usa nada de eso. Se conecta con el rol `postgres` (dueño de
-- las tablas y con BYPASSRLS), que no se ve afectado por esta migración.

-- 1. RLS activada en todas las tablas, sin políticas: para `anon` y
--    `authenticated` equivale a no ver ninguna fila.
DO $$
DECLARE t record;
BEGIN
    FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
    END LOOP;
END $$;

-- 2. Sin permisos sobre tablas, vistas, secuencias ni funciones. Las
--    vistas se ejecutan con los permisos de su dueño y se saltarían la
--    RLS: por eso no basta con el punto 1.
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- 3. Y lo mismo para lo que se cree a partir de ahora. Sin esto, cada
--    tabla nueva volvería a nacer abierta.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC, anon, authenticated;
