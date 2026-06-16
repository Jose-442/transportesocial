/** Mensaje de error de Supabase en español cuando sea posible. */
export function supabaseErrorMessage(error: { message: string }): string {
  if (/permission denied for table/i.test(error.message)) {
    return (
      "Sin permiso en la base de datos para guardar. En Supabase → SQL Editor, " +
      "ejecuta el archivo supabase/migrations/006_table_grants.sql."
    );
  }
  return error.message;
}
