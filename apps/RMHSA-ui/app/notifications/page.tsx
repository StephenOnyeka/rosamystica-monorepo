"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import NotificationsDetails from "@/components/NotificationsDetails";
import Loading from "@/components/loading";
import { useNotificationsContext } from "@/hooks/useNotificationsContext";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";
import { customFetch } from "@/lib/api";
import Modal from "@/components/Modal";
import NotificationDetailModal from "@/components/NotificationDetailModal";
import { LuBell, LuBriefcase, LuCircle, LuFileText, LuFilter, LuList, LuPlus } from "react-icons/lu";

// Dynamically import NotificationForm with no SSR
const NotificationForm = dynamic(
  () => import("@/components/NotificationForm"),
  { ssr: false },
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
  const selectedId = searchParams?.get("id");
  const currentPage = Number(page) || 1;
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 5;
  const [filterType, setFilterType] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // Deep-linking handle for ?id= query param
  useEffect(() => {
    if (selectedId && notifications) {
      const found = notifications.find(
        (n) => (n.id || n._id) === selectedId,
      );
      if (found) {
        setSelectedNotification(found);
      }
    }
  }, [selectedId, notifications]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await customFetch<NotificationsApiResponse>(
          `/api/notifications?page=${currentPage}&limit=${postsPerPage}`,
        );
        setTotalPages(data.totalPages);
        dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
      } catch (error) {
        console.error(
          "Failed to fetch notifications, using dummy data:",
          error,
        );
        const dummyData: NotificationsApiResponse = {
          notifications: [],
          totalPosts: 0,
          totalPages: 1,
        };
        setTotalPages(1);
        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: dummyData.notifications,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch, currentPage]);

  if (loading) return <Loading />;

  // Filter notifications based on selected type
  const filteredNotifications = filterType
    ? notifications?.filter((n) => n.type === filterType) || []
    : notifications || [];

  return (
    <div className="pb-0">
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8 pb-10">
        <br />
        <Navbar />
        <br />
        <br />

        {/* Header Section with Create Notification Action for Admins */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-playfair mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with the latest announcements and updates from Rosa
              Mystica High School
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-contingent hover:bg-contingent-2 text-white font-semibold rounded-xl shadow-sm transition-all cursor-pointer text-sm self-start md:self-auto"
            >
              <LuPlus className="w-5 h-5" />
              Create Notification
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto my-6">
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2 overflow-x-auto"> */}
          <div className="bg-white border-b-2 border-gray-200 p-2 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterType(null)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                !filterType
                  ? "border-b-2 border-contingent text-contingent"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LuList className="w-4 h-4" />
              All
            </button>
            {isAdmin && (
              <button
                onClick={() => setFilterType("manual")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  filterType === "manual"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LuBell className="w-4 h-4" />
                Announcements
              </button>
            )}
            <button
              onClick={() => setFilterType("blog")}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                filterType === "blog"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LuFileText className="w-4 h-4" />
              Blogs
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto">
          {/* Notifications List */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"> */}
          <div className="bg-white rounded-xl">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <LuBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filterType
                    ? `No ${filterType} notifications found`
                    : "Be the first to see an announcement here"}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationsDetails
                      key={notification.id || notification._id}
                      notification={notification}
                      onSelect={(notif) => setSelectedNotification(notif)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="w-full flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() =>
                        router.push(`/notifications?page=${currentPage - 1}`)
                      }
                      className="bg-contingent disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-contingent-2 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        router.push(`/notifications?page=${currentPage + 1}`)
                      }
                      className="bg-contingent disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-contingent-2 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Creating Notifications */}
      {isAdmin && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          // title="Create Notification"
          title={(<h2 className="text-xl font-bold text-contingent font-playfair flex items-center gap-2">
            <LuBell className="w-5 h-5" />
            Create New Notification
          </h2>)}
          maxWidth="max-w-3xl"
        >
          <NotificationForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}

      {/* Modal for Viewing Notification Details */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => {
          setSelectedNotification(null);
          if (searchParams?.get("id")) {
            router.replace("/notifications");
          }
        }}
      />
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
