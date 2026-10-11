"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@/hooks/useAdminContext";
import { SubscriptionsContextProvider } from "@/context/SubscriptionContext";
import { Toaster } from "@/components/Toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <SubscriptionsContextProvider>{children}</SubscriptionsContextProvider>
      </AdminProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
