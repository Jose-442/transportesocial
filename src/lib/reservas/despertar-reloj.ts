import { createAdminClient } from "@/lib/supabase/admin";
import { procesarResenasExpiradas } from "@/lib/resenas/cron";
import { procesarCronsReservas } from "@/lib/reservas/cron";

const CADA_MS = 15 * 60 * 1000;

type Marca = { ultima: number; ocupado: boolean };

const reloj = globalThis as typeof globalThis & { __relojTransporte?: Marca };

/**
 * La tarea de devolver, marcar entregado y soltar el pago.
 * Como mucho una vez cada cuarto de hora en este servidor.
 */
export async function despertarReloj(): Promise<void> {
  const marca = reloj.__relojTransporte ?? { ultima: 0, ocupado: false };
  reloj.__relojTransporte = marca;
  const ahora = Date.now();
  if (marca.ocupado || ahora - marca.ultima < CADA_MS) return;

  marca.ocupado = true;
  marca.ultima = ahora;
  try {
    const admin = createAdminClient();
    if (!admin) return;
    await procesarCronsReservas(admin);
    await procesarResenasExpiradas(admin);
  } catch (err) {
    marca.ultima = 0;
    console.error("[reloj]", err);
  } finally {
    marca.ocupado = false;
  }
}
