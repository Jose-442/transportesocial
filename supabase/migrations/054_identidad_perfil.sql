-- Identidad del usuario (paso 1 cumplimiento): teléfono + DNI/NIE.
-- Nadie más lee esos campos: perfiles ajenos solo por la vista perfiles_publicos.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS documento_identidad text,
  ADD COLUMN IF NOT EXISTS documento_verificado boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.phone IS
  'Teléfono móvil del usuario. Solo visible para el propio usuario (y service_role).';
COMMENT ON COLUMN public.profiles.phone_verified IS
  'true cuando el móvil se verificó por SMS (módulo posterior).';
COMMENT ON COLUMN public.profiles.documento_identidad IS
  'DNI o NIE. Solo visible para el propio usuario (y service_role).';
COMMENT ON COLUMN public.profiles.documento_verificado IS
  'true cuando el documento se verificó (módulo posterior).';

-- Si cambia el teléfono o el documento, se pierde la verificación.
CREATE OR REPLACE FUNCTION public.profiles_reset_verificacion_identidad()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.phone IS DISTINCT FROM OLD.phone THEN
      NEW.phone_verified := false;
    END IF;
    IF NEW.documento_identidad IS DISTINCT FROM OLD.documento_identidad THEN
      NEW.documento_verificado := false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_reset_verificacion_identidad ON public.profiles;
CREATE TRIGGER profiles_reset_verificacion_identidad
  BEFORE UPDATE OF phone, documento_identidad ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_reset_verificacion_identidad();

-- Vista pública: sin teléfono ni documento.
CREATE OR REPLACE VIEW public.perfiles_publicos
WITH (security_invoker = false)
AS
SELECT
  id,
  display_name,
  avatar_url,
  sobre_ti,
  vehiculo_marca,
  vehiculo_modelo,
  vehiculo_anio,
  distintivo_ambiental,
  rating_promedio,
  rating_cantidad
FROM public.profiles;

GRANT SELECT ON public.perfiles_publicos TO anon, authenticated;

-- Cerrar lectura abierta de profiles (antes cualquiera autenticado veía phone).
DROP POLICY IF EXISTS "Perfiles visibles para autenticados" ON public.profiles;
DROP POLICY IF EXISTS "Perfiles visibles para anon" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- anon ya no lee profiles; usa perfiles_publicos.
