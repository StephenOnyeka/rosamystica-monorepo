"use client";

// THE UPDATED CODE WITH IMPROVED UI
import { useState, useEffect, type SyntheticEvent } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import { useNotificationsContext } from "@/hooks/useNotificationsContext";
import type { Notification } from "@/lib/types";

import { customFetch } from "@/lib/api";
import { ThrottledButton } from "@/components/ThrottledButton";
import {
  LuPencil,
  LuSend,
  LuEye,
  LuCheck,
  LuBell,
} from "react-icons/lu";
import { NotificationBing } from "iconsax-reactjs";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

interface NotificationFormProps {
  onClose?: () => void;
}

function NotificationForm({ onClose }: NotificationFormProps) {
  const { dispatch } = useNotificationsContext();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleSubmit = async (
    e?: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    e?.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for your notification.");
      return;
    }

    const notificationPayload = {
      title,
      desc,
      body,
      type: "manual",
    };

    try {
      const json = await customFetch<Notification>("/api/notifications", {
        method: "POST",
        body: JSON.stringify(notificationPayload),
        token: token ?? undefined,
      });
      setTitle("");
      setDesc("");
      setBody("");
      setError(null);
      setEmptyFields([]);
      console.log("new notification added", json);
      dispatch({ type: "CREATE_NOTIFICATION", payload: json });
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Failed to create notification");
    }
  };

  const handlePreviewToggle = () => {
    setPreview(!preview);
  };

  const getPreviewText = () => {
    let text = body || desc || "";
    text = text.replace(/<[^>]*>/g, "").trim();
    if (text.length > 100) {
      return text.substring(0, 100) + "...";
    }
    return text;
  };

  return (
    <div className={geist.className}>
      {token && (
        <div>
          {preview ? (
            /* ── Enhanced Notification Preview Mode ── */
            <div className="py-6 px-2 max-w-4xl mx-auto font-poppins">
              {/* Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-contingent/10 text-contingent">
                    <LuEye className="w-3.5 h-3.5" />
                    Live Notification Preview
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    This is how your notification will appear
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
                    loadingText="Publishing..."
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-contingent hover:bg-contingent-2 rounded-lg shadow-sm"
                  >
                    <LuCheck className="w-4 h-4" />
                    Publish Notification
                  </ThrottledButton>
                </div>
              </div>

              {/* Notification Preview Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-start gap-4">
                  {/* Iconsax Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-contingent/10 text-contingent border border-contingent/20 flex items-center justify-center">
                      <NotificationBing size="24" variant="Bold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                      {title || "Untitled Notification"}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1.5">
                      {getPreviewText()}
                    </p>

                    {/* Type badge */}
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Manual Announcement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Editor Form Mode ── */
            <form
              onSubmit={handleSubmit}
              className="w-full pt-2"
            >
              <div className="max-w-2xl mx-auto">
                {/* Form Header */}
                {/* <div className="flex items-center justify-between mb-6"> */}
                  {/* <h2 className="text-xl font-bold text-contingent font-playfair flex items-center gap-2">
                    <LuBell className="w-5 h-5" />
                    Create New Notification
                  </h2> */}
                  {/* <button
                    type="button"
                    onClick={handlePreviewToggle}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                  >
                    <LuEye className="w-4 h-4 text-contingent" />
                    Preview
                  </button> */}
                {/* </div> */}

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full p-4 text-lg font-bold bg-white text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-contingent/40 placeholder:text-gray-400 shadow-sm"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder="Enter notification title..."
                  />
                </div>

                {/* Short Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description (Optional)
                  </label>
                  <input
                    className="w-full p-4 text-base bg-white text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-contingent/40 placeholder:text-gray-400 shadow-sm"
                    type="text"
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                    placeholder="A brief summary of the notification..."
                  />
                </div>

                {/* Content Body */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Content <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    theme="bubble"
                    onChange={setBody}
                    value={body}
                    placeholder="Write the full content of your notification..."
                    className="bg-white rounded-xl"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote", "code-block"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                      ],
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mb-8">
                  <ThrottledButton
                    type="submit"
                    loadingText="Publishing..."
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-contingent hover:bg-contingent-2 rounded-lg shadow-md"
                  >
                    <LuSend className="w-4 h-4" />
                    Publish Notification
                  </ThrottledButton>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                    onClick={handlePreviewToggle}
                  >
                    <LuEye className="w-4 h-4 text-contingent" />
                    Preview Notification
                  </button>
                </div>
              </div>
            </form>
          )}

          {error && (
            <div className="text-red-500 border border-red-500 bg-red-100 p-3 mt-4 rounded-xl text-sm font-medium max-w-2xl mx-auto">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationForm;
