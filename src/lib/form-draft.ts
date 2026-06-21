import {
  extractDateFromDatetime,
  extractTimeFromDatetime,
} from "@/lib/datetime-form";

export type StoredFile = {
  name: string;
  type: string;
  dataUrl: string;
};

export function loadDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveDraft<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Sin espacio: no bloqueamos el formulario.
  }
}

export function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function dataUrlToFile(stored: StoredFile): File | null {
  try {
    const base64 = stored.dataUrl.split(",")[1] ?? "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], stored.name, { type: stored.type });
  } catch {
    return null;
  }
}

export async function fileToStored(file: File): Promise<StoredFile | null> {
  try {
    const dataUrl = await fileToDataUrl(file);
    return { name: file.name, type: file.type, dataUrl };
  } catch {
    return null;
  }
}

export const DRAFT_KEYS = {
  login: "transporte-social-login-draft",
  nuevaRuta: "transporte-social-nueva-ruta-draft",
  nuevoBulto: "transporte-social-nuevo-bulto-draft",
  oferta: (bultoId: string) => `transporte-social-oferta-draft-${bultoId}`,
} as const;

const ofertaPostLoginKey = (bultoId: string) =>
  `transporte-social-oferta-post-login-${bultoId}`;

export function setOfertaPostLogin(bultoId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ofertaPostLoginKey(bultoId), "1");
}

export function consumeOfertaPostLogin(bultoId: string): boolean {
  if (typeof window === "undefined") return false;
  const key = ofertaPostLoginKey(bultoId);
  if (sessionStorage.getItem(key) !== "1") return false;
  sessionStorage.removeItem(key);
  return true;
}

export function clearOfertaPostLogin(bultoId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ofertaPostLoginKey(bultoId));
}

export type LoginDraft = {
  email: string;
  password: string;
};

export type NuevaRutaDraft = {
  origen: string;
  destino: string;
  fecha_salida: string;
  hora_salida: string;
  espacio_tamano: string;
  espacio_detalle: string;
  plazas_acompanante: string;
  precio_neto_plaza: string;
  precio_neto: string;
};

export type NuevoBultoDraft = {
  tipo_solicitud: import("@/lib/solicitud-viaje").TipoSolicitud;
  origen: string;
  destino: string;
  descripcion: string;
  espacio_tamano: string;
  espacio_detalle: string;
  fecha_limite: string;
  foto: StoredFile | null;
};

export type OfertaDraft = {
  precio_neto_bulto: string;
  precio_neto_plaza: string;
  plazas_ofrecidas: string;
  mensaje: string;
};

export const EMPTY_NUEVA_RUTA_DRAFT: NuevaRutaDraft = {
  origen: "",
  destino: "",
  fecha_salida: "",
  hora_salida: "",
  espacio_tamano: "",
  espacio_detalle: "",
  plazas_acompanante: "1",
  precio_neto_plaza: "",
  precio_neto: "",
};

export const EMPTY_NUEVO_BULTO_DRAFT: NuevoBultoDraft = {
  tipo_solicitud: "solo_bulto",
  origen: "",
  destino: "",
  descripcion: "",
  espacio_tamano: "",
  espacio_detalle: "",
  fecha_limite: "",
  foto: null,
};

/** Migra borradores antiguos que guardaban `fecha_llegada_prevista` como datetime-local. */
export function normalizeNuevaRutaDraft(
  raw: Record<string, unknown> | null | undefined
): NuevaRutaDraft {
  if (!raw) return { ...EMPTY_NUEVA_RUTA_DRAFT };

  const legacyDatetime = String(raw.fecha_llegada_prevista ?? "");
  const fecha_salida =
    String(raw.fecha_salida ?? "") ||
    extractDateFromDatetime(legacyDatetime);
  const hora_salida =
    String(raw.hora_salida ?? "") ||
    extractTimeFromDatetime(legacyDatetime);

  return {
    origen: String(raw.origen ?? ""),
    destino: String(raw.destino ?? ""),
    fecha_salida,
    hora_salida,
    espacio_tamano: String(raw.espacio_tamano ?? ""),
    espacio_detalle: String(raw.espacio_detalle ?? ""),
    plazas_acompanante: String(raw.plazas_acompanante ?? "1"),
    precio_neto_plaza: String(raw.precio_neto_plaza ?? ""),
    precio_neto: String(raw.precio_neto ?? ""),
  };
}
