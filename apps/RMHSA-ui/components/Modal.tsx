"use client";

import { useEffect, type ReactNode } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  footer,
  children,
  maxWidth = "max-w-2xl",
}: ModalProps) {
  // Close on Escape key press and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-2xl border border-gray-100 z-10 my-8 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex-1 min-w-0">
            {title ? (
              typeof title === "string" ? (
                <h2 className="text-xl font-bold text-gray-800 font-playfair leading-snug">
                  {title}
                </h2>
              ) : (
                title
              )
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer mt-0.5"
            aria-label="Close modal"
          >
            <IoCloseCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
