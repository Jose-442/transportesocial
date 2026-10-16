import { formatEur } from "@/lib/pricing";
import { centimosAEuros } from "@/lib/reservas/cancelacion";

export type MovimientoStripe = {
  type: string;
  amount: number;
  fee: number;
};

export type TotalesMovimientos = {
  cobradoCents: number;
  devueltoCents: number;
  comisionStripeCents: number;
  alBancoCents: number;
};

const COBROS = new Set(["charge", "payment"]);
const DEVOLUCIONES = new Set([
  "refund",
  "payment_refund",
  "payment_failure_refund",
]);

/** Suma todos los movimientos. La comisión es lo que Stripe se queda (si devuelve comisión, resta). */
export function totalesMovimientos(filas: MovimientoStripe[]): TotalesMovimientos {
  let cobradoCents = 0;
  let devueltoCents = 0;
  let comisionStripeCents = 0;
  let alBancoCents = 0;
  for (const fila of filas) {
    comisionStripeCents += fila.fee;
    if (COBROS.has(fila.type) && fila.amount > 0) cobradoCents += fila.amount;
    if (DEVOLUCIONES.has(fila.type) && fila.amount < 0) {
      devueltoCents += -fila.amount;
    }
    if (fila.type === "payout" && fila.amount < 0) alBancoCents += -fila.amount;
  }
  return { cobradoCents, devueltoCents, comisionStripeCents, alBancoCents };
}

export type PartesPago = {
  cobradoCents: number;
  devueltoCents: number;
  stripeCents: number;
  /** null si no sabemos separar el viaje de los gastos de gestión. */
  conductorCents: number | null;
  webCents: number | null;
  saldoCents: number;
};

/** Reparte un cobro: quién cobra, Stripe, el conductor y la web. */
export function partesDelPago(input: {
  cobradoCents: number;
  devueltoCents: number;
  stripeCents: number;
  gestionCents: number | null;
}): PartesPago {
  const cobradoCents = Math.round(input.cobradoCents);
  const devueltoCents = Math.max(0, Math.round(input.devueltoCents));
  const stripeCents = Math.round(input.stripeCents);
  const saldoCents = cobradoCents - devueltoCents - stripeCents;
  if (input.gestionCents == null) {
    return {
      cobradoCents,
      devueltoCents,
      stripeCents,
      conductorCents: null,
      webCents: null,
      saldoCents,
    };
  }
  const gestion = Math.max(0, Math.round(input.gestionCents));
  const viaje = Math.max(0, cobradoCents - gestion);
  const conductorCents = Math.max(0, viaje - devueltoCents);
  return {
    cobradoCents,
    devueltoCents,
    stripeCents,
    conductorCents,
    webCents: saldoCents - conductorCents,
    saldoCents,
  };
}

/** Texto que Stripe muestra en la descripción cuando el pago queda en tres partes. */
export function textoTresPartes(input: {
  devueltoCents: number;
  stripeCents: number;
  webCents: number;
}): string {
  const eur = (centimos: number) =>
    formatEur(centimosAEuros(centimos)).replaceAll("\u00a0", " ");
  return `${eur(input.devueltoCents)} vuelven a quien pagó. ${eur(input.stripeCents)} se los queda Stripe. ${eur(input.webCents)} para la web.`;
}
