import type { Metadata } from "next";
import NotificationPost from "./NotificationPost";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildMetadata } from "@/lib/seo";
import type { Notification } from "@/lib/types";

interface NotificationPageProps {
  params: Promise<{ id: string }>;
}

import { customFetch } from "@/lib/api";

async function getNotification(id: string): Promise<Notification | null> {
  try {
    return await customFetch<Notification>(`/api/notifications/${id}`, {
      skipCache: true,
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: NotificationPageProps): Promise<Metadata> {
  const { id } = await params;
  const notification = await getNotification(id);

  if (!notification) {
    return { title: `Notification - ${SITE_NAME}` };
  }

  return buildMetadata({
    title: notification.title,
    description: notification.desc || "",
    path: `/notifications/${id}`,
    image: DEFAULT_OG_IMAGE,
    type: "article",
    publishedTime: notification.createdAt,
    modifiedTime: notification.updatedAt,
  });
}

export default async function NotificationPage({
  params,
}: NotificationPageProps) {
  const { id } = await params;
  return <NotificationPost id={id} />;
}
