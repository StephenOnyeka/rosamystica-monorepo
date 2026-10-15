"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import NotificationsDetails from "@/components/NotificationDetail";
import Loading from "@/components/loading";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";
import { useNotifications } from "@/lib/queries";
import ErrorState from "@/components/ErrorState";
import { useIsMutating } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import NotificationDetailModal from "@/components/NotificationDetailModal";
import { ThrottledButton } from "@/components/ThrottledButton";
import { LuBell, LuEye, LuFileText, LuList, LuPencil, LuPlus, LuSend } from "react-icons/lu";
import { NotificationBing } from "iconsax-reactjs";

// Dynamically import NotificationForm with no SSR
const NotificationForm = dynamic(
  () => import("@/components/NotificationForm"),
  { ssr: false },
);

function NotificationsContent() {
  const { isAdmin } = useAdminContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const selectedId = searchParams?.get("id");
  const currentPage = Number(page) || 1;
  const postsPerPage = 5;
  const [filterType, setFilterType] = useState<string | null>(null);

  const {
    data: notificationsData,
    isPending,
    error,
    refetch,
    isFetching,
  } = useNotifications(currentPage, postsPerPage);
  const notifications = notificationsData?.notifications;
  const totalPages = notificationsData?.totalPages ?? 0;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSavingNotification, setIsSavingNotification] = useState(false);
  const isMutatingNotification =
    useIsMutating({ mutationKey: ["notifications", "save"] }) > 0;
  const isNotificationSaving = isSavingNotification || isMutatingNotification;

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingNotification(null);
    setIsPreview(false);
    setIsSavingNotification(false);
  };

  // Deep-linking handle for ?id= query param derived during render
  const activeNotification =
    selectedNotification ??
    (selectedId && notifications
      ? (notifications.find((n) => (n.id || n._id) === selectedId) ?? null)
      : null);

  if (isPending) return <Loading />;

  const allNotifications = (notifications || []).slice().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Filter notifications based on selected type
  const filteredNotifications = filterType
    ? allNotifications.filter((n) => n.type === filterType)
    : allNotifications;

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
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
              Rosa Mystica High School Announcements
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
        <div className="max-w-5xl mx-auto my-6">
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
          <div className="bg-white rounded-xl">
            {!notifications ? (
              <ErrorState
                error={error}
                onRetry={() => refetch()}
                isRetrying={isFetching}
                backHref="/"
                backLabel="Back to Home"
              />
            ) : filteredNotifications.length === 0 ? (
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
                      onEdit={(notif) => setEditingNotification(notif)}
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

      {/* Modal for Creating / Editing Notifications */}
      {isAdmin && (
        <Modal
          isOpen={isCreateModalOpen || !!editingNotification}
          onClose={handleCloseModal}
          title={
            <h2 className="text-xl font-bold text-contingent font-playfair flex items-center gap-2">
              <NotificationBing size="22" variant="Bold" />
              {editingNotification
                ? "Edit Notification"
                : "Create New Notification"}
            </h2>
          }
          footer={
            <div className="w-full flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
              >
                {isPreview ? (
                  <>
                    <LuPencil className="w-4 h-4 text-contingent" />
                    Back to Edit
                  </>
                ) : (
                  <>
                    <LuEye className="w-4 h-4 text-contingent" />
                    Preview
                  </>
                )}
              </button>
              <ThrottledButton
                type="submit"
                form="notification-form"
                isLoading={isNotificationSaving}
                loadingText={editingNotification ? "Updating..." : "Publishing..."}
                disabled={isNotificationSaving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-contingent hover:bg-contingent-2 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <LuSend className="w-4 h-4" />
                {editingNotification ? "Update" : "Publish"}
              </ThrottledButton>
            </div>
          }
          maxWidth="max-w-3xl"
        >
          <NotificationForm
            initialData={editingNotification}
            hideFooterButtons
            isPreview={isPreview}
            onTogglePreview={() => setIsPreview(!isPreview)}
            onClose={handleCloseModal}
            onSavingChange={setIsSavingNotification}
          />
        </Modal>
      )}

      {/* Modal for Viewing Notification Details */}
      <NotificationDetailModal
        notification={activeNotification}
        onClose={() => {
          setSelectedNotification(null);
          if (searchParams?.get("id")) {
            router.replace("/notifications");
          }
        }}
        onEdit={(notif) => setEditingNotification(notif)}
      />
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NotificationsContent />
    </Suspense>
  );
}
