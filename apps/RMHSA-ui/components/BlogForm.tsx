"use client";

import { useState, useEffect, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import type { Blog } from "@/lib/types";
import { Geist } from "next/font/google";
import { customFetch } from "@/lib/api";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";
import { ThrottledButton } from "@/components/ThrottledButton";
import {
  LuImagePlus,
  LuImage,
  LuTrash2,
  LuPencil,
  LuSend,
  LuClock,
  LuCalendar,
  LuUser,
  LuEye,
  LuArrowLeft,
  LuCheck,
} from "react-icons/lu";

const geist = Geist({
  subsets: ["latin"],
});

interface BlogFormProps {
  /** If editing an existing blog, pass initial data */
  initialData?: Blog | null;
  /** If provided, router.push(redirectAfterSubmit) is called on success */
  redirectAfterSubmit?: string;
  /** Custom button submit text */
  submitLabel?: string;
}

function BlogForm({
  initialData,
  redirectAfterSubmit,
  submitLabel,
}: BlogFormProps = {}) {
  const isEditing = Boolean(initialData && (initialData.id || initialData._id));
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    (initialData?.backgroundImage ||
      initialData?.coverImage ||
      initialData?.image) as string | null
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setBody(initialData.body ?? "");
      setCoverImage(
        (initialData.backgroundImage ||
          initialData.coverImage ||
          initialData.image) as string | null
      );
    }
  }, [initialData]);

  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [token] = useState<string | null>(() => localStorage.getItem("token"));
  const { dispatch } = useBlogsContext();
  const router = useRouter();

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getReadingTime = () => {
    const text = body.replace(/<[^>]*>/g, " ").trim();
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleSubmit = async (
    e?: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for your blog post.");
      return;
    }

    const blogPayload = {
      title,
      desc: title,
      body,
      image: coverImage,
      coverImage: coverImage,
      backgroundImage: coverImage,
    };

    if (isEditing && initialData) {
      const targetId = initialData.id || initialData._id || "";
      const updatedOptimistic: Blog = {
        ...initialData,
        ...blogPayload,
      };

      // 1. Optimistic UI update for Edit
      dispatch({ type: "UPDATE_BLOG", payload: updatedOptimistic });
      setError(null);

      if (redirectAfterSubmit) {
        router.push(redirectAfterSubmit);
      }

      try {
        const json = await customFetch<Blog>(`/api/blogs/${targetId}`, {
          method: "PATCH",
          body: JSON.stringify(blogPayload),
          token: token ?? undefined,
        });
        dispatch({ type: "UPDATE_BLOG", payload: json });
      } catch (err: unknown) {
        // Rollback edit on error
        dispatch({ type: "UPDATE_BLOG", payload: initialData });
        setError(
          err instanceof Error ? err.message : "Failed to update blog post"
        );
      }
    } else {
      // Creation flow
      const tempId = `temp-${Date.now()}`;
      const optimisticBlog: Blog = {
        id: tempId,
        _id: tempId,
        ...blogPayload,
        createdAt: new Date().toISOString(),
      };

      // 1. Optimistic UI add
      dispatch({ type: "CREATE_BLOG", payload: optimisticBlog });

      setTitle("");
      setBody("");
      setCoverImage(null);
      setError(null);

      if (redirectAfterSubmit) {
        router.push(redirectAfterSubmit);
      }

      try {
        const json = await customFetch<Blog>("/api/blogs", {
          method: "POST",
          body: JSON.stringify(blogPayload),
          token: token ?? undefined,
        });
        dispatch({ type: "DELETE_BLOG", payload: optimisticBlog });
        dispatch({ type: "CREATE_BLOG", payload: json });
      } catch (err: unknown) {
        dispatch({ type: "DELETE_BLOG", payload: optimisticBlog });
        setError(
          err instanceof Error ? err.message : "Failed to create blog post"
        );
      }
    }
  };

  const handlePreviewToggle = () => setPreview((p) => !p);

  const defaultSubmitText = isEditing ? "Save Changes" : "Publish Post";
  const actionButtonText = submitLabel || defaultSubmitText;

  return (
    <div className={geist.className}>
      {token && (
        <div>
          {preview ? (
            /* ── Enhanced Blog Preview Mode ── */
            <div className="py-6 px-2 max-w-5xl mx-auto font-poppins">
              {/* Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-contingent/10 text-contingent">
                    <LuEye className="w-3.5 h-3.5" />
                    Live Article Preview
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    This is how your article will look when published
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePreviewToggle}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <LuPencil className="w-4 h-4" />
                    Back to Edit
                  </button>
                  <ThrottledButton
                    type="button"
                    onClick={handleSubmit}
                    loadingText="Saving..."
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-contingent hover:bg-contingent-2 rounded-lg shadow-sm"
                  >
                    <LuCheck className="w-4 h-4" />
                    {actionButtonText}
                  </ThrottledButton>
                </div>
              </div>

              {/* Article View Card */}
              <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Cover Header Banner */}
                {coverImage && (
                  <div className="w-full h-72 md:h-96 relative bg-gray-900">
                    <img
                      src={coverImage}
                      alt={title || "Blog Cover"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                )}

                <div className="p-6 md:p-12">
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                    <span className="flex items-center gap-1 text-contingent font-semibold">
                      <LuUser className="w-3.5 h-3.5" />
                      Rosa Mystica Editorial
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <LuCalendar className="w-3.5 h-3.5" />
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <LuClock className="w-3.5 h-3.5" />
                      {getReadingTime()}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-playfair">
                    {title || "Untitled Blog Post"}
                  </h1>

                  <hr className="border-gray-200 mb-8" />

                  {/* Body HTML Content with Tiptap ProseMirror styling */}
                  <div className="tiptap ProseMirror simple-editor text-gray-900 leading-relaxed font-poppins [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          body ||
                          "<p className='text-gray-400 italic'>No body content entered yet...</p>",
                      }}
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePreviewToggle}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <LuArrowLeft className="w-4 h-4" />
                    Continue Editing
                  </button>
                  <ThrottledButton
                    type="button"
                    onClick={handleSubmit}
                    loadingText="Saving..."
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-contingent hover:bg-contingent-2 rounded-lg shadow-md"
                  >
                    <LuSend className="w-4 h-4" />
                    {actionButtonText}
                  </ThrottledButton>
                </div>
              </article>
            </div>
          ) : (
            /* ── Editor Form Mode ── */
            <form
              onSubmit={handleSubmit}
              className={`w-full pt-0 ${geist.className}`}
            >
              <div className="max-w-5xl mx-auto">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-contingent font-playfair">
                    {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                  </h2>
                  <button
                    type="button"
                    onClick={handlePreviewToggle}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                  >
                    <LuEye className="w-4 h-4 text-contingent" />
                    Preview Post
                  </button>
                </div>

                {/* Cover / Background Image Upload Zone */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover / Header Background Image
                  </label>
                  {coverImage ? (
                    <div className="relative group w-full h-64 md:h-72 rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-900">
                      <img
                        src={coverImage}
                        alt="Cover background preview"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <label className="bg-white/90 hover:bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-md transition-all flex items-center gap-2">
                          <LuImage className="w-4 h-4 text-contingent" />
                          Change Cover Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setCoverImage(null)}
                          className="bg-red-500/90 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <LuTrash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="group relative flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50/80 hover:border-contingent transition-all cursor-pointer p-6 text-center shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-contingent/10 text-contingent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <LuImagePlus className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-contingent transition-colors">
                        Upload Cover / Background Image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Click to select a header background image (JPEG, PNG, WEBP)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Blog Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blog Title
                  </label>
                  <input
                    className="w-full p-4 text-2xl font-bold bg-white text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-contingent/40 placeholder:text-gray-400 shadow-sm"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder="Enter post title..."
                  />
                </div>

                {/* Content Editor */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content Body
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <SimpleEditor content={body} onUpdate={setBody} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mb-8">
                  <ThrottledButton
                    type="submit"
                    loadingText="Saving..."
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-contingent hover:bg-contingent-2 rounded-lg shadow-md"
                  >
                    <LuSend className="w-4 h-4" />
                    {actionButtonText}
                  </ThrottledButton>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                    onClick={handlePreviewToggle}
                  >
                    <LuEye className="w-4 h-4 text-contingent" />
                    Preview Post
                  </button>
                </div>
              </div>
            </form>
          )}

          {error && (
            <div className="text-red-500 border border-red-500 bg-red-100 p-3 mt-4 rounded-xl text-sm font-medium max-w-5xl mx-auto">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogForm;