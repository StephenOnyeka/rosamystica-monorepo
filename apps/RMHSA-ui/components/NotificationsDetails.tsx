"use client";

import { useNotificationsContext } from "@/hooks/useNotificationsContext";
import { IoIosCloseCircle } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";
import { customFetch } from "@/lib/api";
import { cleanHtmlContent } from "@/lib/utils";
import { NotificationBing, Note } from "iconsax-reactjs";

interface NotificationsDetailsProps {
  notification: Notification;
  onSelect?: (notification: Notification) => void;
}

function NotificationsDetails({
  notification,
  onSelect,
}: NotificationsDetailsProps) {
  const { dispatch } = useNotificationsContext();
  const { isAdmin } = useAdminContext();

  const notifId = notification.id || notification._id || "";
  const relatedBlogId = (notification.relatedBlogId || notification.blogId) as
    | string
    | undefined;
  const isPushedBlog = notification.type === "blog" || !!relatedBlogId;
  const blogUrl = `/blogs/${relatedBlogId || notifId}`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const json = await customFetch<Notification>(
        `/api/notifications/${notifId}`,
        {
          method: "DELETE",
        },
      );
      dispatch({ type: "DELETE_NOTIFICATION", payload: json });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleCardClick = () => {
    if (!isPushedBlog && onSelect) {
      onSelect(notification);
    }
  };

  // Get notification badge color based on type
  const getTypeBadgeColor = (type?: string) => {
    switch (type) {
      case "job":
        return "bg-blue-500 text-blue-700";
      case "announcement":
        return "bg-green-500 text-green-700";
      case "blog":
        return "bg-purple-500 text-purple-700";
      default:
        return "bg-primary text-white";
    }
  };

  const rawContent = notification.body || notification.desc || "";
  const cleanHtml = cleanHtmlContent(rawContent);
  const notificationTime = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
      })
    : "";

  const notificationType =
    typeof notification.type === "string" ? notification.type : undefined;

  return (
    <div className="mb-6 max-w-4xl mx-auto">
      <div
        onClick={handleCardClick}
        className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      >
        {/* Iconsax icon for notification type identification */}
        <div className="flex-shrink-0 mr-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isPushedBlog
                ? "bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-100"
                : "bg-contingent/10 text-contingent border border-contingent/20 group-hover:bg-contingent/20"
            }`}
          >
            {isPushedBlog ? (
              <Note size="24" variant="Bold" />
            ) : (
              <NotificationBing size="24" variant="Bold" />
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title */}
              {isPushedBlog ? (
                <Link href={blogUrl}>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-contingent transition-colors line-clamp-2 leading-snug">
                    {notification.title}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-base font-bold text-gray-900 group-hover:text-contingent transition-colors line-clamp-2 leading-snug">
                  {notification.title}
                </h3>
              )}

              {/* Clean HTML content preview */}
              <div
                className="text-sm max-sm:text-xs text-gray-600 mt-1.5 line-clamp-2 font-normal prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            </div>

            {/* Time and actions */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {/* Time ago */}
              {notificationTime && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {notificationTime}
                </span>
              )}

              {/* Delete button for admins */}
              {isAdmin && (
                <button
                  className="relative group opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDelete}
                  title="Delete notification"
                >
                  <IoIosCloseCircle
                    size={24}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Type badge if available */}
          {notificationType && (
            <div className="mt-2 flex items-center gap-2">
              {notificationType !== "blog" && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(notificationType)}`}
                >
                  {notificationType.charAt(0).toUpperCase() +
                    notificationType.slice(1)}
                </span>
              )}
              {notificationType === "blog" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  From Blog Post
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Separator line between notifications */}
      <hr className="border-gray-100 my-4" />
    </div>
  );
}

export default NotificationsDetails;
