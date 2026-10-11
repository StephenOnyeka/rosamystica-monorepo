"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toastBus, type ToastEvent } from "@/lib/toast";
import { LuCheck, LuX, LuInfo } from "react-icons/lu";

const DURATION = 4000;

const icons = {
  success: <LuCheck className="w-4 h-4" />,
  error: <LuX className="w-4 h-4" />,
  info: <LuInfo className="w-4 h-4" />,
};

const palette = {
  success: {
    bar: "bg-emerald-500",
    icon: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-800",
  },
  error: {
    bar: "bg-red-500",
    icon: "bg-red-100 text-red-600",
    text: "text-red-800",
  },
  info: {
    bar: "bg-blue-500",
    icon: "bg-blue-100 text-blue-600",
    text: "text-blue-800",
  },
};

interface LiveToast extends ToastEvent {
  visible: boolean;
}

export function Toaster() {
  const [toasts, setToasts] = useState<LiveToast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t)),
    );
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      350,
    );
  }, []);

  useEffect(() => {
    const unsub = toastBus.subscribe((event) => {
      setToasts((prev) => [...prev, { ...event, visible: true }]);
      const timer = setTimeout(() => dismiss(event.id), DURATION);
      timers.current.set(event.id, timer);
    });
    return () => { unsub(); };
  }, [dismiss]);

  // Clean up timers on unmount
  useEffect(
    () => () => timers.current.forEach(clearTimeout),
    [],
  );

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full"
      style={{ pointerEvents: "none" }}
    >
      {toasts.map((t) => {
        const c = palette[t.type];
        return (
          <div
            key={t.id}
            role="alert"
            className={`relative flex items-start gap-3 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 pr-9 overflow-hidden transition-all duration-300 ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ pointerEvents: "auto" }}
          >
            {/* Accent bar */}
            <span
              className={`absolute left-0 inset-y-0 w-1 ${c.bar} rounded-l-xl`}
            />
            {/* Icon */}
            <span
              className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full mt-0.5 ${c.icon}`}
            >
              {icons[t.type]}
            </span>
            {/* Message */}
            <p className={`text-sm font-medium leading-snug ${c.text} flex-1`}>
              {t.message}
            </p>
            {/* Dismiss */}
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LuX className="w-3.5 h-3.5" />
            </button>
            {/* Progress bar */}
            <span
              className={`absolute bottom-0 left-0 h-0.5 ${c.bar} opacity-30 animate-shrink`}
              style={{ animationDuration: `${DURATION}ms` }}
            />
          </div>
        );
      })}
    </div>
  );
}
