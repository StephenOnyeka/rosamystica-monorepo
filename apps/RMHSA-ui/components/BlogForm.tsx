"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import type { Blog } from "@/lib/types";
import { Geist } from "next/font/google";
import { customFetch } from "@/lib/api";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";

const geist = Geist({
  subsets: ["latin"],
});

interface BlogFormProps {
  /** If provided, router.push(redirectAfterSubmit) is called on success */
  redirectAfterSubmit?: string;
}

function BlogForm({ redirectAfterSubmit }: BlogFormProps = {}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [token] = useState<string | null>(() => localStorage.getItem("token"));
  const { dispatch } = useBlogsContext();
  const router = useRouter();

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const blog = { title, body };
    try {
      const json = await customFetch<Blog>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(blog),
        token: token ?? undefined,
      });
      setTitle("");
      setBody("");
      setError(null);
      console.log("new blog added", json);
      dispatch({ type: "CREATE_BLOG", payload: json });
      if (redirectAfterSubmit) {
        router.push(redirectAfterSubmit);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create blog",
      );
    }
  };

  const handlePreviewToggle = () => setPreview((p) => !p);

  return (
    <div className={geist.className}>
      {token && (
        <div>
          {preview ? (
            /* ── Preview pane ── */
            <div className="preview-container">
              <h3 className="text-2xl font-semibold mb-4">Preview</h3>
              <h4 className="text-xl font-bold mb-2">{title}</h4>
              <div
                className="prose prose-sm max-w-none font-normal"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <div className="flex gap-x-8 mt-6">
                <button
                  type="button"
                  className="bg-blue-500 px-6 py-2 text-white rounded-sm hover:bg-blue-600 transition-colors"
                  onClick={handlePreviewToggle}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="bg-green-700 px-6 py-2 text-white rounded-sm hover:bg-green-800 transition-colors"
                  onClick={handleSubmit}
                >
                  Publish Blog
                </button>
              </div>
            </div>
          ) : (
            /* ── Editor form ── */
            <form
              onSubmit={handleSubmit}
              className={`w-full pt-8 ${geist.className}`}
            >
              <div className="max-w-5xl mx-auto">
                {/* Title */}
                <input
                  className="bg-gray-100 p-3 mb-6 w-full text-xl placeholder:text-2xl rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-contingent/40"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  placeholder="Blog Title"
                />

                {/* Tiptap SimpleEditor Template */}
                <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <SimpleEditor content={body} onUpdate={setBody} />
                </div>

                <button
                  type="button"
                  className="bg-blue-500 px-6 py-2 mb-8 text-white rounded-sm hover:bg-blue-600 transition-colors"
                  onClick={handlePreviewToggle}
                >
                  Preview
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="text-red-500 border border-red-500 bg-red-100 p-2 mt-4 rounded">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogForm;
