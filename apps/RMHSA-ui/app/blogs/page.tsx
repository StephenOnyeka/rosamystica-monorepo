"use client";

import { Suspense } from "react";
import { useBlogs } from "@/lib/queries";
import { useAdminContext } from "@/hooks/useAdminContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import BlogsDetails from "@/components/BlogsDetails";
import ErrorState from "@/components/ErrorState";
import {
  BlogListSkeleton,
  BlogsPageSkeleton,
} from "@/components/skeletons/BlogSkeleton";
import { LuPlus } from "react-icons/lu";

function BlogsContent() {
  const { isAdmin } = useAdminContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const currentPage = Number(page) || 1; // Ensure page is a number
  const postsPerPage = 5;

  const { data, isPending, error, refetch, isFetching } = useBlogs(
    currentPage,
    postsPerPage
  );
  const blogs = data?.blogs;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />

        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
              Rosa Mystica High School Blog &amp; News
            </h1>
            <p className="text-gray-600">
              Stay updated with our latest blogs and news
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/blogs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-contingent hover:bg-contingent-2 text-white font-semibold rounded-xl shadow-sm transition-all cursor-pointer text-sm self-start md:self-auto"
            >
              <LuPlus className="w-5 h-5" />
              Create Blog
            </Link>
          )}
        </div>

        {/* Blog list */}
        <div className="font-semibold w-full max-w-5xl mx-auto">
          {isPending ? (
            <BlogListSkeleton count={postsPerPage} />
          ) : !blogs ? (
            <ErrorState
              error={error}
              onRetry={() => refetch()}
              isRetrying={isFetching}
              backHref="/"
              backLabel="Back to Home"
            />
          ) : (
            <>
              {blogs.map((blog) => (
                <BlogsDetails key={blog.id} blog={blog} />
              ))}

              {/* Pagination Controls */}
              <br />
              <br />
              <div className="w-full flex justify-between mb-8">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => router.push(`/blogs?page=${currentPage - 1}`)}
                  className="bg-contingent text-sm text-white px-4 py-2 rounded disabled:bg-contingent/20 cursor-pointer"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => router.push(`/blogs?page=${currentPage + 1}`)}
                  className="bg-contingent text-sm text-white px-4 py-2 rounded disabled:bg-contingent/20 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogsPageSkeleton />}>
      <BlogsContent />
    </Suspense>
  );
}
