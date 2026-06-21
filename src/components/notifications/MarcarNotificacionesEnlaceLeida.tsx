"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "./NotificationProvider";

/** Marca como leídas las notificaciones cuyo enlace coincide con la página actual. */
export function MarcarNotificacionesEnlaceLeida({ enlace }: { enlace: string }) {
  const { markAsReadByEnlace } = useNotifications();
  const marcado = useRef(false);

  useEffect(() => {
    if (marcado.current) return;
    marcado.current = true;
    void markAsReadByEnlace(enlace);
  }, [enlace, markAsReadByEnlace]);

  return null;
}
