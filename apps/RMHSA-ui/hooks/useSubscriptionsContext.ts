import { useContext } from "react";
import { SubscriptionContext } from "@/context/SubscriptionContext";

export const useSubscriptionsContext = () => {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw Error(
      "useSubscriptionsContext must be used inside a SubscriptionsContextProvider",
    );
  }

  return context;
};
