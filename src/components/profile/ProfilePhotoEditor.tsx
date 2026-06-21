"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteAvatar, uploadAvatar } from "@/lib/upload-avatar";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";

export function ProfilePhotoEditor({
  userId,
  displayName,
  avatarUrl: initialAvatarUrl,
}: {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLoading(true);
    setError("");

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const supabase = createClient();
    const result = await uploadAvatar(supabase, userId, file);

    URL.revokeObjectURL(localPreview);
    setPreviewUrl(null);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setAvatarUrl(result.url);
    router.refresh();
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "¿Eliminar tu foto de perfil? Se mostrarán tus iniciales en su lugar."
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const result = await deleteAvatar(supabase, userId);

    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setAvatarUrl(null);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <UserAvatar
        name={displayName}
        avatarUrl={previewUrl ?? avatarUrl}
        size={72}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className={`min-h-9 px-3 py-1.5 text-xs ${CUENTA_BTN_SECONDARY}`}
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? "Guardando…" : avatarUrl ? "Cambiar foto" : "Añadir foto"}
        </Button>
        {avatarUrl && (
          <Button
            type="button"
            variant="ghost"
            className="min-h-9 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
            disabled={loading}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        )}
      </div>
      {error && (
        <p className="max-w-[10rem] text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
