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
    <div className="rounded-2xl border-2 border-emerald-600 bg-emerald-50 p-4 shadow-sm md:p-5">
      <p className="text-sm font-semibold text-emerald-950">
        Modificar mi reserva
      </p>
      <p className="mt-1 text-sm text-emerald-900">
        Solo para ampliar lo que ya pediste.
      </p>
      <ButtonLink
        href={`/rutas/${rutaId}?ampliar=${query}`}
        fullWidth
        className="mt-3"
      >
        {etiqueta}
      </ButtonLink>
    </div>
  );
}
