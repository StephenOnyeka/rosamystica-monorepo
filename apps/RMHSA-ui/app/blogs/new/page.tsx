"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import ScrollDiv from "@/components/Scroll";
import Loading from "@/components/loading";
import { useAdminContext } from "@/hooks/useAdminContext";

const BlogForm = dynamic(() => import("@/components/BlogForm"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function NewBlogPage() {
  const { isAdmin } = useAdminContext();

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
            href="/blogs"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-contingent/10 hover:bg-contingent/20 text-contingent transition-colors duration-200"
            aria-label="Back to blogs"
          >
            <ArrowLeft2 size={20} color="#00416d" variant="Bold" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-contingent font-playfair">
              Create New Blog
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Write, preview, and publish your post
            </p>
          </div>
        </div>

        {isAdmin ? (
          <div className="max-w-3xl">
            <BlogForm redirectAfterSubmit="/blogs" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-contingent/10 flex items-center justify-center mb-4">
              <ArrowLeft2 size={28} color="#00416d" variant="Bold" />
            </div>
            <h2 className="text-xl font-semibold text-contingent mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              You need to be logged in as admin to create blog posts.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-x-2 bg-contingent text-white px-6 py-2.5 rounded-sm hover:bg-contingent-2 transition-colors duration-200 text-sm font-medium"
            >
              Go to Admin Login
            </Link>
          </div>
        )}

        <br />
        <br />
      </div>
    </div>
  );
}
