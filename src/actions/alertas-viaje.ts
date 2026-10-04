"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { parseDate } from "@/lib/datetime-form";
import {
  etiquetaMunicipio,
  resolverMunicipioFormulario,
} from "@/lib/municipios-espana";

function datosAlerta(origenRaw: string, destinoRaw: string, fechaRaw: string) {
  const origenResuelto = resolverMunicipioFormulario(origenRaw, "salida");
  if (origenResuelto.error || !origenResuelto.municipio) {
    return { error: origenResuelto.error ?? "Indica la salida." };
  }
  const destinoResuelto = resolverMunicipioFormulario(destinoRaw, "destino", {
    incluirFrontera: true,
  });
  if (destinoResuelto.error || !destinoResuelto.municipio) {
    return { error: destinoResuelto.error ?? "Indica el destino." };
  }
  const fecha = fechaRaw.trim().slice(0, 10);
  const partes = parseDate(fecha);
  if (!partes.year || !partes.month || !partes.day) {
    return { error: "Indica el día del viaje." };
  }
  return {
    origen: etiquetaMunicipio(origenResuelto.municipio),
    destino: etiquetaMunicipio(destinoResuelto.municipio),
    fecha,
  };
}

export async function crearAlertaViaje(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Entra en tu cuenta para dejar el aviso." };

  const datos = datosAlerta(
    String(formData.get("origen") ?? ""),
    String(formData.get("destino") ?? ""),
    String(formData.get("fecha") ?? "")
  );
  if ("error" in datos) return { error: datos.error };

  const { error } = await supabase.from("alertas_viaje").insert({
    user_id: user.id,
    origen: datos.origen,
    destino: datos.destino,
    fecha: datos.fecha,
  });

  if (error && error.code !== "23505") {
    return { error: supabaseErrorMessage(error) };
  }

  revalidatePath("/rutas");
  return { ok: true as const };
}

export async function quitarAlertaViaje(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Entra en tu cuenta para quitar el aviso." };

  const datos = datosAlerta(
    String(formData.get("origen") ?? ""),
    String(formData.get("destino") ?? ""),
    String(formData.get("fecha") ?? "")
  );
  if ("error" in datos) return { error: datos.error };

  const { error } = await supabase
    .from("alertas_viaje")
    .delete()
    .eq("user_id", user.id)
    .eq("origen", datos.origen)
    .eq("destino", datos.destino)
    .eq("fecha", datos.fecha);

  if (error) return { error: supabaseErrorMessage(error) };

  revalidatePath("/rutas");
  return { ok: true as const };
}
