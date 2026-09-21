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

async function getBlog(id: string): Promise<Blog | null> {
  try {
    const response = await fetch(
      `https://rmhsa-servered.vercel.app/api/blogs/${id}`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    return (await response.json()) as Blog;
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
