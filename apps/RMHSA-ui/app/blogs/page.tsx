"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AddCircle } from "iconsax-reactjs";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import BlogsDetails from "@/components/BlogsDetails";
import Loading from "@/components/loading";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Blog } from "@/lib/types";
import { customFetch } from "@/lib/api";

interface BlogsApiResponse {
  blogs: Blog[];
  totalPosts: number;
  totalPages: number;
}

function BlogsContent() {
  const { blogs, dispatch } = useBlogsContext();
  const { isAdmin } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const currentPage = Number(page) || 1; // Ensure page is a number
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await customFetch<BlogsApiResponse>(
          `/api/blogs?page=${currentPage}&limit=${postsPerPage}`,
        );
        setTotalPages(data.totalPages);
        dispatch({ type: "SET_BLOGS", payload: data.blogs });
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [dispatch, currentPage]); // Use currentPage here

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

        {/* Page title + Create Blog button */}
        <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-contingent font-playfair">
            Blog Posts
          </h1>
          {isAdmin && (
            <Link
              href="/blogs/new"
              className="inline-flex items-center gap-x-2 bg-contingent text-white text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-contingent-2 transition-colors duration-200 group"
            >
              <AddCircle
                size={18}
                color="#ffffff"
                variant="Bold"
                className="group-hover:rotate-90 transition-transform duration-200"
              />
              Create Blog
            </Link>
          )}
        </div>

        {/* Blog list */}
        <div className="font-semibold w-full max-w-6xl mx-auto">
          {blogs &&
            blogs.map((blog, index) => (
              <BlogsDetails key={blog.id || blog._id || index} blog={blog} />
            ))}

          {/* Pagination Controls */}
          <br />
          <br />
          <div className="w-full flex justify-between mb-8">
            <button
              disabled={currentPage <= 1}
              onClick={() => router.push(`/blogs?page=${currentPage - 1}`)}
              className="bg-contingent text-sm text-white px-4 py-2 rounded disabled:bg-contingent/20"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => router.push(`/blogs?page=${currentPage + 1}`)}
              className="bg-contingent text-sm text-white px-4 py-2 rounded disabled:bg-contingent/20"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Blogs() {
  return (
    <Suspense fallback={<Loading />}>
      <BlogsContent />
    </Suspense>
  );
}
