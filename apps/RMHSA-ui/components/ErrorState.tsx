"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  LuArrowLeft,
  LuClock,
  LuCircleAlert,
  LuFileQuestion,
  LuRefreshCw,
  LuWifiOff,
} from "react-icons/lu";
import {
  getErrorStatus,
  getFriendlyErrorMessage,
  isOfflineError,
  isTimeoutError,
} from "@/lib/api";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface ErrorStateProps {
  /** The caught error; used to pick the icon, title and friendly message. */
  error?: unknown;
  /** Retry handler. Omit to hide the retry button. */
  onRetry?: () => void;
  isRetrying?: boolean;
  /** Optional secondary link, e.g. "Back to Blogs". */
  backHref?: string;
  backLabel?: string;
  title?: string;
  message?: string;
  className?: string;
  children?: ReactNode;
}

type Variant = "offline" | "timeout" | "notFound" | "generic";

function getVariant(error: unknown, online: boolean): Variant {
  if (!online || isOfflineError(error)) return "offline";
  if (isTimeoutError(error)) return "timeout";
  if (getErrorStatus(error) === 404) return "notFound";
  return "generic";
}

const VARIANTS: Record<
  Variant,
  { icon: typeof LuWifiOff; title: string; tone: string }
> = {
  offline: {
    icon: LuWifiOff,
    title: "No internet connection",
    tone: "bg-secondary/10 text-secondary",
  },
  timeout: {
    icon: LuClock,
    title: "Taking longer than usual",
    tone: "bg-primary/10 text-primary",
  },
  notFound: {
    icon: LuFileQuestion,
    title: "Content not found",
    tone: "bg-contingent/10 text-contingent",
  },
  generic: {
    icon: LuCircleAlert,
    title: "We couldn't load this",
    tone: "bg-red-50 text-red-500",
  },
};

/**
 * Friendly, reusable in-page error card. Never shows raw technical errors
 * (e.g. "Failed to fetch") to visitors.
 */
export default function ErrorState({
  error,
  onRetry,
  isRetrying = false,
  backHref,
  backLabel = "Go back",
  title,
  message,
  className = "",
  children,
}: ErrorStateProps) {
  const online = useOnlineStatus();
  const variant = getVariant(error, online);
  const { icon: Icon, title: defaultTitle, tone } = VARIANTS[variant];

  return (
    <div
      role="alert"
      className={`max-w-xl mx-auto my-10 rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm md:px-12 ${className}`}
    >
      <div
        className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${tone}`}
      >
        <Icon className="h-8 w-8" />
      </div>

      <h2 className="mb-2 text-xl font-bold text-contingent font-playfair">
        {title ?? defaultTitle}
      </h2>
      <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-gray-500 font-poppins">
        {message ?? getFriendlyErrorMessage(error)}
      </p>

      {variant === "offline" && (
        <p className="mb-6 text-xs font-medium text-secondary font-poppins">
          This page will refresh automatically once you&apos;re back online.
        </p>
      )}

      {children}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-contingent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-contingent-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuRefreshCw
              className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying…" : "Try again"}
          </button>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <LuArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
