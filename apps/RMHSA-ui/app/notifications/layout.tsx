import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "School Notifications & Announcements | Rosa Mystica High School",
  description:
    "Stay informed with official announcements, academic schedules, events, and notices from Rosa Mystica High School, Agulu.",
  path: "/notifications",
});

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
