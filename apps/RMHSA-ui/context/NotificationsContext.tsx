"use client";

import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Notification } from "@/lib/types";

export interface NotificationsState {
  notifications: Notification[] | null;
}

export type NotificationsAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "CREATE_NOTIFICATION"; payload: Notification }
  | { type: "DELETE_NOTIFICATION"; payload: Notification }
  | { type: "UPDATE_NOTIFICATION"; payload: Notification };

export interface NotificationsContextValue extends NotificationsState {
  dispatch: Dispatch<NotificationsAction>;
}

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState => {
  // Helper function to compare notification IDs (supports both 'id' and '_id')
  const compareIds = (
    notification: Notification,
    targetId?: string | null,
  ): boolean => {
    if (!targetId) return false;
    return notification.id === targetId || notification._id === targetId;
  };

  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return { notifications: action.payload };
    case "CREATE_NOTIFICATION":
      return {
        notifications: [action.payload, ...(state.notifications ?? [])],
      };
    case "DELETE_NOTIFICATION":
      return {
        notifications: (state.notifications ?? []).filter(
          (w) =>
            !compareIds(w, action.payload?._id) &&
            !compareIds(w, action.payload?.id),
        ),
      };
    case "UPDATE_NOTIFICATION":
      return {
        notifications: (state.notifications ?? []).map((notification) =>
          compareIds(notification, action.payload._id) ||
          compareIds(notification, action.payload.id)
            ? action.payload
            : notification,
        ),
      };
    default:
      return state;
  }
};

export const NotificationsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(notificationsReducer, {
    notifications: null,
  });
  return (
    <NotificationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NotificationsContext.Provider>
  );
};
