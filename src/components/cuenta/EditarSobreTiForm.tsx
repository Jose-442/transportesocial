"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Textarea } from "@/components/ui/Input";
import { actualizarSobreTi } from "@/actions/cuenta";
import { PROFILE_SOBRE_TI_MAX } from "@/lib/profile";

export function EditarSobreTiForm({
  sobreTiInicial,
  compactPc = false,
}: {
  sobreTiInicial: string | null;
  /** Menos altura en escritorio (flujo ?volver= en /cuenta). Móvil sin cambios. */
  compactPc?: boolean;
}) {
  const router = useRouter();
  const [sobreTi, setSobreTi] = useState(sobreTiInicial ?? "");
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
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        label="Cuéntanos quién eres"
        value={sobreTi}
        onChange={(e) => setSobreTi(e.target.value)}
        placeholder="Ej.: Soy conductor con furgoneta. Puntual y cuidadoso."
        hint="Si propones precio para transportar bultos y/o pasajeros, a las personas que necesiten esos servicios les gustará saber algo de ti"
        hintClassName="text-sm text-zinc-500"
        maxLength={PROFILE_SOBRE_TI_MAX}
        rows={4}
        className={compactPc ? "md:min-h-0 md:h-[4.25rem]" : ""}
      />
      {mensaje && <p className="text-sm text-emerald-700">{mensaje}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
      >
        {loading ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  );
}
