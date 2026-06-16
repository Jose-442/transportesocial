"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CIUDADES_ESPAÑA } from "@/lib/ciudades-espana";

type Props = {
  tipo?: "viajes" | "bultos";
};

export function ListadoFiltros({ tipo = "viajes" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const origen = searchParams.get("origen") ?? "";
  const destino = searchParams.get("destino") ?? "";
  const fecha = searchParams.get("fecha") ?? "";

  function aplicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const o = String(form.get("origen") ?? "").trim();
    const d = String(form.get("destino") ?? "").trim();
    const f = String(form.get("fecha") ?? "").trim();
    if (o) params.set("origen", o);
    if (d) params.set("destino", d);
    if (f) params.set("fecha", f);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function limpiar() {
    router.push(pathname);
  }

  const hayFiltros = !!(origen || destino || fecha);

  return (
    <form
      onSubmit={aplicar}
      className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <p className="text-sm font-semibold text-zinc-800">Buscar</p>
      <p className="text-xs text-zinc-500">
        Elige ciudad de salida, de llegada y día. En cada viaje afinarás el punto
        exacto y la hora.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          name="origen"
          label="Ciudad de salida"
          options={CIUDADES_ESPAÑA}
          defaultValue={origen}
          placeholder="Ciudad de salida…"
          required
        />
        <Select
          name="destino"
          label="Ciudad de llegada"
          options={CIUDADES_ESPAÑA}
          defaultValue={destino}
          placeholder="Ciudad de llegada…"
          required
        />
      </div>
      <Input
        name="fecha"
        label={tipo === "viajes" ? "Día del viaje" : "Día (fecha límite)"}
        type="date"
        defaultValue={fecha}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" fullWidth>
          Buscar
        </Button>
        {hayFiltros && (
          <Button type="button" variant="secondary" onClick={limpiar}>
            Limpiar
          </Button>
        )}
      </div>
    </form>
  );
}
