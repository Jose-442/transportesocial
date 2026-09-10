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

const DRAFT_PREFIX = "transporte-social-";
export const CUENTA_ID_KEY = "transporte-social-cuenta-id";

/** Borra borradores del navegador (no se mezclan entre cuentas). */
export function clearAllFormDrafts() {
  if (typeof window === "undefined") return;
  const locales: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (
      k &&
      k.startsWith(DRAFT_PREFIX) &&
      k !== CUENTA_ID_KEY &&
      k !== "transporte-social-cookie-consent"
    ) {
      locales.push(k);
    }
  }
  for (const k of locales) localStorage.removeItem(k);

  const sesion: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k && k.startsWith(DRAFT_PREFIX)) sesion.push(k);
  }
  for (const k of sesion) sessionStorage.removeItem(k);
}

export function syncBorradoresConCuenta(userId: string | null) {
  if (typeof window === "undefined") return;
  const last = localStorage.getItem(CUENTA_ID_KEY) ?? "";
  const uid = userId ?? "";
  if (last !== uid) {
    clearAllFormDrafts();
  }
  if (uid) {
    localStorage.setItem(CUENTA_ID_KEY, uid);
  } else {
    localStorage.removeItem(CUENTA_ID_KEY);
  }
}

type DraftConUid<T> = T & { _uid?: string };

export function borradorEsDeCuenta(raw: unknown, uid: string): boolean {
  if (!raw || typeof raw !== "object") return false;
  const draftUid = String((raw as { _uid?: string })._uid ?? "");
  if (uid) return draftUid === uid;
  return draftUid === "";
}

export function loadOwnedDraft<T extends object>(
  key: string,
  uid: string
): T | null {
  const raw = loadDraft<DraftConUid<T> | null>(key);
  if (!raw || typeof raw !== "object") return null;
  if (!borradorEsDeCuenta(raw, uid)) {
    clearDraft(key);
    return null;
  }
  const rest = { ...raw };
  delete rest._uid;
  return rest as T;
}

export function saveOwnedDraft<T extends object>(
  key: string,
  data: T,
  uid: string
) {
  saveDraft(key, { ...data, _uid: uid });
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
  filtrosViajes: "transporte-social-filtros-viajes-draft",
  filtrosBultos: "transporte-social-filtros-bultos-draft",
  recuperar: "transporte-social-recuperar-draft",
  editarNombre: "transporte-social-editar-nombre-draft",
  editarSobreTi: "transporte-social-editar-sobre-ti-draft",
  editarVehiculo: "transporte-social-editar-vehiculo-draft",
  reservarRuta: (rutaId: string) =>
    `transporte-social-reservar-ruta-draft-${rutaId}`,
  capacidad: (rutaId: string) => `transporte-social-capacidad-draft-${rutaId}`,
  disputa: (reservaId: string) =>
    `transporte-social-disputa-draft-${reservaId}`,
  chat: (reservaId: string) => `transporte-social-chat-draft-${reservaId}`,
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
};

export type NuevaRutaDraft = {
  origen: string;
  destino: string;
  fecha_salida: string;
  hora_salida: string;
  espacio_tamano: string;
  espacio_detalle: string;
  plazas_acompanante: string;
  plazas_marcadas?: boolean;
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
  hora_limite: string;
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
  plazas_acompanante: "",
  plazas_marcadas: false,
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
  hora_limite: "",
  foto: null,
};

/** El «1» antiguo se guardaba solo, aunque nadie lo hubiera marcado. */
function normalizePlazasAcompananteDraft(
  raw: Record<string, unknown>
): Pick<NuevaRutaDraft, "plazas_acompanante" | "plazas_marcadas"> {
  const p = String(raw.plazas_acompanante ?? "");
  const valid = p === "0" || p === "1" || p === "2" || p === "3" ? p : "";
  const marcadas = raw.plazas_marcadas === true;

  if (marcadas) {
    return {
      plazas_acompanante: valid,
      plazas_marcadas: valid !== "",
    };
  }

  if (valid === "0" || valid === "2" || valid === "3") {
    return { plazas_acompanante: valid, plazas_marcadas: true };
  }

  if (valid === "1" && String(raw.precio_neto_plaza ?? "").trim() !== "") {
    return { plazas_acompanante: "1", plazas_marcadas: true };
  }

  return { plazas_acompanante: "", plazas_marcadas: false };
}

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
    ...normalizePlazasAcompananteDraft(raw),
    precio_neto_plaza: String(raw.precio_neto_plaza ?? ""),
    precio_neto: String(raw.precio_neto ?? ""),
  };
}
