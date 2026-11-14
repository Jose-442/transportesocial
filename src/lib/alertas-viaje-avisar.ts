import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatFechaDiaEs, formatHoraEs } from "@/lib/datetime-form";
import { formatCiudad } from "@/lib/format-ciudad";
import {
  formatEspacioDisponibleListado,
  rutaOfreceBulto,
} from "@/lib/espacio-opciones";
import { formatEur } from "@/lib/pricing";
import { datosVehiculoVisibles } from "@/lib/vehiculo";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { emailYNombreUsuario } from "@/lib/email/resolver-destinatario";
import {
  sendViajePublicadoEmail,
  type LineaCorreoViaje,
} from "@/lib/email/viaje-publicado";
import { crearNotificacion } from "@/lib/reservas/notify";
import {
  alertaCoincideConRuta,
  type AlertaViaje,
} from "@/lib/alertas-viaje";

type Admin = SupabaseClient;

/** Al publicar una ruta, avisa a quien dejó esa búsqueda. */
export async function avisarAlertasDeRuta(ruta: {
  id: string;
  user_id: string;
  origen: string;
  destino: string;
  fecha_salida: string;
}) {
  const admin = createAdminClient();
  if (!admin) return;

  const { data, error } = await admin
    .from("alertas_viaje")
    .select("id, user_id, origen, destino, fecha");
  if (error || !data) return;

  const coinciden = (data as AlertaViaje[]).filter(
    (alerta) =>
      alerta.user_id !== ruta.user_id && alertaCoincideConRuta(alerta, ruta)
  );
  if (coinciden.length === 0) return;

  const dia = formatFechaDiaEs(ruta.fecha_salida);
  const enlace = `/rutas/${ruta.id}`;
  const lineas = await lineasDelViaje(admin, ruta);
  let viajeUrl = `https://www.transportesocial.es${enlace}`;
  try {
    const origin = await getRequestOrigin();
    if (origin) viajeUrl = `${origin}${enlace}`;
  } catch (err) {
    console.error("[alerta viaje] enlace", err);
  }

  for (const alerta of coinciden) {
    const { data: ya } = await admin
      .from("notificaciones")
      .select("id")
      .eq("user_id", alerta.user_id)
      .eq("enlace", enlace)
      .maybeSingle();
    if (ya) continue;

    await crearNotificacion(admin, {
      user_id: alerta.user_id,
      tipo: "sistema",
      titulo: "Hay un viaje",
      mensaje: `Un conductor ha publicado ${ruta.origen} → ${ruta.destino}${dia ? ` el ${dia}` : ""}. Te hemos enviado el viaje por correo.`,
      enlace,
    });

    const persona = await emailYNombreUsuario(admin, alerta.user_id);
    if (!persona) continue;
    try {
      await sendViajePublicadoEmail({
        to: persona.email,
        displayName: persona.displayName,
        origen: ruta.origen,
        destino: ruta.destino,
        lineas,
        viajeUrl,
      });
    } catch (err) {
      console.error("[alerta viaje] correo", err);
    }
  }
}

async function lineasDelViaje(
  admin: Admin,
  ruta: {
    id: string;
    user_id: string;
    origen: string;
    destino: string;
    fecha_salida: string;
  }
): Promise<LineaCorreoViaje[]> {
  const [{ data: fila }, { data: ofertas }, { data: paradas }, { data: perfil }] =
    await Promise.all([
      admin
        .from("rutas_conductores")
        .select(
          "origen, destino, fecha_salida, fecha_llegada_prevista, espacio_disponible, precio_publicado, acepta_mascotas, user_id"
        )
        .eq("id", ruta.id)
        .maybeSingle(),
      admin
        .from("ofertas_capacidad")
        .select("tipo, plazas_totales, precio_publicado, estado")
        .eq("ruta_conductor_id", ruta.id),
      admin
        .from("ruta_paradas")
        .select("orden, municipio, hora_paso")
        .eq("ruta_conductor_id", ruta.id)
        .order("orden", { ascending: true }),
      admin
        .from("profiles")
        .select(
          "display_name, vehiculo_tipo, vehiculo_marca, vehiculo_modelo, vehiculo_anio, distintivo_ambiental"
        )
        .eq("id", ruta.user_id)
        .maybeSingle(),
    ]);

  const origen = formatCiudad(fila?.origen || ruta.origen);
  const destino = formatCiudad(fila?.destino || ruta.destino);
  const dia = formatFechaDiaEs(
    String(fila?.fecha_salida || ruta.fecha_salida)
  );
  const hora = fila?.fecha_llegada_prevista
    ? formatHoraEs(String(fila.fecha_llegada_prevista))
    : "";
  const lineas: LineaCorreoViaje[] = [];

  const nombre = perfil?.display_name?.trim();
  if (nombre) lineas.push({ etiqueta: "Propuesto por", valor: nombre });
  if (perfil) {
    for (const dato of datosVehiculoVisibles(perfil)) {
      lineas.push({ etiqueta: dato.label, valor: dato.valor });
    }
  }

  lineas.push({ etiqueta: "Salida", valor: origen });
  lineas.push({ etiqueta: "Destino", valor: destino });

  const paradasTexto = (paradas ?? [])
    .map((parada) => {
      const sitio = formatCiudad(String(parada.municipio ?? ""));
      const horaParada = parada.hora_paso
        ? formatHoraEs(String(parada.hora_paso))
        : "";
      return horaParada ? `${sitio} · ${horaParada}` : sitio;
    })
    .filter(Boolean);
  if (paradasTexto.length > 0) {
    lineas.push({
      etiqueta: "Paradas intermedias",
      valor: paradasTexto.join("\n"),
    });
  }

  if (dia) lineas.push({ etiqueta: "Día", valor: dia });
  if (hora) lineas.push({ etiqueta: "Hora de salida", valor: hora });

  const espacio = String(fila?.espacio_disponible ?? "");
  if (rutaOfreceBulto(espacio)) {
    lineas.push({
      etiqueta: "Espacio para el bulto",
      valor: formatEspacioDisponibleListado(espacio),
    });
    const precio = Number(fila?.precio_publicado);
    if (Number.isFinite(precio) && precio > 0) {
      lineas.push({
        etiqueta: "Precio por el porte del bulto",
        valor: `${formatEur(precio)}. Gastos de gestión, IVA y banco todo incluido.`,
      });
    }
  } else {
    lineas.push({
      etiqueta: "Espacio para el bulto",
      valor: "Este viaje no ofrece espacio para bultos.",
    });
  }

  const asientos = (ofertas ?? []).filter(
    (oferta) => oferta.tipo === "asiento" && oferta.estado !== "cancelada"
  );
  const plazas = asientos.reduce(
    (total, oferta) => total + Number(oferta.plazas_totales ?? 0),
    0
  );
  if (plazas > 0) {
    lineas.push({
      etiqueta: "Plazas",
      valor: plazas === 1 ? "1 plaza libre" : `${plazas} plazas libres`,
    });
    const precioPlaza = Number(asientos[0]?.precio_publicado);
    if (Number.isFinite(precioPlaza) && precioPlaza > 0) {
      lineas.push({
        etiqueta: "Precio por plaza",
        valor: `${formatEur(precioPlaza)}. Gastos de gestión, IVA y banco todo incluido.`,
      });
    }
  } else {
    lineas.push({
      etiqueta: "Plazas",
      valor: "Este viaje no ofrece plazas.",
    });
  }

  if (fila?.acepta_mascotas === true) {
    lineas.push({
      etiqueta: "Mascotas",
      valor: "Sí, acompañadas y según la normativa de la DGT.",
    });
  } else if (fila?.acepta_mascotas === false) {
    lineas.push({ etiqueta: "Mascotas", valor: "No" });
  }

  return lineas;
}
