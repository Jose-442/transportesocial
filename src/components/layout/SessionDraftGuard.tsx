"use client";

import { useEffect } from "react";
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import { createClient } from "@/lib/supabase/client";

/** Al cambiar de cuenta o cerrar sesión, no se reutilizan borradores del usuario anterior. */
export function SessionDraftGuard() {
  useEffect(() => {
    const supabase = createClient();

    void sincronizarCuentaBorradores();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void sincronizarCuentaBorradores();
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
