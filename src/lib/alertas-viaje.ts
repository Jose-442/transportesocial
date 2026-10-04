import { coincideFiltrosRuta } from "@/lib/listado-filters";

export type AlertaViaje = {
  id: string;
  user_id: string;
  origen: string;
  destino: string;
  fecha: string;
};

export function alertaCoincideConRuta(
  alerta: Pick<AlertaViaje, "origen" | "destino" | "fecha">,
  ruta: { origen: string; destino: string; fecha_salida: string }
): boolean {
  return coincideFiltrosRuta(ruta, {
    origen: alerta.origen,
    destino: alerta.destino,
    fecha: alerta.fecha,
  });
}
