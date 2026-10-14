"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * Tracks the browser's connectivity. Hydration-safe: the server (and the first
 * client render) assume "online", then the real value is read after hydration.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
