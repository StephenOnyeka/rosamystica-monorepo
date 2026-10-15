"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@/hooks/useAdminContext";
import { SubscriptionsContextProvider } from "@/context/SubscriptionContext";
import { Toaster } from "@/components/Toaster";
import OfflineIndicator from "@/components/OfflineIndicator";
import { getErrorStatus } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            // Always attempt the request (even when the browser reports offline)
            // so failures surface in our friendly ErrorState instead of leaving
            // a skeleton paused forever. Reconnect refetching still applies.
            networkMode: "always",
            refetchOnReconnect: true,
            retry: (failureCount, error) => {
              const status = getErrorStatus(error);
              // Client errors (404, 400, …) won't fix themselves by retrying
              if (status && status >= 400 && status < 500) return false;
              return failureCount < 2;
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <SubscriptionsContextProvider>{children}</SubscriptionsContextProvider>
      </AdminProvider>
      <Toaster />
      <OfflineIndicator />
    </QueryClientProvider>
  );
}
