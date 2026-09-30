-- Porte / carga: tipo, categoría y aceptación de declaración legal.

ALTER TABLE public.anuncios_bultos
  ADD COLUMN IF NOT EXISTS tipo_carga text,
  ADD COLUMN IF NOT EXISTS categoria_carga text,
  ADD COLUMN IF NOT EXISTS declaracion_aceptada_en timestamptz;

ALTER TABLE public.anuncios_bultos
  DROP CONSTRAINT IF EXISTS anuncios_bultos_tipo_carga_check;

ALTER TABLE public.anuncios_bultos
  ADD CONSTRAINT anuncios_bultos_tipo_carga_check
  CHECK (
    tipo_carga IS NULL
    OR tipo_carga IN ('voluminoso', 'paquete')
  );

COMMENT ON COLUMN public.anuncios_bultos.tipo_carga IS
  'voluminoso (mueble, bici…) o paquete cerrado. Obligatorio en anuncios nuevos con bulto.';
COMMENT ON COLUMN public.anuncios_bultos.categoria_carga IS
  'Categoría de la carga (mueble, electrodoméstico, paquete…).';
COMMENT ON COLUMN public.anuncios_bultos.declaracion_aceptada_en IS
  'Momento en que el usuario aceptó la declaración de responsabilidad del porte.';
