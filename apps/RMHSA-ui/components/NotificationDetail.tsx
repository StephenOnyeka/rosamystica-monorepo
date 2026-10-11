"use client";

import { useDeleteNotification } from "@/lib/queries";
import { IoIosCloseCircle } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";
import { customFetch } from "@/lib/api";
import { cleanHtmlContent, parseCleanHtml } from "@/lib/utils";
import { Geist } from "next/font/google";
import { SlOptions, SlOptionsVertical } from "react-icons/sl";
import { useEffect, useRef, useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const geist = Geist({ subsets: ["latin"] });
import { NotificationBing, Note, Edit, DocumentText } from "iconsax-reactjs";

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
    deleteNotification.mutate(notifId, {
      onError: (error) =>
        console.error("Failed to delete notification:", error),
    });
  };

  const handleCardClick = () => {
    if (!isPushedBlog && onSelect) {
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

  const notificationType =
    typeof notification.type === "string" ? notification.type : undefined;

  return (
    <div className={`mb-6 max-w-4xl mx-auto ${geist.className}`}>
      <div
        onClick={handleCardClick}
        className="relative flex bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOptionsOpen(false);
                          handleDelete(e);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Type badge if available */}
          {/* {notificationType && (
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
          )} */}
        </div>
      </div>

      {/* Separator line between notifications */}
      <hr className="border-gray-100 my-4" />
    </div>
  );
}

export default NotificationsDetails;
// "use client";

// import { useNotificationsContext } from "@/hooks/useNotificationsContext";
// import { IoIosCloseCircle } from "react-icons/io";
// import { formatDistanceToNow } from "date-fns";
// import Link from "next/link";
// import { useAdminContext } from "@/hooks/useAdminContext";
// import type { Notification } from "@/lib/types";
// import { customFetch } from "@/lib/api";
// import { cleanHtmlContent, parseCleanHtml } from "@/lib/utils";
// import { Geist } from "next/font/google";

// const geist = Geist({ subsets: ["latin"] });
// import { NotificationBing, Note, Edit } from "iconsax-reactjs";

// interface NotificationsDetailsProps {
//   notification: Notification;
//   onSelect?: (notification: Notification) => void;
//   onEdit?: (notification: Notification) => void;
// }

// function NotificationsDetails({
//   notification,
//   onSelect,
//   onEdit,
// }: NotificationsDetailsProps) {
//   const { dispatch } = useNotificationsContext();
//   const { isAdmin } = useAdminContext();

//   const notifId = notification.id || notification._id || "";
//   const relatedBlogId = (notification.relatedBlogId || notification.blogId) as
//     | string
//     | undefined;
//   const isPushedBlog = notification.type === "blog" || !!relatedBlogId;
//   const blogUrl = `/blogs/${relatedBlogId || notifId}`;

//   const handleDelete = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       const json = await customFetch<Notification>(
//         `/api/notifications/${notifId}`,
//         {
//           method: "DELETE",
//         },
//       );
//       dispatch({ type: "DELETE_NOTIFICATION", payload: json });
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//     }
//   };

//   const handleCardClick = () => {
//     if (!isPushedBlog && onSelect) {
//       onSelect(notification);
//     }
//   };

//   // Get notification badge color based on type
//   const getTypeBadgeColor = (type?: string) => {
//     switch (type) {
//       case "job":
//         return "bg-blue-500 text-blue-700";
//       case "announcement":
//         return "bg-green-500 text-green-700";
//       case "blog":
//         return "bg-purple-500 text-purple-700";
//       default:
//         return "bg-primary text-white";
//     }
//   };

//   const rawContent = notification.body || notification.desc || "";
//   const cleanHtml = cleanHtmlContent(rawContent);

//   const formatTimeAgo = (date: Date): string => {
//     const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
//     if (seconds < 60) return `${seconds}s ago`;
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes}min${minutes !== 1 ? "s" : ""} ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours}hr${hours !== 1 ? "s" : ""} ago`;
//     const days = Math.floor(hours / 24);
//     if (days < 7) return `${days}day${days !== 1 ? "s" : ""} ago`;
//     const weeks = Math.floor(days / 7);
//     if (weeks < 4) return `${weeks}wk${weeks !== 1 ? "s" : ""} ago`;
//     const months = Math.floor(days / 30);
//     if (months < 12) return `${months}mo ago`;
//     const years = Math.floor(days / 365);
//     return `${years}yr${years !== 1 ? "s" : ""} ago`;
//   };

//   const notificationTime = notification.createdAt
//     ? formatTimeAgo(new Date(notification.createdAt))
//     : "";

//   const notificationType =
//     typeof notification.type === "string" ? notification.type : undefined;

//   return (
//     <div className={`mb-6 max-w-4xl mx-auto ${geist.className}`}>
//       <div
//         onClick={handleCardClick}
//         className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
//       >
//         {/* Iconsax icon for notification type identification */}
//         <div className="flex-shrink-0 mr-4">
//           <div
//             className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
//               isPushedBlog
//                 ? "bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-100"
//                 : "bg-contingent/10 text-contingent border border-contingent/20 group-hover:bg-contingent/20"
//             }`}
//           >
//             {isPushedBlog ? (
//               <Note size="24" variant="Bold" />
//             ) : (
//               <NotificationBing size="24" variant="Bold" />
//             )}
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1 min-w-0">
//               {/* Title */}
//               {isPushedBlog ? (
//                 <Link href={blogUrl}>
//                   <h3 className="text-base font-bold text-gray-900 group-hover:text-contingent transition-colors line-clamp-2 leading-snug">
//                     {notification.title}
//                   </h3>
//                 </Link>
//               ) : (
//                 <h3 className="text-base font-bold text-gray-900 group-hover:text-contingent transition-colors line-clamp-2 leading-snug">
//                   {notification.title}
//                 </h3>
//               )}

//               {/* Clean HTML content preview */}
//               <div className="text-sm max-sm:text-xs text-gray-600 mt-1.5 line-clamp-2 font-normal prose prose-sm max-w-none">
//                 {parseCleanHtml(rawContent)}
//               </div>
//             </div>

//             {/* Time and actions */}
//             <div className="flex flex-col items-end gap-2 flex-shrink-0">
//               {/* Time ago */}
//               {notificationTime && (
//                 <span className="text-xs text-gray-500 whitespace-nowrap">
//                   {notificationTime}
//                 </span>
//               )}

//               {/* Actions for admins */}
//               {isAdmin && (
//                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                   {!isPushedBlog && onEdit && (
//                     <button
//                       className="p-1 text-gray-400 hover:text-contingent transition-colors rounded-lg hover:bg-gray-100"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEdit(notification);
//                       }}
//                       title="Edit notification"
//                     >
//                       <Edit size={18} variant="Bold" />
//                     </button>
//                   )}
//                   <button
//                     className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
//                     onClick={handleDelete}
//                     title="Delete notification"
//                   >
//                     <IoIosCloseCircle
//                       size={22}
//                       className="text-gray-400 hover:text-red-500 transition-colors"
//                     />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Type badge if available */}
//           {notificationType && (
//             <div className="mt-2 flex items-center gap-2">
//               {notificationType !== "blog" && (
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(notificationType)}`}
//                 >
//                   {notificationType.charAt(0).toUpperCase() +
//                     notificationType.slice(1)}
//                 </span>
//               )}
//               {notificationType === "blog" && (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
//                   From Blog Post
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Separator line between notifications */}
//       <hr className="border-gray-100 my-4" />
//     </div>
//   );
// }

// export default NotificationsDetails;
