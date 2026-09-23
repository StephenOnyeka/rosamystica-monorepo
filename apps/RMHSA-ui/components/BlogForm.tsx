"use client";

import { useState, useCallback, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useBlogsContext } from "@/hooks/useBlogsContext";
import type { Blog } from "@/lib/types";
import { Geist } from "next/font/google";
import { customFetch } from "@/lib/api";

const geist = Geist({
  subsets: ["latin"],
});

interface BlogFormProps {
  /** If provided, router.push(redirectAfterSubmit) is called on success */
  redirectAfterSubmit?: string;
}

// ─── Toolbar Button ────────────────────────────────────────────────────────────
interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded transition-colors duration-150 ${
        active
          ? "bg-contingent text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

// ─── Tiptap Toolbar ────────────────────────────────────────────────────────────
function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50 rounded-t-xl">
      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <span className="w-px bg-gray-300 mx-1" />

      {/* Inline marks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline Code"
      >
        {"</>"}
      </ToolbarButton>

      <span className="w-px bg-gray-300 mx-1" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        1. List
      </ToolbarButton>

      <span className="w-px bg-gray-300 mx-1" />

      {/* Blocks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        ❝
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code Block"
      >
        {"{ }"}
      </ToolbarButton>

      <span className="w-px bg-gray-300 mx-1" />

      {/* History */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        ↩
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        ↪
      </ToolbarButton>
    </div>
  );
}

// ─── BlogForm ──────────────────────────────────────────────────────────────────
function BlogForm({ redirectAfterSubmit }: BlogFormProps = {}) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [token] = useState<string | null>(() => localStorage.getItem("token"));
  const { dispatch } = useBlogsContext();
  const router = useRouter();

  const editor = useEditor({
    // Required for Next.js: prevents SSR hydration mismatch errors
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What\u2019s on your mind\u2026",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[60vh] p-4 focus:outline-none",
      },
    },
  });

  const getBody = useCallback(() => editor?.getHTML() ?? "", [editor]);

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const body = getBody();
    const blog = { title, body };
    try {
      const json = await customFetch<Blog>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(blog),
        token: token ?? undefined,
      });
      setTitle("");
      editor?.commands.clearContent();
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
                dangerouslySetInnerHTML={{ __html: getBody() }}
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

                {/* Tiptap editor */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-6">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} />
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
