"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  clearRegisterDraft,
  draftToFoto,
  loadRegisterDraft,
  saveRegisterDraft,
} from "@/lib/register-draft";
import { uploadAvatar } from "@/lib/upload-avatar";
import { registrarUsuario } from "@/actions/registro";
import { saveRegistroVolverUrl } from "@/lib/terminos-volver-registro";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/profile/UserAvatar";

export function RegisterForm({
  redirectAfter = null,
}: {
  redirectAfter?: string | null;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);

  function clearFoto() {
    setFoto(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  useEffect(() => {
    saveRegistroVolverUrl(redirectAfter);
  }, [redirectAfter]);

  useEffect(() => {
    const draft = loadRegisterDraft();
    if (draft) {
      setDisplayName(draft.displayName);
      setEmail(draft.email);
      setPassword(draft.password);
      setFoto(draftToFoto(draft));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    void saveRegisterDraft(displayName, email, password, foto);
  }, [ready, displayName, email, password, foto]);

  useEffect(() => {
    if (!foto) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(foto);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  function irTrasRegistro() {
    router.push(redirectAfter ?? "/cuenta");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debes aceptar los Términos y la Política de Privacidad.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await registrarUsuario({
      email,
      password,
      displayName,
    });

    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    clearRegisterDraft();

    const userId = result.userId;
    if (userId && foto) {
      const supabase = createClient();
      const uploadResult = await uploadAvatar(supabase, userId, foto);
      if ("error" in uploadResult) {
        setLoading(false);
        setError(
          `Cuenta creada, pero no se pudo subir la foto: ${uploadResult.error}`
        );
        irTrasRegistro();
        return;
      }
    }

    setLoading(false);
    irTrasRegistro();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-medium text-zinc-800">
          Tu foto (opcional)
        </span>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <UserAvatar
              name={displayName || "?"}
              avatarUrl={previewUrl}
              size={72}
            />
            {foto && (
              <button
                type="button"
                onClick={clearFoto}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                aria-label="Quitar foto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1">
            {foto ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
              >
                CAMBIAR FOTO
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                >
                  Elegir foto
                </Button>
                <p className="mt-1.5 text-xs text-zinc-500">
                  Ayuda a generar confianza. Máx. 5 MB.
                </p>
              </>
            )}
          </div>
        </div>
        <input
          ref={inputRef}
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
        />
      </div>
      <Input
        label="Nombre"
        autoComplete="name"
        required
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Contraseña"
        autoComplete="new-password"
        required
        hint="No pedimos tarjeta al registrarte."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => setAceptaTerminos(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span>
          Acepto los{" "}
          <Link
            href="/terminos"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Términos y Condiciones
          </Link>{" "}
          y la{" "}
          <Link
            href="/terminos#privacidad"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Política de Privacidad
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading || !aceptaTerminos}>
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
