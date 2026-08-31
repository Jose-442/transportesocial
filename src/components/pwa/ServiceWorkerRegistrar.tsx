"use client";

import { useEffect } from "react";
import { registerPushServiceWorker } from "@/lib/push/browser";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    void registerPushServiceWorker();
  }, []);

  return null;
}
