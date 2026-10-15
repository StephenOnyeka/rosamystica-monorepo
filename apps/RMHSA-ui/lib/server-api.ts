import { buildFullUrl } from "./api";
import type { Blog } from "./types";
import type { BlogsResponse } from "./queries";

const METADATA_TIMEOUT_MS = 4000; // Fast 4-second timeout for server metadata

/**
 * Safe server-side fetcher for metadata generation.
 * Never throws — returns null if the backend is slow or unreachable,
 * so Next.js never crashes or freezes during navigation.
 */
export async function getBlogServer(id: string): Promise<Blog | null> {
  try {
    const res = await fetch(buildFullUrl(`/api/blogs/${id}`), {
      signal: AbortSignal.timeout(METADATA_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as Blog;
  } catch {
    return null;
  }
}

export async function getBlogsServer(
  page: number,
  limit: number
): Promise<BlogsResponse | null> {
  try {
    const res = await fetch(
      buildFullUrl(`/api/blogs?page=${page}&limit=${limit}`),
      {
        signal: AbortSignal.timeout(METADATA_TIMEOUT_MS),
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as BlogsResponse;
  } catch {
    return null;
  }
}
