import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe/server";
import {
  partesDelPago,
  totalesMovimientos,
  type PartesPago,
  type TotalesMovimientos,
} from "@/lib/stripe/partes-pago";

export type PagoConPartes = PartesPago & {
  id: string;
  cuando: string;
};

export type SaldoStripe = TotalesMovimientos & {
  disponibleCents: number;
  pendienteCents: number;
  incompleto: boolean;
  pagos: PagoConPartes[];
};

const PAGINAS = 15;

function eurosDe(
  lista: Stripe.Balance.Available[] | Stripe.Balance.Pending[]
): number {
  return lista.find((fila) => fila.currency === "eur")?.amount ?? 0;
}

function comisionDe(
  bt: string | Stripe.BalanceTransaction | null | undefined
): number {
  if (!bt || typeof bt === "string") return 0;
  return bt.fee ?? 0;
}

async function movimientos(stripe: Stripe) {
  const filas: Stripe.BalanceTransaction[] = [];
  let startingAfter: string | undefined;
  for (let pagina = 0; pagina < PAGINAS; pagina += 1) {
    const lista = await stripe.balanceTransactions.list({
      limit: 100,
      starting_after: startingAfter,
    });
    filas.push(...lista.data);
    if (!lista.has_more || lista.data.length === 0) {
      return { filas, incompleto: false };
    }
    startingAfter = lista.data[lista.data.length - 1]?.id;
  }
  return { filas, incompleto: true };
}

async function gestionDelPago(
  stripe: Stripe,
  paymentIntentId: string
): Promise<number | null> {
  const sesiones = await stripe.checkout.sessions.list({
    payment_intent: paymentIntentId,
    limit: 1,
  });
  const sesion = sesiones.data[0];
  if (!sesion) return null;
  const lineas = await stripe.checkout.sessions.listLineItems(sesion.id, {
    limit: 20,
  });
  const gastos = lineas.data.find((linea) =>
    /gastos de gestión/i.test(linea.description ?? "")
  );
  if (!gastos?.amount_total && gastos?.amount_total !== 0) return null;
  return gastos.amount_total;
}

async function pagoDeIntent(
  stripe: Stripe,
  pi: Stripe.PaymentIntent
): Promise<PagoConPartes | null> {
  if (pi.status !== "succeeded") return null;
  const chargeId =
    typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
  if (!chargeId) return null;
  const cargo = await stripe.charges.retrieve(chargeId, {
    expand: ["balance_transaction", "refunds.data.balance_transaction"],
  });
  const stripeCents =
    comisionDe(cargo.balance_transaction) +
    (cargo.refunds?.data ?? []).reduce(
      (sum, reembolso) => sum + comisionDe(reembolso.balance_transaction),
      0
    );
  let gestionCents: number | null = null;
  try {
    gestionCents = await gestionDelPago(stripe, pi.id);
  } catch {
    gestionCents = null;
  }
  const partes = partesDelPago({
    cobradoCents: cargo.amount,
    devueltoCents: cargo.amount_refunded,
    stripeCents,
    gestionCents,
  });
  return {
    ...partes,
    id: pi.id,
    cuando: new Date(cargo.created * 1000).toISOString(),
  };
}

export async function loadSaldoStripe(): Promise<SaldoStripe | null> {
  let stripe: Stripe;
  try {
    stripe = getStripeServer();
  } catch {
    return null;
  }

  const [balance, movs, intents] = await Promise.all([
    stripe.balance.retrieve(),
    movimientos(stripe),
    stripe.paymentIntents.list({ limit: 15 }),
  ]);
  const totales = totalesMovimientos(
    movs.filas.map((fila) => ({
      type: fila.type,
      amount: fila.amount,
      fee: fila.fee,
    }))
  );
  const pagos = (
    await Promise.all(intents.data.map((pi) => pagoDeIntent(stripe, pi)))
  ).filter((pago): pago is PagoConPartes => pago != null);

  const { anotarTresPartesEnStripe } = await import("@/lib/stripe/anotar-partes");
  await Promise.all(
    pagos
      .filter(
        (pago) =>
          pago.devueltoCents > 0 &&
          pago.conductorCents === 0 &&
          pago.webCents != null
      )
      .map((pago) =>
        anotarTresPartesEnStripe(pago.id).catch((err) => {
          console.error("[admin-pagos] anotar partes", err);
        })
      )
  );

  return {
    ...totales,
    disponibleCents: eurosDe(balance.available),
    pendienteCents: eurosDe(balance.pending),
    incompleto: movs.incompleto,
    pagos,
  };
}
