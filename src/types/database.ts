import type { OfertaDesglose, TipoSolicitud } from "@/lib/solicitud-viaje";

export type { TipoSolicitud, OfertaDesglose };

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  sobre_ti: string | null;
  vehiculo_marca: string | null;
  vehiculo_modelo: string | null;
  vehiculo_anio: number | null;
  distintivo_ambiental: import("@/lib/vehiculo").DistintivoAmbiental | null;
  phone: string | null;
  trial_ends_at: string;
  subscription_active: boolean;
  subscription_ends_at: string | null;
  trial_warning_sent_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  aceptacion_automatica?: boolean;
  saldo_acumulado?: number;
  rating_promedio?: number | null;
  rating_cantidad?: number;
  created_at: string;
  updated_at: string;
};

export type PerfilPublico = Pick<
  Profile,
  | "id"
  | "display_name"
  | "avatar_url"
  | "sobre_ti"
  | "vehiculo_marca"
  | "vehiculo_modelo"
  | "vehiculo_anio"
  | "distintivo_ambiental"
  | "rating_promedio"
  | "rating_cantidad"
>;

export type TipoOfertaCapacidad = "bulto" | "asiento";
export type EstadoOfertaCapacidad = "disponible" | "agotado";

export type OfertaCapacidad = {
  id: string;
  ruta_conductor_id: string;
  tipo: TipoOfertaCapacidad;
  espacio_tamano: string | null;
  espacio_detalle: string | null;
  plazas_totales: number;
  plazas_ocupadas: number;
  precio_neto: number;
  precio_publicado: number;
  estado: EstadoOfertaCapacidad;
  created_at: string;
};

export type EstadoReserva =
  | "pendiente_pago"
  | "pendiente_aprobacion"
  | "confirmada"
  | "pagado_escrow"
  | "en_transito"
  | "entregado"
  | "disputa"
  | "liberado"
  | "cancelado";

export type Reserva = {
  id: string;
  tipo: "ruta_directa" | "bulto_oferta" | "capacidad_extra";
  ruta_conductor_id: string | null;
  anuncio_bulto_id: string | null;
  oferta_precio_id: string | null;
  oferta_capacidad_id: string | null;
  cantidad: number;
  transportista_id: string;
  cliente_id: string;
  precio_neto: number;
  precio_total: number;
  comision_plataforma: number;
  estado: EstadoReserva;
  fecha_llegada_prevista: string;
  fecha_liberacion_escrow: string | null;
  expira_aprobacion_en: string | null;
  aceptada_en: string | null;
  cancelada_en: string | null;
  motivo_cancelacion: string | null;
  en_transito_en: string | null;
  entregada_en: string | null;
  entregada_auto: boolean;
  plazo_reclamacion_hasta: string | null;
  plazo_resena_hasta: string | null;
  bulto_descripcion: string | null;
  bulto_medidas: string | null;
  created_at: string;
  updated_at: string;
};

export type MotivoDisputa =
  | "conductor_no_presento"
  | "conductor_cancelo"
  | "problema_viaje"
  | "cliente_no_presento"
  | "otro";

export type EstadoDisputa =
  | "abierta"
  | "resuelta_cliente"
  | "resuelta_conductor";

export type Disputa = {
  id: string;
  reserva_id: string;
  abierta_por: string;
  motivo: MotivoDisputa;
  descripcion: string;
  version_conductor: string | null;
  estado: EstadoDisputa;
  created_at: string;
  resuelta_en: string | null;
};

export type ChatCanal = {
  id: string;
  reserva_id: string;
  abierto: boolean;
  cerrado_en: string | null;
  created_at: string;
};

export type ChatMensaje = {
  id: string;
  canal_id: string;
  remitente_id: string;
  cuerpo: string;
  editado_en: string | null;
  eliminado: boolean;
  created_at: string;
};

export type RolResena = "cliente" | "conductor";

export type Resena = {
  id: string;
  reserva_id: string;
  autor_id: string;
  destinatario_id: string;
  rol_autor: RolResena;
  puntuacion: number;
  comentario: string;
  bulto_cuidado: boolean | null;
  bulto_embalaje_correcto: boolean | null;
  is_visible: boolean;
  visible_en: string | null;
  created_at: string;
};

export type RutaConductor = {
  id: string;
  user_id: string;
  origen: string;
  destino: string;
  fecha_salida: string;
  fecha_llegada_prevista: string;
  espacio_disponible: string;
  precio_neto: number;
  precio_publicado: number;
  estado: "activa" | "reservada" | "completada" | "cancelada";
  created_at: string;
  updated_at: string;
};

export type AnuncioBulto = {
  id: string;
  user_id: string;
  origen: string;
  destino: string;
  descripcion: string;
  medidas: string;
  foto_url: string | null;
  fecha_limite: string | null;
  tipo_solicitud: TipoSolicitud;
  estado: "activo" | "reservado" | "completado" | "cancelado";
  created_at: string;
  updated_at: string;
};

export type OfertaPrecio = {
  id: string;
  anuncio_bulto_id: string;
  conductor_id: string;
  precio_neto: number;
  precio_total: number;
  mensaje: string | null;
  desglose: OfertaDesglose | null;
  estado: "pendiente" | "aceptada" | "rechazada" | "expirada";
  created_at: string;
  updated_at: string;
};

export type Notificacion = {
  id: string;
  user_id: string;
  tipo:
    | "nueva_oferta"
    | "oferta_aceptada"
    | "oferta_rechazada"
    | "nueva_reserva"
    | "reserva_actualizada"
    | "reserva_pendiente_aprobacion"
    | "reserva_confirmada"
    | "reserva_rechazada"
    | "reserva_expirada"
    | "nuevo_mensaje_chat"
    | "disputa_abierta"
    | "resena_pendiente"
    | "resena_publicada"
    | "sistema";
  titulo: string;
  mensaje: string;
  enlace: string | null;
  leida: boolean;
  created_at: string;
};
