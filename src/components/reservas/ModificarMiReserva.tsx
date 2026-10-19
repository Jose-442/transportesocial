import { ButtonLink } from "@/components/ui/Button";
import {
  etiquetaBotonAmpliar,
  opcionesAmpliarReserva,
  queryAmpliar,
} from "@/lib/reservas/ampliar-reserva";
import type { OfertaCapacidad, Reserva } from "@/types/database";

const ESTADOS_OK = new Set([
  "pendiente_aprobacion",
  "confirmada",
  "pendiente_pago",
]);

export function ModificarMiReserva({
  rutaId,
  estado,
  relacionadas,
  ofertas,
  ofreceBultoOriginalLibre,
}: {
  rutaId: string;
  estado: Reserva["estado"];
  relacionadas: Pick<Reserva, "tipo" | "bulto_descripcion" | "cantidad">[];
  ofertas: OfertaCapacidad[];
  ofreceBultoOriginalLibre: boolean;
}) {
  if (!ESTADOS_OK.has(estado)) return null;

  const opciones = opcionesAmpliarReserva({
    relacionadas,
    ofertas,
    ofreceBultoOriginalLibre,
  });
  const etiqueta = etiquetaBotonAmpliar(opciones);
  const query = queryAmpliar(opciones);
  if (!etiqueta || !query) return null;

  return (
    <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 px-3 py-2.5">
      <p className="text-lg font-bold text-emerald-950 md:text-xl">
        Modificar mi reserva
      </p>
      <p className="mt-0.5 text-sm text-emerald-900">
        Solo para ampliar lo que ya pediste.
      </p>
      <ButtonLink
        href={`/rutas/${rutaId}?ampliar=${query}`}
        fullWidth
        className="mt-2"
      >
        {etiqueta}
      </ButtonLink>
    </div>
  );
}
