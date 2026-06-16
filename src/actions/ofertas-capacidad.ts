"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { calcPrecioConComision } from "@/lib/pricing";
import { puedeAnadirAsientos } from "@/lib/capacidad/asientos";
import { ESPACIO_OPCIONES } from "@/lib/espacio-opciones";
import type { OfertaCapacidad } from "@/types/database";

const espaciosValidos = new Set<string>(ESPACIO_OPCIONES);

export async function crearOfertaCapacidad(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión." };

  const rutaId = String(formData.get("ruta_id"));
  const tipo = String(formData.get("tipo")) as "bulto" | "asiento";

  if (tipo !== "bulto" && tipo !== "asiento") {
    return { error: "Tipo de oferta no válido." };
  }

  const { data: ruta } = await supabase
    .from("rutas_conductores")
    .select("id, user_id, estado")
    .eq("id", rutaId)
    .single();

  if (!ruta || ruta.user_id !== user.id) {
    return { error: "No autorizado." };
  }

  if (ruta.estado !== "reservada") {
    return {
      error: "Solo puedes añadir capacidad extra cuando el viaje principal está reservado.",
    };
  }

  const { data: principal } = await supabase
    .from("reservas")
    .select("id")
    .eq("ruta_conductor_id", rutaId)
    .eq("tipo", "ruta_directa")
    .in("estado", [
      "confirmada",
      "en_transito",
      "entregado",
      "disputa",
      "liberado",
    ])
    .maybeSingle();

  if (!principal) {
    return { error: "Aún no hay una reserva principal confirmada en este viaje." };
  }

  const precioNeto = Number(String(formData.get("precio_neto")).replace(",", "."));
  if (!Number.isFinite(precioNeto) || precioNeto <= 0) {
    return { error: "Indica un precio neto válido." };
  }

  const precioPublicado = calcPrecioConComision(precioNeto);

  const { data: existentes } = await supabase
    .from("ofertas_capacidad")
    .select("*")
    .eq("ruta_conductor_id", rutaId);

  const ofertas = (existentes as OfertaCapacidad[]) ?? [];

  let insert: Record<string, unknown> = {
    ruta_conductor_id: rutaId,
    tipo,
    precio_neto: precioNeto,
    precio_publicado: precioPublicado,
    plazas_totales: 1,
    plazas_ocupadas: 0,
    estado: "disponible",
  };

  if (tipo === "bulto") {
    const espacioTamano = String(formData.get("espacio_tamano") ?? "");
    if (!espaciosValidos.has(espacioTamano)) {
      return { error: "Selecciona un tamaño de espacio válido." };
    }
    insert = {
      ...insert,
      espacio_tamano: espacioTamano,
      espacio_detalle: String(formData.get("espacio_detalle") ?? "").trim() || null,
      plazas_totales: 1,
    };
  } else {
    const plazas = Number(formData.get("plazas_totales"));
    if (!Number.isInteger(plazas) || plazas < 1) {
      return { error: "Indica cuántas plazas ofreces (mínimo 1)." };
    }
    if (!puedeAnadirAsientos(ofertas, plazas)) {
      return {
        error: "Máximo 3 plazas de acompañante en total por viaje.",
      };
    }
    insert = {
      ...insert,
      plazas_totales: plazas,
      espacio_tamano: null,
      espacio_detalle: null,
    };
  }

  const { error } = await supabase.from("ofertas_capacidad").insert(insert);

  if (error) {
    return { error: supabaseErrorMessage(error) };
  }

  revalidatePath(`/rutas/${rutaId}`);
  revalidatePath("/rutas");
  return { ok: true };
}
