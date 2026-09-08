-- La fecha límite del bulto pasa a guardar también la hora.
ALTER TABLE anuncios_bultos
  ALTER COLUMN fecha_limite TYPE TIMESTAMPTZ
  USING CASE
    WHEN fecha_limite IS NULL THEN NULL
    ELSE (fecha_limite::timestamp AT TIME ZONE 'Europe/Madrid')
  END;
