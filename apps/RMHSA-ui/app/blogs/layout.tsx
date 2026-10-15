import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog & News | Rosa Mystica High School - Top Girls School in Nigeria",
  description:
    "Explore latest news, academic accomplishments, events, and inspiring stories from Rosa Mystica High School, Agulu, Anambra State.",
  path: "/blogs",
});

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
