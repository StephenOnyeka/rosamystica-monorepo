"use client";

import Modal from "@/components/Modal";
import type { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cleanHtmlContent } from "@/lib/utils";
import { LuClock, LuTag } from "react-icons/lu";
import { NotificationBing, Note, Edit } from "iconsax-reactjs";
import { useAdminContext } from "@/hooks/useAdminContext";
import { IoPencil, IoPencilOutline } from "react-icons/io5";

interface NotificationDetailModalProps {
  notification: Notification | null;
  onClose: () => void;
  onEdit?: (notification: Notification) => void;
}

export default function NotificationDetailModal({
  notification,
  onClose,
  onEdit,
}: NotificationDetailModalProps) {
  const { isAdmin } = useAdminContext();

  if (!notification) return null;

  const isBlogType =
    notification.type === "blog" ||
    !!notification.relatedBlogId ||
    !!notification.blogId;

  const notificationTime = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
      })
    : "";

  const sanitizedBody = cleanHtmlContent(
    notification.body || notification.desc || "",
  );

  return (
    <Modal
      isOpen={!!notification}
      onClose={onClose}
      maxWidth="max-w-3xl"
      footer={
        <div className="w-full flex justify-end">
          <div className="flex gap-3">
            {isAdmin && onEdit && !isBlogType && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(notification);
                }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all shadow-xs cursor-pointer text-sm flex items-center gap-2"
              >
                <IoPencil size="18" />
                Edit
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header section with Iconsax Icon & Title */}
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs border-double border-4 ${
              isBlogType
                ? "bg-purple-50 text-purple-600 border-purple-100"
                : "bg-contingent/10 text-contingent border-contingent/20"
            }`}
          >
            {isBlogType ? (
              <Note size="28" variant="Bold" />
            ) : (
              <NotificationBing size="28" variant="Bold" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 font-playfair leading-snug">
              {notification.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {notificationTime && (
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <LuClock className="w-3.5 h-3.5 text-contingent" />
                  {notificationTime}
                </span>
              )}
              {notification.type && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-contingent/10 text-contingent capitalize">
                  <LuTag className="w-3 h-3" />
                  {String(notification.type)}
                </span>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Content body rendered using clean dangerouslySetInnerHTML */}
        <div
          className="prose max-w-none text-gray-800 leading-relaxed text-base font-normal space-y-4"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />
      </div>
    </Modal>
  );
}
