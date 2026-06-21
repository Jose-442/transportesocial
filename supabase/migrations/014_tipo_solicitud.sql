-- Tipo de solicitud (7 opciones) y desglose en ofertas
CREATE TYPE public.tipo_solicitud AS ENUM (
  'solo_bulto',
  'bulto_1_pasajero',
  'bulto_2_pasajeros',
  'bulto_3_pasajeros',
  'solo_1_pasajero',
  'solo_2_pasajeros',
  'solo_3_pasajeros'
);

ALTER TABLE public.anuncios_bultos
  ADD COLUMN IF NOT EXISTS tipo_solicitud public.tipo_solicitud NOT NULL DEFAULT 'solo_bulto';

ALTER TABLE public.ofertas_precio
  ADD COLUMN IF NOT EXISTS desglose JSONB;

COMMENT ON COLUMN public.ofertas_precio.desglose IS
  'precio_neto_bulto, precio_neto_plaza, num_plazas, precio_total_bulto, precio_total_plaza';
