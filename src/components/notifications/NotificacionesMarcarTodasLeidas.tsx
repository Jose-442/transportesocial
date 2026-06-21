"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "./NotificationProvider";

/** Al entrar en /notificaciones, quita el badge de la campana. */
export function NotificacionesMarcarTodasLeidas() {
  const { markAllAsRead } = useNotifications();
  const marcado = useRef(false);

  useEffect(() => {
    if (marcado.current) return;
    marcado.current = true;
    void markAllAsRead();
  }, [markAllAsRead]);

  return null;
}
