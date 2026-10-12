"use client";

import { Suspense } from "react";
import { useBlogs } from "@/lib/queries";
import { useAdminContext } from "@/hooks/useAdminContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AddCircle } from "iconsax-reactjs";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import BlogsDetails from "@/components/BlogsDetails";
import Loading from "@/components/loading";
import { LuPlus } from "react-icons/lu";

function BlogsContent() {
  const { isAdmin } = useAdminContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const currentPage = Number(page) || 1; // Ensure page is a number
  const postsPerPage = 5;

  const { data, isPending } = useBlogs(currentPage, postsPerPage);
  const blogs = data?.blogs;
  const totalPages = data?.totalPages ?? 0;

  if (isPending) return <Loading />;

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
        {/* <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold font-poppins text-contingent">
            Rosa Mystica High School Blog & News
            <span className="block w-full h-0.5 bg-gray-300 mt-2 border border-primary"></span>
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
        </div> */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
              Rosa Mystica High School Blog & News
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
          {blogs &&
            blogs.map((blog) => <BlogsDetails key={blog.id} blog={blog} />)}

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
