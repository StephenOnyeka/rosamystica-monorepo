"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      theme="light"
      toastOptions={{
        style: {
          borderRadius: "12px",
          fontFamily: "var(--font-poppins-sans), sans-serif",
          fontSize: "14px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  );
}
