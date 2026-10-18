/** Comisión de la plataforma sobre el precio del conductor, solo en viajes cobrados. */
export const COMMISSION_RATE = 0.18;
export const COMMISSION_PERCENT_LABEL = "18 %";
/** Ya no se cobra suscripción; se mantiene por datos antiguos en Stripe. */
export const SUBSCRIPTION_MONTHLY_EUR = 0.95;
export const PUBLICATION_FEE_EUR = 0.9;
export const FREE_PUBLICATIONS = 3;
/** Plazo del conductor para aceptar o rechazar tras el pago. */
export const CONDUCTOR_APPROVAL_HOURS = 24;
/** Primera hora desde el pago: si cancela quien reservó, se devuelve todo. */
export const CANCELACION_ERROR_HORAS = 1;
/** Pasada esa hora, quien reservó recupera el viaje si faltan más de estas horas; si faltan menos, la mitad. El 18 % no vuelve. */
export const CANCELACION_ANTICIPADA_HORAS = 24;
export const DISPUTE_WINDOW_HOURS = 8;
export const AUTO_DELIVERED_AFTER_ARRIVAL_HOURS = 2;
export const REVIEW_WINDOW_DAYS = 14;
export const MAX_ASIENTOS_POR_VIAJE = 3;

export const APP_NAME = "Transporte Social";
