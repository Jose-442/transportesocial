"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notificacion } from "@/types/database";
import { NotificationToast } from "./NotificationToast";

type Ctx = {
  unreadCount: number;
  notifications: Notificacion[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsReadByEnlace: (enlace: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const NotificationContext = createContext<Ctx | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return ctx;
}

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Sin audio en algunos navegadores hasta interacción del usuario
  }
}

export function NotificationProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [toast, setToast] = useState<Notificacion | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    setNotifications((data as Notificacion[]) ?? []);
  }, [userId]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!userId) return;
      const supabase = createClient();
      await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("id", id)
        .eq("user_id", userId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    },
    [userId]
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    const supabase = createClient();
    await supabase
      .from("notificaciones")
      .update({ leida: true })
      .eq("user_id", userId)
      .eq("leida", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  }, [userId]);

  const markAsReadByEnlace = useCallback(
    async (enlace: string) => {
      if (!userId) return;
      const supabase = createClient();
      await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("user_id", userId)
        .eq("enlace", enlace)
        .eq("leida", false);
      setNotifications((prev) =>
        prev.map((n) => (n.enlace === enlace ? { ...n, leida: true } : n))
      );
    },
    [userId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notificaciones-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificaciones",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notif = payload.new as Notificacion;
          setNotifications((prev) => [notif, ...prev]);
          setToast(notif);
          playNotificationSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, markAsRead, markAllAsRead, markAsReadByEnlace, refresh }}
    >
      {children}
      {toast && (
        <NotificationToast
          notification={toast}
          onClose={() => setToast(null)}
          onOpen={() => {
            markAsRead(toast.id);
            setToast(null);
          }}
        />
      )}
    </NotificationContext.Provider>
  );
}
