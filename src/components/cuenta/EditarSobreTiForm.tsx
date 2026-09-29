"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { actualizarSobreTi } from "@/actions/cuenta";
import { PROFILE_SOBRE_TI_MAX } from "@/lib/profile";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function EditarSobreTiForm({
  sobreTiInicial,
  verPerfilHref,
  compactPc = false,
}: {
  sobreTiInicial: string | null;
  /** Enlace «Ver cómo me ven los demás» (misma fila que Guardar). */
  verPerfilHref?: string;
  /** Menos altura en escritorio (flujo ?volver= en /cuenta). */
  compactPc?: boolean;
}) {
  const router = useRouter();
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.editarSobreTi, {
    sobreTi: sobreTiInicial ?? "",
  });
  const sobreTi = form.sobreTi;
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    const result = await actualizarSobreTi(sobreTi);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMensaje("Presentación guardada.");
    clear();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        label="Cuéntanos sobre ti"
        value={sobreTi}
        onChange={(e) => setForm({ sobreTi: e.target.value })}
        placeholder="Ej.: Soy puntual y respondo rápido."
        hint="A la otra persona del viaje le gustará saber algo de ti."
        hintClassName="text-sm text-zinc-500"
        maxLength={PROFILE_SOBRE_TI_MAX}
        rows={2}
        className={
          compactPc
            ? "!min-h-0 h-[2.75rem]"
            : "!min-h-0 h-[3.25rem] md:min-h-24 md:h-auto"
        }
      />
      {mensaje && <p className="text-sm text-emerald-700">{mensaje}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-row flex-nowrap items-stretch gap-2">
        <Button
          type="submit"
          variant="ghost"
          className="min-w-0 flex-1 border border-emerald-600 !bg-transparent text-emerald-800 hover:!bg-emerald-50 md:flex-none md:px-6"
          disabled={loading}
        >
          {loading ? "Guardando…" : "Guardar"}
        </Button>
        {verPerfilHref ? (
          <ButtonLink
            href={verPerfilHref}
            variant="ghost"
            className="min-w-0 flex-1 border border-emerald-600 !bg-transparent px-2 text-center text-sm leading-tight text-emerald-800 hover:!bg-emerald-50 md:flex-none md:px-4"
          >
            Ver cómo me ven los demás
          </ButtonLink>
        ) : null}
      </div>
    </form>
  );
}
