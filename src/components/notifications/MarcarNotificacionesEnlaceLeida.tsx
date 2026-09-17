"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "./NotificationProvider";

/** Marca como leídas las notificaciones cuyo enlace coincide con la página actual. */
export function MarcarNotificacionesEnlaceLeida({
  enlace,
  enlaces,
}: {
  enlace?: string;
  enlaces?: string[];
}) {
  const { markAsReadByEnlace } = useNotifications();
  const marcado = useRef(false);
  const lista = (enlaces?.length ? enlaces : enlace ? [enlace] : []).join("\n");

  useEffect(() => {
    if (marcado.current || !lista) return;
    marcado.current = true;
    for (const href of lista.split("\n")) {
      void markAsReadByEnlace(href);
    }
  }, [lista, markAsReadByEnlace]);

  return null;
}
