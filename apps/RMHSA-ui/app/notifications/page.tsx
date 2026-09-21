"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import NotificationsDetails from "@/components/NotificationsDetails";
import Loading from "@/components/loading";
import { useNotificationsContext } from "@/hooks/useNotificationsContext";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";

// Dynamically import NotificationForm with no SSR
const NotificationForm = dynamic(
  () => import("@/components/NotificationForm"),
  {
    ssr: false,
  },
);

interface NotificationsApiResponse {
  notifications: Notification[];
  totalPosts: number;
  totalPages: number;
}

function NotificationsContent() {
  const { notifications, dispatch } = useNotificationsContext();
  const { isAdmin } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const currentPage = Number(page) || 1; // Ensure page is a number
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(
        `https://rmhsa-servered.vercel.app/api/notifications?page=${currentPage}&limit=${postsPerPage}`,
      );
      const data = (await response.json()) as NotificationsApiResponse;

      if (response.ok) {
        setTotalPages(data.totalPages);
        dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications }); // Make sure you're dispatching the notifications
        setLoading(false);
      } else {
        console.error("Failed to fetch notifications:", data);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch, currentPage]); // Use currentPage here

  if (loading) return <Loading />;

  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />
        {/* displaying in block form */}
        <div className="flex w-full gap-x-8 max-lg:flex-wrap">
          <div className="font-semibold w-full">
            {notifications &&
              notifications.map((notification) => (
                <NotificationsDetails
                  key={notification._id}
                  notification={notification}
                />
              ))}

            {/* Pagination Controls */}
            <br />
            <br />
            <div className="w-full flex justify-between mb-8">
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  router.push(`/notifications?page=${currentPage - 1}`)
                }
                className="bg-contingent text-sm text-white px-4 py-2 rounded disabled:bg-contingent/20"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  router.push(`/notifications?page=${currentPage + 1}`)
                }
                className="bg-contingent text-sm text-white px-4 py-2 rounded disabled:bg-contingent/20"
              >
                Next
              </button>
            </div>
          </div>
          {isAdmin && (
            <div className="w-full">
              <NotificationForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  return (
    <Suspense fallback={<Loading />}>
      <NotificationsContent />
    </Suspense>
  );
}
