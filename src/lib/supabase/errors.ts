/** Mensaje de error de Supabase en español cuando sea posible. */
export function supabaseErrorMessage(error: { message: string }): string {
  const msg = error.message;

  if (/permission denied for table/i.test(msg)) {
    if (/rutas_conductores/i.test(msg)) {
      return (
        "Sin permiso para deshacer la ruta en la base de datos. " +
        "Ejecuta en Supabase la migración supabase/migrations/015_rutas_delete_rollback.sql."
      );
    }
    if (/ofertas_capacidad/i.test(msg)) {
      return (
        "Sin permiso en la tabla de plazas. " +
        "Ejecuta en Supabase las migraciones 011, 012 y 013."
      );
    }
    return (
      "Sin permiso en la base de datos para guardar. En Supabase → SQL Editor, " +
      "ejecuta el archivo supabase/migrations/006_table_grants.sql."
    );
  }

  if (
    /could not find the table/i.test(msg) &&
    /schema cache/i.test(msg)
  ) {
    if (/ofertas_capacidad/i.test(msg)) {
      return (
        "Falta configurar la base de datos (tabla de plazas). " +
        "Ejecuta en Supabase las migraciones 011, 012 y 013."
      );
    }
    return (
      "Falta configurar la base de datos. Revisa las migraciones en Supabase → SQL Editor."
    );
  }

  if (/could not find the table/i.test(msg)) {
    return "Falta una tabla en la base de datos. Revisa las migraciones en Supabase.";
  }

  return msg;
}
