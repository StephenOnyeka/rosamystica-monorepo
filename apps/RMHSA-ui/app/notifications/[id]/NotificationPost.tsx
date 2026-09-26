"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/lib/types";
import { customFetch } from "@/lib/api";
import { cleanHtmlContent } from "@/lib/utils";

export default function NotificationPost({ id }: { id: string }) {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await customFetch<Notification>(
          `/api/notifications/${id}`
        );
        setNotification(data);
        const relatedBlogId = (data.relatedBlogId || data.blogId) as string | undefined;
        const isPushedBlog = data.type === "blog" || !!relatedBlogId;

        if (isPushedBlog) {
          router.replace(`/blogs/${relatedBlogId || id}`);
        } else {
          router.replace(`/notifications?id=${id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id, router]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!notification) return null;

  return (
    <div>
      <Link href="/notifications">
        <div className="p-6 pb-0 hover:text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-arrow-left-circle"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
            />
          </svg>
        </div>
      </Link>
      <div key={notification._id} className="bg-white p-6 mb-6">
        <p className="font-bold text-center text-3xl">{notification.title}</p>
        <br />
        <div
          className="prose max-w-none text-gray-800 leading-relaxed text-base"
          dangerouslySetInnerHTML={{
            __html: cleanHtmlContent(notification.body),
          }}
        />
        <br />
        <p>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
