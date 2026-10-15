"use client";

import { useDeleteNotification } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";
import { parseCleanHtml } from "@/lib/utils";
import { Geist } from "next/font/google";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect, useRef, useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { ThrottledButton } from "@/components/ThrottledButton";

const geist = Geist({ subsets: ["latin"] });

import { NotificationBing, DocumentText } from "iconsax-reactjs";

interface NotificationsDetailsProps {
  notification: Notification;
  onSelect?: (notification: Notification) => void;
  onEdit?: (notification: Notification) => void;
}

function NotificationsDetails({
  notification,
  onSelect,
  onEdit,
}: NotificationsDetailsProps) {
  const router = useRouter();
  const deleteNotification = useDeleteNotification();
  const { isAdmin } = useAdminContext();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const notifId = notification.id || notification._id || "";
  const relatedBlogId = (notification.relatedBlogId || notification.blogId) as
    | string
    | undefined;
  const isPushedBlog = notification.type === "blog" || !!relatedBlogId;
  const blogUrl = `/blogs/${relatedBlogId || notifId}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteNotification.isPending) return;
    deleteNotification.mutate(notifId, {
      onError: (error) =>
        console.error("Failed to delete notification:", error),
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering navigation if clicking inside flyout options
    if (flyoutRef.current && flyoutRef.current.contains(e.target as Node)) {
      return;
    }

    if (isPushedBlog) {
      if (e.metaKey || e.ctrlKey) {
        window.open(blogUrl, "_blank");
      } else {
        router.push(blogUrl);
      }
    } else if (onSelect) {
      onSelect(notification);
    }
  };

  // Close flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setIsOptionsOpen(false);
      }
    };
    if (isOptionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOptionsOpen]);

  const rawContent = notification.body || notification.desc || "";

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s `;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m `;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h `;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d `;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w `;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}m `;
    const years = Math.floor(days / 365);
    return `${years}y `;
  };

  const notificationTime = notification.createdAt
    ? formatTimeAgo(new Date(notification.createdAt))
    : "";



  return (
    <div className={`mb-6 max-w-4xl mx-auto ${geist.className}`}>
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick(e as unknown as React.MouseEvent);
          }
        }}
        aria-label={
          isPushedBlog
            ? `Read blog post: ${notification.title}`
            : `View announcement: ${notification.title}`
        }
        className="relative flex bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group focus:outline-none focus:ring-2 focus:ring-contingent/30"
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
              <DocumentText size="24" variant="Bold" />
            ) : (
              <NotificationBing size="24" variant="Bold" />
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* <div className="flex items-start justify-between gap-4"> */}
          <div className="flex flex-col min-w-0">
            <div className="flex justify-between gap-2 items-start w-full">
              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 group-hover:text-contingent transition-colors line-clamp-2 leading-snug">
                {notification.title}
              </h3>

              {/* Clean HTML content preview */}
              {notificationTime && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {notificationTime}
                </span>
              )}
            </div>

            {/* Time and actions */}
            <div className="flex justify-between items-center gap-2 flex-shrink-0">
              {/* Time ago */}              

              <div className="text-sm max-sm:text-xs text-gray-600 mt-1.5 line-clamp-2 font-normal prose prose-sm max-w-none">
                {parseCleanHtml(rawContent)}
              </div>

              {/* Options trigger + flyout */}
              {isAdmin && (
                <div ref={flyoutRef} className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOptionsOpen((prev) => !prev);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Options"
                  >
                    <SlOptionsVertical size={15} />
                  </button>

                  {/* Flyout dropdown */}
                  {isOptionsOpen && (
                    <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[140px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {!isPushedBlog && onEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOptionsOpen(false);
                            onEdit(notification);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-contingent/5 hover:text-contingent transition-colors cursor-pointer"
                        >
                          <LuPencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                      <ThrottledButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOptionsOpen(false);
                          handleDelete(e);
                        }}
                        isLoading={deleteNotification.isPending}
                        loadingText="Deleting..."
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                        Delete
                      </ThrottledButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Separator line between notifications */}
      <hr className="border-gray-100 my-4" />
    </div>
  );
}

export default NotificationsDetails;
