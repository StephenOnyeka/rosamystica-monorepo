"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-reactjs";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import ScrollDiv from "@/components/Scroll";
import Loading from "@/components/loading";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Blog } from "@/lib/types";
import { customFetch } from "@/lib/api";

const BlogForm = dynamic(() => import("@/components/BlogForm"), {
  ssr: false,
  loading: () => <Loading />,
});

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAdminContext();

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

  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />

        {/* Page header */}
        <div className="flex items-center gap-x-4 mb-8">
          <Link
            href={`/blogs/${id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-contingent/10 hover:bg-contingent/20 text-contingent transition-colors duration-200"
            aria-label="Back to blog post"
          >
            <ArrowLeft2 size={20} color="#00416d" variant="Bold" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-contingent font-playfair">
              Edit Blog Post
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Update and save changes to your article
            </p>
          </div>
        </div>

        {error ? (
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm my-8">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        ) : !isAdmin ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-contingent/10 flex items-center justify-center mb-4">
              <ArrowLeft2 size={28} color="#00416d" variant="Bold" />
            </div>
            <h2 className="text-xl font-semibold text-contingent mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              You need to be logged in as admin to edit blog posts.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-x-2 bg-contingent text-white px-6 py-2.5 rounded-sm hover:bg-contingent-2 transition-colors duration-200 text-sm font-medium"
            >
              Go to Admin Login
            </Link>
          </div>
        ) : (
          <div className="">
            <BlogForm initialData={blog} redirectAfterSubmit={`/blogs/${id}`} />
          </div>
        )}

        <br />
        <br />
      </div>
    </div>
  );
}