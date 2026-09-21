"use client";

import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Subscription } from "@/lib/types";

export interface SubscriptionsState {
  subscriptions: Subscription[] | null;
}

export type SubscriptionsAction =
  | { type: "SET_SUBSCRIPTIONS"; payload: Subscription[] }
  | { type: "CREATE_SUBSCRIPTION"; payload: Subscription }
  | { type: "DELETE_SUBSCRIPTION"; payload: Subscription };

export interface SubscriptionsContextValue extends SubscriptionsState {
  dispatch: Dispatch<SubscriptionsAction>;
}

export const SubscriptionContext =
  createContext<SubscriptionsContextValue | null>(null);

export const subscriptionReducer = (
  state: SubscriptionsState,
  action: SubscriptionsAction,
): SubscriptionsState => {
  switch (action.type) {
    case "SET_SUBSCRIPTIONS":
      return { subscriptions: action.payload };
    case "CREATE_SUBSCRIPTION":
      return { subscriptions: [action.payload, ...(state.subscriptions ?? [])] };
    case "DELETE_SUBSCRIPTION":
      return {
        subscriptions: (state.subscriptions ?? []).filter(
          (w) => w._id !== action.payload._id,
        ),
      };
    default:
      return state;
  }
};

export const SubscriptionsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(subscriptionReducer, {
    subscriptions: null,
  });
  return (
    <SubscriptionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
