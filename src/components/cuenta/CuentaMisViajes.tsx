import { Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { MisViajesTabs } from "@/components/cuenta/MisViajesTabs";
import { createClient } from "@/lib/supabase/server";
import { loadMisViajes } from "@/lib/cuenta/mis-viajes";

async function MisViajesContenido({ userId }: { userId: string }) {
  const supabase = await createClient();
  const viajes = await loadMisViajes(supabase, userId);

  return (
    <MisViajesTabs
      propuestos={viajes.propuestos}
      aceptados={viajes.aceptados}
      pagados={viajes.pagados}
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
