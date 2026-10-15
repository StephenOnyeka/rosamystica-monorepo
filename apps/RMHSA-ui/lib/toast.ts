import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastEvent {
  id: string;
  type: ToastType;
  message: string;
}

/**
 * Global Toast Helper powered by Sonner with richColors.
 * Supports:
 * - toast.success("Message")
 * - toast.error("Message")
 * - toast.info("Message")
 * - toast.warning("Message")
 * - toast.loading("Message")
 * - toast.promise(promise, { loading, success, error })
 */
export const toastBus = {
  success: (msg: string, description?: string) =>
    toast.success(msg, description ? { description } : undefined),
  error: (msg: string, description?: string) =>
    toast.error(msg, description ? { description } : undefined),
  info: (msg: string, description?: string) =>
    toast.info(msg, description ? { description } : undefined),
  warning: (msg: string, description?: string) =>
    toast.warning(msg, description ? { description } : undefined),
  emit: (type: ToastType, message: string) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
      default:
        toast.info(message);
        break;
    }
  },
  subscribe: () => () => {},
};

export { toast };
