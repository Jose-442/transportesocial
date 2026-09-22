"use server";

import { enviarEnlaceRecuperarContrasena } from "@/lib/auth/enviar-recuperacion";

export async function solicitarEnlaceRecuperarContrasena(
  email: string
): Promise<{ ok?: boolean; error?: string }> {
  return enviarEnlaceRecuperarContrasena(email);
}
