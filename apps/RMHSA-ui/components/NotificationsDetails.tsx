"use client";

import { useNotificationsContext } from "@/hooks/useNotificationsContext";
import { IoIosCloseCircle } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Notification } from "@/lib/types";

interface NotificationsDetailsProps {
  notification: Notification;
}

import { customFetch } from "@/lib/api";

function NotificationsDetails({ notification }: NotificationsDetailsProps) {
  const { dispatch } = useNotificationsContext();
  const { isAdmin } = useAdminContext();

  const notifId = notification.id || notification._id || "";

  const handleClick = async () => {
    try {
      const json = await customFetch<Notification>(
        `/api/notifications/${notifId}`,
        {
          method: "DELETE",
        }
      );
      dispatch({ type: "DELETE_NOTIFICATION", payload: json });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div>
      {/* How the notifications render in an array of all notifications */}

      <div key={notifId} className="bg-white my-4 font-poppins">
        {/* <img src={notification.titleImg} alt="Preview" width={500} height={500} /> */}
        <div className="flex justify-between ">
          <div>
            <p className="text-sm text-slate-400 font-normal">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
            <br />
            <Link href={`/notifications/${notifId}`}>
              <p className=" font-bold text-2xl hover:text-red-400">
                {notification.title}
              </p>
            </Link>
            <br />
            <p className="font-semibold">
              {notification.desc.substring(0, 100)} ...
            </p>
            <br />
          </div>

          {isAdmin && (
            <p className="text-primary">
              <button className="relative group" onClick={handleClick}>
                <IoIosCloseCircle size={30} />
              </button>
            </p>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default NotificationsDetails;
