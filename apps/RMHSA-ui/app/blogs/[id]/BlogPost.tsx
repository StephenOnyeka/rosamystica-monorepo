"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Loading from "@/components/loading";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import type { Blog } from "@/lib/types";

import { customFetch } from "@/lib/api";

export default function BlogPost({ id }: { id: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await customFetch<Blog>(`/api/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!blog) return null;

  return (
    <div>
      <Link href="/blogs">
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
      <div key={blog.id || blog._id || ""} className="bg-white p-6 mb-6 max-w-5xl mx-auto rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {(blog.image || (blog as any).coverImage) && (
          <div className="w-full h-72 md:h-96 -mx-6 -mt-6 mb-8 bg-gray-900 overflow-hidden">
            <img
              src={(blog.image || (blog as any).coverImage) as string}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="font-bold text-center text-3xl md:text-4xl text-gray-900 mb-6 font-playfair">{blog.title}</h1>
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-poppins"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.body) }}
        />
        <br />
        <p className="text-sm text-gray-400 font-medium">
          Published {formatDistanceToNow(new Date(blog.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
