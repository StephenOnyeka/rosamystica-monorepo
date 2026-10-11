"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { customFetch } from "@/lib/api";
import type { Blog, Notification } from "@/lib/types";
import { toastBus } from "@/lib/toast";

// ---- Query keys ------------------------------------------------------------
export const queryKeys = {
  blogs: ["blogs"] as const,
  blogList: (page: number, limit: number) =>
    ["blogs", "list", page, limit] as const,
  blog: (id: string) => ["blogs", "detail", id] as const,
  notifications: ["notifications"] as const,
  notificationList: (page: number, limit: number) =>
    ["notifications", "list", page, limit] as const,
};

const getToken = () =>
  typeof window !== "undefined"
    ? (localStorage.getItem("token") ?? undefined)
    : undefined;

// ---- Blogs -----------------------------------------------------------------
export interface BlogsResponse {
  blogs: Blog[];
  totalPosts: number;
  totalPages: number;
}

export const useBlogs = (page: number, limit: number) =>
  useQuery({
    queryKey: queryKeys.blogList(page, limit),
    queryFn: () =>
      customFetch<BlogsResponse>(`/api/blogs?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  });

export const useBlog = (id: string) =>
  useQuery({
    queryKey: queryKeys.blog(id),
    queryFn: () => customFetch<Blog>(`/api/blogs/${id}`),
  });

// Create blog — optimistic: insert a temp entry, replace with real on success.
export const useCreateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Blog>) =>
      customFetch<Blog>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(payload),
        token: getToken(),
      }),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: queryKeys.blogs });
      const tempId = `temp-${Date.now()}`;
      const tempBlog: Blog = {
        id: tempId,
        title: payload.title ?? "",
        desc: payload.desc ?? "",
        body: payload.body ?? "",
        image: payload.image ?? null,
        coverImage: payload.coverImage ?? null,
        backgroundImage: payload.backgroundImage ?? null,
        createdAt: new Date().toISOString(),
      };
      // Optimistically inject into every cached blog-list page
      qc.setQueriesData<BlogsResponse>(
        { queryKey: queryKeys.blogs },
        (old) =>
          old
            ? { ...old, blogs: [tempBlog, ...old.blogs], totalPosts: old.totalPosts + 1 }
            : old,
      );
      return { tempId };
    },
    onSuccess: (_data, _vars, ctx) => {
      // Remove the temp entry; invalidate so the real one loads cleanly
      qc.setQueriesData<BlogsResponse>(
        { queryKey: queryKeys.blogs },
        (old) =>
          old
            ? { ...old, blogs: old.blogs.filter((b) => b.id !== ctx?.tempId) }
            : old,
      );
      qc.invalidateQueries({ queryKey: queryKeys.blogs });
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
      toastBus.success("Blog post published successfully! 🎉");
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueriesData<BlogsResponse>(
        { queryKey: queryKeys.blogs },
        (old) =>
          old
            ? { ...old, blogs: old.blogs.filter((b) => b.id !== ctx?.tempId) }
            : old,
      );
      toastBus.error("Failed to publish blog post. Please try again.");
    },
  });
};

// Update blog — optimistic: patch in place.
export const useUpdateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Blog> }) =>
      customFetch<Blog>(`/api/blogs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        token: getToken(),
      }),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: queryKeys.blogs });
      const prev = qc.getQueriesData<BlogsResponse>({ queryKey: queryKeys.blogs });
      qc.setQueriesData<BlogsResponse>(
        { queryKey: queryKeys.blogs },
        (old) =>
          old
            ? {
                ...old,
                blogs: old.blogs.map((b) =>
                  (b.id || b._id) === id ? { ...b, ...payload } : b,
                ),
              }
            : old,
      );
      // Also patch the single-blog cache
      qc.setQueryData<Blog>(queryKeys.blog(id), (old) =>
        old ? { ...old, ...payload } : old,
      );
      return { prev };
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.blogs });
      qc.invalidateQueries({ queryKey: queryKeys.blog(id) });
      toastBus.success("Blog post updated successfully!");
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toastBus.error("Failed to update blog post. Please try again.");
    },
  });
};

// Delete blog — optimistic: remove instantly.
export const useDeleteBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customFetch<Blog>(`/api/blogs/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.blogs });
      const prev = qc.getQueriesData<BlogsResponse>({ queryKey: queryKeys.blogs });
      qc.setQueriesData<BlogsResponse>(
        { queryKey: queryKeys.blogs },
        (old) =>
          old
            ? {
                ...old,
                blogs: old.blogs.filter((b) => (b.id || b._id) !== id),
                totalPosts: Math.max(0, old.totalPosts - 1),
              }
            : old,
      );
      return { prev };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blogs });
      toastBus.success("Blog post deleted.");
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toastBus.error("Failed to delete blog post. Please try again.");
    },
  });
};

// ---- Notifications ---------------------------------------------------------
export interface NotificationsResponse {
  notifications: Notification[];
  totalPosts: number;
  totalPages: number;
}

export const useNotifications = (page: number, limit: number) =>
  useQuery({
    queryKey: queryKeys.notificationList(page, limit),
    queryFn: () =>
      customFetch<NotificationsResponse>(
        `/api/notifications?page=${page}&limit=${limit}`,
      ),
    placeholderData: keepPreviousData,
  });

// Save (create or update) notification — optimistic patch/inject.
export const useSaveNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: string;
      payload: Partial<Notification>;
    }) =>
      customFetch<Notification>(
        id ? `/api/notifications/${id}` : "/api/notifications",
        {
          method: id ? "PATCH" : "POST",
          body: JSON.stringify(payload),
          token: getToken(),
        },
      ),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications });
      const prev = qc.getQueriesData<NotificationsResponse>({
        queryKey: queryKeys.notifications,
      });
      const tempId = id ?? `temp-${Date.now()}`;
      if (id) {
        // Update existing
        qc.setQueriesData<NotificationsResponse>(
          { queryKey: queryKeys.notifications },
          (old) =>
            old
              ? {
                  ...old,
                  notifications: old.notifications.map((n) =>
                    (n.id || n._id) === id ? { ...n, ...payload } : n,
                  ),
                }
              : old,
        );
      } else {
        // Inject temp
        const tempNotif: Notification = {
          id: tempId,
          title: payload.title ?? "",
          desc: payload.desc,
          body: payload.body,
          type: payload.type,
          createdAt: new Date().toISOString(),
        };
        qc.setQueriesData<NotificationsResponse>(
          { queryKey: queryKeys.notifications },
          (old) =>
            old
              ? {
                  ...old,
                  notifications: [tempNotif, ...old.notifications],
                  totalPosts: old.totalPosts + 1,
                }
              : old,
        );
      }
      return { prev, tempId };
    },
    onSuccess: (_data, { id }, ctx) => {
      if (!id) {
        // Remove temp entry; real one will load on invalidate
        qc.setQueriesData<NotificationsResponse>(
          { queryKey: queryKeys.notifications },
          (old) =>
            old
              ? {
                  ...old,
                  notifications: old.notifications.filter(
                    (n) => n.id !== ctx?.tempId,
                  ),
                }
              : old,
        );
      }
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
      toastBus.success(
        id ? "Announcement updated successfully!" : "Announcement published! 📢",
      );
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toastBus.error("Failed to save announcement. Please try again.");
    },
  });
};

// Delete notification — optimistic remove.
export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customFetch<Notification>(`/api/notifications/${id}`, {
        method: "DELETE",
      }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications });
      const prev = qc.getQueriesData<NotificationsResponse>({
        queryKey: queryKeys.notifications,
      });
      qc.setQueriesData<NotificationsResponse>(
        { queryKey: queryKeys.notifications },
        (old) =>
          old
            ? {
                ...old,
                notifications: old.notifications.filter(
                  (n) => (n.id || n._id) !== id,
                ),
                totalPosts: Math.max(0, old.totalPosts - 1),
              }
            : old,
      );
      return { prev };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
      toastBus.success("Notification deleted.");
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toastBus.error("Failed to delete notification. Please try again.");
    },
  });
};
