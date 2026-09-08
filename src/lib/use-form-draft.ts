"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import {
  clearDraft,
  loadOwnedDraft,
  saveOwnedDraft,
} from "@/lib/form-draft";

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
  const uidRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      const owned = loadOwnedDraft<Partial<T>>(key, uid);
      if (owned) {
        setForm({ ...initial, ...owned });
      } else {
        setForm({ ...initial });
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
    // Solo al cambiar de clave (otro viaje, otro chat…).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(key, form, uidRef.current);
  }, [ready, key, form]);

  return {
    form,
    setForm,
    ready,
    clear: () => clearDraft(key),
  };
}
