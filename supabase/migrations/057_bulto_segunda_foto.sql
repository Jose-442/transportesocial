-- Segunda foto opcional del bulto / porte.

ALTER TABLE public.anuncios_bultos
  ADD COLUMN IF NOT EXISTS foto_url_2 text;

COMMENT ON COLUMN public.anuncios_bultos.foto_url_2 IS
  'Segunda foto opcional de la carga. La primera sigue en foto_url.';
