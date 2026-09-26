"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Blog } from "@/lib/types";
import { customFetch } from "@/lib/api";
import { ThrottledButton } from "@/components/ThrottledButton";
import {
  LuCalendar,
  LuClock,
  LuUser,
  LuArrowRight,
  LuTrash2,
  LuPencil,
  LuShare2,
  LuCheck,
} from "react-icons/lu";

interface BlogsDetailsProps {
  blog: Blog;
}

function BlogsDetails({ blog }: BlogsDetailsProps) {
  const { dispatch } = useBlogsContext();
  const { isAdmin } = useAdminContext();
  const [copied, setCopied] = useState(false);

  const blogId = blog.id || blog._id || "";

  const handleDelete = async () => {
    // Optimistically remove from state
    dispatch({ type: "DELETE_BLOG", payload: blog });

    try {
      await customFetch<Blog>(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete blog:", error);
      // Rollback on failure
      dispatch({ type: "CREATE_BLOG", payload: blog });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/blogs/${blogId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getReadingTime = (content: string) => {
    const text = content ? content.replace(/<[^>]*>/g, " ").trim() : "";
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const coverImg =
    blog.backgroundImage ||
    blog.coverImage ||
    blog.image ||
    (blog as any).titleImg;

  // Clean description string (strip HTML tags if present)
  const cleanDesc = blog.desc
    ? blog.desc.replace(/<[^>]*>/g, "").trim()
    : blog.body
    ? blog.body.replace(/<[^>]*>/g, "").trim()
    : "";

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6 flex flex-col md:flex-row font-poppins">
      {/* Cover / Header Thumbnail */}
      <Link
        href={`/blogs/${blogId}`}
        className="w-full md:w-72 lg:w-80 h-52 md:h-auto relative overflow-hidden bg-gray-900 flex-shrink-0 block"
      >
        {coverImg ? (
          <img
            src={coverImg as string}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Branded gradient placeholder when no thumbnail exists */
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, #00416d 0%, #003558 50%, #1a0533 100%)",
            }}
          >
            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">
              Rosa Mystica
            </span>
            <span className="text-white/20 text-xs font-medium">Editorial</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </Link>

      {/* Main Content Body */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-contingent/10 text-contingent font-semibold">
              <LuUser className="w-3.5 h-3.5" />
              Editorial
            </span>

            {blog.createdAt && (
              <>
                <span>{"•"}</span>
                <span className="flex items-center gap-1">
                  <LuCalendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDistanceToNow(new Date(blog.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </>
            )}

            <span>{"•"}</span>
            <span className="flex items-center gap-1">
              <LuClock className="w-3.5 h-3.5 text-gray-400" />
              {getReadingTime(blog.body || blog.desc || "")}
            </span>
          </div>

          {/* Title */}
          <Link href={`/blogs/${blogId}`} className="block group/title">
            <h2 className="text-xl md:text-2xl font-bold font-playfair text-gray-900 group-hover/title:text-contingent transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h2>
          </Link>

          {/* Description Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mt-2.5 font-poppins">
            {cleanDesc}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="flex flex-wrap max-sm:hidden items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
          <Link
            href={`/blogs/${blogId}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-contingent hover:text-contingent-2 transition-all group-hover:translate-x-1 cursor-pointer"
          >
            Read Article
            <LuArrowRight className="w-4 h-4" />
          </Link>

          {/* Action Icons Group: Share, Edit, Delete */}
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-contingent bg-gray-50 hover:bg-contingent/10 rounded-lg transition-all border border-gray-200 cursor-pointer"
              title="Share Article Link"
            >
              {copied ? (
                <>
                  <LuCheck className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <LuShare2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {isAdmin && (
              <>
                {/* Edit Button */}
                <Link
                  href={`/blogs/${blogId}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-all border border-blue-100 cursor-pointer"
                  title="Edit Article"
                >
                  <LuPencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                {/* Delete Button */}
                <ThrottledButton
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-500 rounded-lg transition-all border border-red-100"
                  onClick={handleDelete}
                  loadingText="Deleting..."
                  title="Delete Article"
                >
                  <LuTrash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </ThrottledButton>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogsDetails;