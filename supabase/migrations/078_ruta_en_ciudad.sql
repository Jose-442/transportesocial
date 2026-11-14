-- Trayecto corto dentro de la misma ciudad (barrio o polígono).
-- El viaje largo no usa estas columnas: quedan en falso y vacías.

ALTER TABLE public.rutas_conductores
  ADD COLUMN IF NOT EXISTS en_ciudad boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS barrio_origen text,
  ADD COLUMN IF NOT EXISTS barrio_destino text;

COMMENT ON COLUMN public.rutas_conductores.en_ciudad IS
  'True si el anuncio es un trayecto dentro de la misma ciudad.';
COMMENT ON COLUMN public.rutas_conductores.barrio_origen IS
  'Barrio o polígono de salida, elegido de la lista de esa ciudad.';
COMMENT ON COLUMN public.rutas_conductores.barrio_destino IS
  'Barrio o polígono de llegada, elegido de la lista de esa ciudad.';
