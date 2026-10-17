import { ofertaDisponible, plazasLibresOferta } from "@/lib/capacidad/asientos";
import { esReservaDePlazas } from "@/lib/reservas/labels";
import type { OfertaCapacidad, Reserva } from "@/types/database";

export type OpcionesAmpliar = {
  puedePlaza: boolean;
  puedeBulto: boolean;
};

/** Qué se puede añadir a una reserva ya hecha, según lo que quede libre en el viaje. */
export function opcionesAmpliarReserva(args: {
  relacionadas: Pick<Reserva, "tipo" | "bulto_descripcion" | "cantidad">[];
  ofertas: OfertaCapacidad[];
  /** Hueco de bulto del anuncio original aún libre. */
  ofreceBultoOriginalLibre: boolean;
}): OpcionesAmpliar {
  const yaTieneBulto = args.relacionadas.some((item) => !esReservaDePlazas(item));
  const plazaLibre = args.ofertas.some(
    (o) => o.tipo === "asiento" && ofertaDisponible(o) && plazasLibresOferta(o) > 0
  );
  const bultoOfertaLibre = args.ofertas.some(
    (o) => o.tipo === "bulto" && ofertaDisponible(o)
  );
  const puedeBulto =
    bultoOfertaLibre || (args.ofreceBultoOriginalLibre && !yaTieneBulto);

  return {
    puedePlaza: plazaLibre,
    puedeBulto,
  };
}

export function etiquetaBotonAmpliar(opciones: OpcionesAmpliar): string | null {
  if (opciones.puedePlaza && opciones.puedeBulto) {
    return "Añadir bulto o plazas";
  }
  if (opciones.puedePlaza) return "Añadir plaza";
  if (opciones.puedeBulto) return "Añadir bulto";
  return null;
}

export function queryAmpliar(opciones: OpcionesAmpliar): string | null {
  if (opciones.puedePlaza && opciones.puedeBulto) return "ambos";
  if (opciones.puedePlaza) return "plaza";
  if (opciones.puedeBulto) return "bulto";
  return null;
}
