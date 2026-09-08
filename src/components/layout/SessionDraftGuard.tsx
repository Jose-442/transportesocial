"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { syncBorradoresConCuenta } from "@/lib/form-draft";

/** Al cambiar de cuenta o cerrar sesión, no se reutilizan borradores del usuario anterior. */
export function SessionDraftGuard() {
  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getSession().then(({ data }) => {
      syncBorradoresConCuenta(data.session?.user.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncBorradoresConCuenta(session?.user.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
