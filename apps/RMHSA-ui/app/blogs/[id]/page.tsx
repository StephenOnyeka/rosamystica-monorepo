import type { Metadata } from "next";
import BlogPost from "./BlogPost";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  buildMetadata,
} from "@/lib/seo";
import type { Blog } from "@/lib/types";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

import { customFetch } from "@/lib/api";

async function getBlog(id: string): Promise<Blog | null> {
  try {
    return await customFetch<Blog>(`/api/blogs/${id}`, { skipCache: true });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);

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
