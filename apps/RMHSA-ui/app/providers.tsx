"use client";

import { AdminProvider } from "@/hooks/useAdminContext";
import { NotificationsContextProvider } from "@/context/NotificationsContext";
import { BlogsContextProvider } from "@/context/BlogsContext";
import { SubscriptionsContextProvider } from "@/context/SubscriptionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <NotificationsContextProvider>
        <BlogsContextProvider>
          <SubscriptionsContextProvider>{children}</SubscriptionsContextProvider>
        </BlogsContextProvider>
      </NotificationsContextProvider>
    </AdminProvider>
  );
}
