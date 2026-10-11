// Tiny toast bus — mutations emit events, the Toaster component listens.
// No external library required.

export type ToastType = "success" | "error" | "info";

export interface ToastEvent {
  id: string;
  type: ToastType;
  message: string;
}

type Listener = (event: ToastEvent) => void;

const listeners = new Set<Listener>();
let counter = 0;

export const toastBus = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(type: ToastType, message: string) {
    const event: ToastEvent = { id: `toast-${++counter}`, type, message };
    listeners.forEach((fn) => fn(event));
  },
  success: (msg: string) => toastBus.emit("success", msg),
  error: (msg: string) => toastBus.emit("error", msg),
  info: (msg: string) => toastBus.emit("info", msg),
};
