"use client";

import { useState, useRef, useCallback, type ButtonHTMLAttributes, type ReactNode } from "react";
import { CgSpinner } from "react-icons/cg";

export interface ThrottledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Async or sync click handler. If a promise is returned, loading state will be auto-managed. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** Throttle window in milliseconds to prevent double-clicks (default: 800ms) */
  throttleMs?: number;
  /** Explicit loading state override */
  isLoading?: boolean;
  /** Optional text to display while loading */
  loadingText?: ReactNode;
  /** Button content */
  children: ReactNode;
}

export function ThrottledButton({
  onClick,
  throttleMs = 800,
  isLoading: externalLoading,
  loadingText,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ThrottledButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const lastClickRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      const now = Date.now();

      // Block if clicked within throttle window or currently loading
      if (isThrottled || internalLoading || externalLoading || disabled) {
        e.preventDefault();
        return;
      }

      if (now - lastClickRef.current < throttleMs) {
        e.preventDefault();
        return;
      }

      lastClickRef.current = now;
      setIsThrottled(true);

      // Start throttle timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsThrottled(false);
      }, throttleMs);

      if (onClick) {
        try {
          const result = onClick(e);
          if (result && typeof (result as Promise<void>).then === "function") {
            setInternalLoading(true);
            await result;
          }
        } catch (error) {
          console.error("Action failed:", error);
        } finally {
          setInternalLoading(false);
        }
      }
    },
    [onClick, throttleMs, isThrottled, internalLoading, externalLoading, disabled]
  );

  const showLoading = externalLoading || internalLoading;
  const isButtonDisabled = disabled || showLoading || isThrottled;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center transition-all ${
        isButtonDisabled ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      {...props}
    >
      {showLoading ? (
        <span className="inline-flex items-center gap-2">
          <CgSpinner className="w-4 h-4 animate-spin" />
          {loadingText ?? children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default ThrottledButton;