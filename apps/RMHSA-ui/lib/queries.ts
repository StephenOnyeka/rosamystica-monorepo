"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { customFetch } from "@/lib/api";
import type { Blog, Notification } from "@/lib/types";

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
  typeof window !== "undefined" ? (localStorage.getItem("token") ?? undefined) : undefined;

// ---- Blogs -----------------------------------------------------------------
interface BlogsResponse {
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

export const useCreateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Blog>) =>
      customFetch<Blog>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(payload),
        token: getToken(),
      }),
    // A new blog also produces a notification on the server.
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blogs });
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

export const useUpdateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Blog> }) =>
      customFetch<Blog>(`/api/blogs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        token: getToken(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.blogs }),
  });
};

export const useDeleteBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customFetch<Blog>(`/api/blogs/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.blogs }),
  });
};

// ---- Notifications ---------------------------------------------------------
interface NotificationsResponse {
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
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customFetch<Notification>(`/api/notifications/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
};
