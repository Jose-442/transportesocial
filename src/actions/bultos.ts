"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { combinarEspacio, ESPACIO_OPCIONES } from "@/lib/espacio-opciones";
import { formatCiudad } from "@/lib/format-ciudad";
import { combineDateAndTime } from "@/lib/datetime-form";
import { adjuntarHoraOculta } from "@/lib/bulto-hora";
import { etiquetaMunicipio, resolverMunicipioFormulario } from "@/lib/municipios-espana";
import { getOrCreateProfile } from "@/lib/profile";
import {
  categoriaValida,
  isTipoCarga,
  type TipoCarga,
} from "@/lib/porte-legal";
import {
  incluyeBulto,
  isTipoSolicitud,
  type TipoSolicitud,
} from "@/lib/solicitud-viaje";
import {
  assertCanPublish,
  consumePublicationCredit,
  shouldConsumePublicationCredit,
} from "@/actions/publication-fee";

const FOTO_MAX_BYTES = 5 * 1024 * 1024;
const FOTO_TIPOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function crearBulto(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para publicar." };

  const profileResult = await getOrCreateProfile(supabase, user);
  if (profileResult.error || !profileResult.profile) {
    return { error: profileResult.error ?? "Perfil no encontrado." };
  }
  const profile = profileResult.profile;

  const access = await assertCanPublish(profile, user.id, "/bultos/nuevo");
  if (access.error) return { error: access.error };

  const tipoRaw = String(formData.get("tipo_solicitud")).trim();
  if (!isTipoSolicitud(tipoRaw)) {
    return { error: "Selecciona qué necesitas para el viaje." };
  }
  const tipoSolicitud: TipoSolicitud = tipoRaw;
  const necesitaBulto = incluyeBulto(tipoSolicitud);

  let fotoUrl: string | null = null;
  let tipoCarga: TipoCarga | null = null;
  let categoriaCarga: string | null = null;
  let declaracionAceptadaEn: string | null = null;

  if (necesitaBulto) {
    const tipoCargaRaw = String(formData.get("tipo_carga") ?? "").trim();
    if (!isTipoCarga(tipoCargaRaw)) {
      return { error: "Indica el tipo de carga." };
    }
    tipoCarga = tipoCargaRaw;
    const categoriaRaw = String(formData.get("categoria_carga") ?? "").trim();
    if (!categoriaValida(tipoCarga, categoriaRaw)) {
      return { error: "Elige la categoría de la carga." };
    }
    categoriaCarga = categoriaRaw;

    const declaracion = String(formData.get("declaracion_aceptada") ?? "").trim();
    if (declaracion !== "1" && declaracion !== "true" && declaracion !== "on") {
      return {
        error: "Debes aceptar la declaración de responsabilidad del porte.",
      };
    }
    declaracionAceptadaEn = new Date().toISOString();

    const foto = formData.get("foto");
    if (!(foto instanceof File) || foto.size <= 0) {
      return { error: "Añade al menos una foto de la carga." };
    }
    if (foto.size > FOTO_MAX_BYTES) {
      return { error: "La foto no puede superar 5 MB." };
    }
    if (foto.type && !FOTO_TIPOS.has(foto.type)) {
      return { error: "La foto debe ser JPG, PNG, WebP o GIF." };
    }
    const ext = foto.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("bultos-fotos")
      .upload(path, foto, { upsert: false });
    if (uploadError) return { error: supabaseErrorMessage(uploadError) };

    const { data: publicUrl } = supabase.storage
      .from("bultos-fotos")
      .getPublicUrl(path);
    fotoUrl = publicUrl.publicUrl;
  }

  const fechaLimiteDia = String(formData.get("fecha_limite") ?? "").trim();
  const horaLimite = String(formData.get("hora_limite") ?? "").trim();
  if (!fechaLimiteDia || !horaLimite) {
    return { error: "Indica la fecha y la hora." };
  }
  const fechaLimite = combineDateAndTime(fechaLimiteDia, horaLimite);
  if (!fechaLimite) {
    return { error: "Fecha u hora no válida." };
  }

  let descripcion = String(formData.get("descripcion") ?? "").trim();
  let medidas = "";

  if (necesitaBulto) {
    if (!descripcion) {
      return { error: "Describe el bulto que necesitas enviar." };
    }
    const espacioTamano = String(formData.get("espacio_tamano")).trim();
    if (
      !ESPACIO_OPCIONES.includes(
        espacioTamano as (typeof ESPACIO_OPCIONES)[number]
      )
    ) {
      return { error: "Selecciona el espacio que necesitas." };
    }
    medidas = combinarEspacio(
      espacioTamano,
      String(formData.get("espacio_detalle") ?? "")
    );
  } else if (!descripcion) {
    descripcion = "Solo pasajeros, sin bulto.";
  }

  descripcion = adjuntarHoraOculta(descripcion, horaLimite);
  medidas = adjuntarHoraOculta(medidas, horaLimite);

  const origenInput = formatCiudad(String(formData.get("origen")));
  const destinoInput = formatCiudad(String(formData.get("destino")));
  const origenResuelto = resolverMunicipioFormulario(origenInput, "salida");
  if (origenResuelto.error) return { error: origenResuelto.error };
  const destinoResuelto = resolverMunicipioFormulario(destinoInput, "destino", {
    incluirFrontera: true,
  });
  if (destinoResuelto.error) return { error: destinoResuelto.error };

  const { data, error } = await supabase
    .from("anuncios_bultos")
    .insert({
      user_id: user.id,
      origen: etiquetaMunicipio(origenResuelto.municipio!),
      destino: etiquetaMunicipio(destinoResuelto.municipio!),
      descripcion,
      medidas,
      foto_url: fotoUrl,
      fecha_limite: fechaLimiteDia,
      tipo_solicitud: tipoSolicitud,
      tipo_carga: tipoCarga,
      categoria_carga: categoriaCarga,
      declaracion_aceptada_en: declaracionAceptadaEn,
    })
    .select("id")
    .single();

  if (error) return { error: supabaseErrorMessage(error) };

  if (await shouldConsumePublicationCredit(user.id, profile)) {
    await consumePublicationCredit(
      user.id,
      "/bultos/nuevo",
      "bulto_id",
      data.id
    );
  }

  revalidatePath("/bultos");
  return { id: data.id };
}

const RESERVA_EN_CURSO_ESTADOS = [
  "pendiente_pago",
  "pendiente_aprobacion",
  "confirmada",
  "pagado_escrow",
  "en_transito",
  "entregado",
  "disputa",
] as const;

const ERROR_RESERVA_O_PROPUESTA_EN_CURSO =
  "No se puede cancelar: ya hay una reserva o propuesta en curso.";

export async function cancelarBultoPublicacion(
  bultoId: string
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("id, user_id, estado")
    .eq("id", bultoId)
    .single();

  if (!bulto || bulto.user_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (bulto.estado !== "activo") {
    return { error: "Solo puedes cancelar anuncios activos." };
  }

  const [{ count: reservasActivas }, { count: ofertasPendientes }] =
    await Promise.all([
      supabase
        .from("reservas")
        .select("id", { count: "exact", head: true })
        .eq("anuncio_bulto_id", bultoId)
        .in("estado", [...RESERVA_EN_CURSO_ESTADOS]),
      supabase
        .from("ofertas_precio")
        .select("id", { count: "exact", head: true })
        .eq("anuncio_bulto_id", bultoId)
        .eq("estado", "pendiente"),
    ]);

  if ((reservasActivas ?? 0) > 0 || (ofertasPendientes ?? 0) > 0) {
    return { error: ERROR_RESERVA_O_PROPUESTA_EN_CURSO };
  }

  const { error } = await supabase
    .from("anuncios_bultos")
    .update({ estado: "cancelado" })
    .eq("id", bultoId)
    .eq("user_id", user.id)
    .eq("estado", "activo");

  if (error) return { error: supabaseErrorMessage(error) };

  revalidatePath("/cuenta");
  revalidatePath("/bultos");
  revalidatePath(`/bultos/${bultoId}`);
  return { ok: true };
}
