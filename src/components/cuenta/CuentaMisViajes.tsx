import { Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { MisViajesTabs } from "@/components/cuenta/MisViajesTabs";
import { createClient } from "@/lib/supabase/server";
import { loadMisViajes } from "@/lib/cuenta/mis-viajes";
import { identidadListaParaPagar } from "@/lib/identidad-pago";

async function MisViajesContenido({ userId }: { userId: string }) {
  const supabase = await createClient();
  const viajes = await loadMisViajes(supabase, userId);
  const { data: perfil } = await supabase
    .from("profiles")
    .select("phone, documento_identidad")
    .eq("id", userId)
    .maybeSingle();

  return (
    <MisViajesTabs
      propuestos={viajes.propuestos}
      aceptados={viajes.aceptados}
      pagados={viajes.pagados}
      sinPagar={viajes.sinPagar}
      faltaIdentidad={!identidadListaParaPagar(perfil ?? {}).ok}
      paraMi={viajes.paraMi}
      historial={viajes.historial}
    />
  );
}

export function CuentaMisViajes({ userId }: { userId: string }) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-semibold text-zinc-900">Mis viajes</h2>
        <p className="mt-1 text-base text-zinc-600">
          Los que tú has propuesto, los que has aceptado como conductor, los
          que tú has pagado-reservado y las aceptaciones de otros conductores
          a tus propuestas.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="text-sm text-zinc-500">Cargando tus viajes…</p>
        }
      >
        <MisViajesContenido userId={userId} />
      </Suspense>
    </Card>
  );
}
