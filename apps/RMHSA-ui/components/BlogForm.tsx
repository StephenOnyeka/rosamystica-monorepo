"use client";

import { useState, type SyntheticEvent } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import type { Blog } from "@/lib/types";

import { customFetch } from "@/lib/api";

function BlogForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [preview, setPreview] = useState(false); // State for preview
  const [token] = useState<string | null>(() => localStorage.getItem("token"));
  const { dispatch } = useBlogsContext();

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const blog = { title, desc, body };
    try {
      const json = await customFetch<Blog>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(blog),
        token: token ?? undefined,
      });
      setTitle("");
      setDesc("");
      setBody("");
      setError(null);
      setEmptyFields([]);
      console.log("new blog added", json);
      dispatch({ type: "CREATE_BLOG", payload: json });
    } catch (err: any) {
      setError(err.message || "Failed to create blog");
    }
  };

  const handlePreviewToggle = () => {
    setPreview(!preview);
  };

  return (
    <div>
      {token && (
        <div>
          {preview ? (
            <div className="preview-container">
              <h3 className="text-2xl font-semibold mb-4">Preview</h3>
              <h4 className="text-xl font-bold">{title}</h4>
              <p className="font-bold">Desc: {desc}</p>
              <div
                className="font-normal"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <div className="flex gap-x-8">
                <button
                  className="bg-blue-500 mt-4 px-6 py-2 mb-8 text-white"
                  onClick={handlePreviewToggle}
                >
                  Edit
                </button>
                <button
                  className="bg-green-700 mt-4 px-6 py-2 mb-8 text-white"
                  onClick={handleSubmit}
                >
                  Publish Blog
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-sm:hidden w-full full pt-8"
            >
              <h3 className="text-2xl font-semibold mb-8">Add a New Blog</h3>
              <div className="w-full content-center">
                <div>
                  <label>Blog Title:</label>
                  <br />
                  <input
                    className={`bg-gray-200 p-2 mb-4 mt-2 w-full ${
                      emptyFields.includes("title") ? "error" : ""
                    }`}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </div>
                <div>
                  <label>Desc:</label>
                  <br />
                  <input
                    className={`bg-gray-200 p-2 mb-4 mt-2 w-full ${
                      emptyFields.includes("desc") ? "error" : ""
                    }`}
                    type="text"
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                  />
                </div>
                <div>
                  <label>Body:</label>
                  <br />
                  <ReactQuill
                    theme="bubble"
                    onChange={setBody}
                    value={body}
                    placeholder="What's on your mind..."
                    className={`p-2 mb-4 mt-2 h-[700px] max-w-2xl bg-gray-200 rounded-xl ${
                      emptyFields.includes("body") ? "error" : ""
                    }`}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["image", "video", "code-block", "blockquote", "link"],
                        [{ list: "ordered" }, { list: "bullet" }],
                      ],
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="bg-blue-500 mt-8 px-6 py-2 mb-8 text-white"
                onClick={handlePreviewToggle}
              >
                Preview
              </button>
            </form>
          )}
          {error && (
            <div className="text-red-500 border border-red-500 bg-red-100 p-2 mt-4">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogForm;
