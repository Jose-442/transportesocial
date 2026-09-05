"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { clearDraft, loadDraft, saveDraft } from "@/lib/form-draft";

export function useFormDraft<T extends object>(
  key: string,
  initial: T
): {
  form: T;
  setForm: Dispatch<SetStateAction<T>>;
  ready: boolean;
  clear: () => void;
} {
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<T>(initial);

  useEffect(() => {
    const raw = loadDraft<Partial<T>>(key);
    setForm(
      raw && typeof raw === "object" ? { ...initial, ...raw } : { ...initial }
    );
    setReady(true);
    // Solo al cambiar de clave (otro viaje, otro chat…).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    saveDraft(key, form);
  }, [ready, key, form]);

  return {
    form,
    setForm,
    ready,
    clear: () => clearDraft(key),
  };
}
