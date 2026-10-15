import type { Metadata } from "next";
import BlogPost from "./BlogPost";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  buildMetadata,
} from "@/lib/seo";
import { getBlogServer } from "@/lib/server-api";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogServer(id);

  if (!blog) {
    return { title: `Blog - ${SITE_NAME}` };
  }

  return buildMetadata({
    title: blog.title,
    description: blog.desc,
    path: `/blogs/${id}`,
    image: blog.image ?? DEFAULT_OG_IMAGE,
    type: "article",
    publishedTime: blog.createdAt,
    modifiedTime: blog.updatedAt,
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;
  return <BlogPost id={id} />;
}
