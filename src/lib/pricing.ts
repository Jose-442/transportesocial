import {
  COMMISSION_RATE,
  PUBLICATION_FEE_EUR,
  SUBSCRIPTION_MONTHLY_EUR,
} from "./constants";

export function calcPrecioConComision(precioNeto: number): number {
  return Math.round(precioNeto * (1 + COMMISSION_RATE) * 100) / 100;
}

export function calcComision(precioNeto: number): number {
  return Math.round(precioNeto * COMMISSION_RATE * 100) / 100;
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** @deprecated Usar requiresPublicationPayment en servidor. */
export function requiresPublicationFee(): boolean {
  return true;
}

export function publicationFeeAmount(): number {
  return PUBLICATION_FEE_EUR;
}

export function subscriptionFeeLabel(): string {
  return formatEur(SUBSCRIPTION_MONTHLY_EUR);
}
