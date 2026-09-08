"use client";

import { createClient } from "@/lib/supabase/client";
import { syncBorradoresConCuenta } from "@/lib/form-draft";

/** Identifica la cuenta activa y tira borradores de otra persona. */
export async function sincronizarCuentaBorradores(): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id ?? "";
  syncBorradoresConCuenta(uid || null);
  return uid;
}
