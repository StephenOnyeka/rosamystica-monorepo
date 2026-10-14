"use client";

import { useEffect, useRef } from "react";
import { LuWifiOff } from "react-icons/lu";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toastBus } from "@/lib/toast";

/**
 * Global connectivity feedback:
 *  - While offline: a persistent pill stays pinned at the bottom of the screen
 *    (it never auto-dismisses, so visitors always know why things aren't loading).
 *  - On reconnect: the pill disappears and a short success toast is shown.
 *    React Query's `refetchOnReconnect` then re-fetches active queries automatically.
 */
export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      toastBus.success("You're back online", "Refreshing your content…");
    }
  }, [isOnline]);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[9999] -translate-x-1/2 px-4 w-full max-w-md pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-contingent-text px-4 py-3 text-white shadow-xl shadow-black/20 ring-1 ring-white/10 font-poppins animate-in fade-in slide-in-from-bottom-2 duration-300">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
        </span>
        <LuWifiOff className="h-4 w-4 shrink-0 text-secondary" />
        <p className="text-sm leading-snug">
          <span className="font-semibold">You&apos;re offline.</span>{" "}
          <span className="text-white/80">
            We&apos;ll reconnect automatically.
          </span>
        </p>
      </div>
    </div>
  );
}
