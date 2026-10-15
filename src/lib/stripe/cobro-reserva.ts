export type CobroConReserva = {
  status: string;
  metadata?: Record<string, string> | null;
};

/** El cobro es de estas reservas y de ninguna otra. */
export function cobroDeEstasReservas(
  cobro: CobroConReserva,
  reservaIds: readonly string[]
): boolean {
  if (cobro.status !== "succeeded") return false;
  const pedidas = new Set(reservaIds.map((id) => id.trim()).filter(Boolean));
  if (pedidas.size === 0) return false;

  const marcadas = new Set(
    [cobro.metadata?.reserva_ids, cobro.metadata?.reserva_id]
      .flatMap((valor) => (valor ?? "").split(","))
      .map((id) => id.trim())
      .filter(Boolean)
  );
  if (marcadas.size === 0) return false;

  for (const id of marcadas) {
    if (!pedidas.has(id)) return false;
  }
  return true;
}
