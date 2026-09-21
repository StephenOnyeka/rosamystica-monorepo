"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import BlogsDetails from "@/components/BlogsDetails";
import Loading from "@/components/loading";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Blog } from "@/lib/types";

// Dynamically import BlogForm with no SSR
const BlogForm = dynamic(() => import("@/components/BlogForm"), {
  ssr: false,
});

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
      const response = await fetch(
        `https://rmhsa-servered.vercel.app/api/blogs?page=${currentPage}&limit=${postsPerPage}`,
      );
      const data = (await response.json()) as BlogsApiResponse;

      if (response.ok) {
        setTotalPages(data.totalPages);
        dispatch({ type: "SET_BLOGS", payload: data.blogs }); // Make sure you're dispatching the blogs
        setLoading(false);
      } else {
        console.error("Failed to fetch blogs:", data);
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
        {/* displaying in block form */}
        <div className="flex w-full gap-x-8 max-lg:flex-wrap">
          <div className="font-semibold w-full">
            {blogs &&
              blogs.map((blog) => <BlogsDetails key={blog._id} blog={blog} />)}

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

          {isAdmin && (
            <div className="w-full">
              <BlogForm />
            </div>
          )}
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
