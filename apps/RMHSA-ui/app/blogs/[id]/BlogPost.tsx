"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import type { Blog } from "@/lib/types";
import { customFetch } from "@/lib/api";
import {
  LuUser,
  LuCalendar,
  LuClock,
  LuArrowLeft,
  LuTrash2,
} from "react-icons/lu";
import { ArrowLeft2 } from "iconsax-reactjs";
import Topfile from "@/components/Topfile";
import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import { useAdminContext } from "@/hooks/useAdminContext";
import { useBlogsContext } from "@/hooks/useBlogsContext";

// Import Tiptap ProseMirror node styles to guarantee exact spacing, images, lists, and formatting as in the editor
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

export default function BlogPost({ id }: { id: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAdminContext();
  const { dispatch } = useBlogsContext();
  const router = useRouter();

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

  const handleDelete = async () => {
    if (
      !blog ||
      !window.confirm("Are you sure you want to delete this blog post?")
    )
      return;
    const blogId = blog.id || blog._id || id;
    try {
      const json = await customFetch<Blog>(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
      dispatch({ type: "DELETE_BLOG", payload: json });
      router.push("/blogs");
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const getReadingTime = (content: string) => {
    const text = content ? content.replace(/<[^>]*>/g, " ").trim() : "";
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (loading) return <Loading />;

  // Resolve cover image from any field the backend may return
  const coverImg =
    blog?.image || (blog as any)?.coverImage || (blog as any)?.titleImg;

  return (
    <div>
      <Topfile />
      <ScrollDiv />

      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />

        <div className="max-w-5xl mx-auto font-poppins">
          {/* Header Navigation Bar */}
          <div className="flex items-center justify-between gap-x-4 mb-6">
            <div className="flex items-center gap-x-4">
              <Link
                href="/blogs"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-contingent/10 hover:bg-contingent/20 text-contingent transition-colors duration-200"
                aria-label="Back to blogs"
              >
                <ArrowLeft2 size={20} color="#00416d" variant="Bold" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-contingent font-playfair">
                  Article Details
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  Published by Rosa Mystica Editorial
                </p>
              </div>
            </div>

            {isAdmin && blog && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <LuTrash2 className="w-4 h-4" />
                Delete Article
              </button>
            )}
          </div>

          {error ? (
            <div className="py-12 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm my-8">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <LuArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Link>
            </div>
          ) : !blog ? null : (
            /* Article card mirrors BlogForm preview mode exactly */
            <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">

              {/* Cover / Background Image Banner — render only if coverImg exists */}
              {coverImg && (
                <div className="w-full h-72 md:h-96 relative bg-gray-900">
                  <img
                    src={coverImg}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-12">
                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                  <span className="flex items-center gap-1 text-contingent font-semibold">
                    <LuUser className="w-3.5 h-3.5" />
                    Rosa Mystica Editorial
                  </span>
                  {blog.createdAt && (
                    <>
                      <span>{"•"}</span>
                      <span className="flex items-center gap-1">
                        <LuCalendar className="w-3.5 h-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="text-gray-400 font-normal ml-1">
                          {"("}
                          {formatDistanceToNow(new Date(blog.createdAt), {
                            addSuffix: true,
                          })}
                          {")"}
                        </span>
                      </span>
                    </>
                  )}
                  <span>{"•"}</span>
                  <span className="flex items-center gap-1">
                    <LuClock className="w-3.5 h-3.5" />
                    {getReadingTime(blog.body || "")}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-playfair">
                  {blog.title}
                </h1>

                <hr className="border-gray-200 mb-8" />

                {/* Body — Tiptap ProseMirror styling with exact editor node stylesheets loaded */}
                <div className="tiptap ProseMirror simple-editor text-gray-900 leading-relaxed font-poppins [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(blog.body, {
                        ADD_ATTR: [
                          "target",
                          "data-type",
                          "checked",
                          "style",
                          "class",
                        ],
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Card footer — matches BlogForm preview footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/blogs"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-contingent transition-colors cursor-pointer"
                >
                  <LuArrowLeft className="w-4 h-4" />
                  Back to All Articles
                </Link>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <LuTrash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}