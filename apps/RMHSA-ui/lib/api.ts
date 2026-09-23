export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export interface CustomFetchOptions extends RequestInit {
  skipCache?: boolean;
  ttl?: number; // Time to live in milliseconds (default 5 mins)
  token?: string;
}

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

const DEFAULT_BASE_URL = "http://localhost:8080";
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

// Global in-memory cache store
const cache = new Map<string, CacheItem>();

export function getBaseApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE_URL;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function buildFullUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${getBaseApiUrl()}${cleanEndpoint}`;
}

export function getCache<T = any>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  const isExpired = Date.now() - item.timestamp > item.ttl;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCache<T = any>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function clearCache(endpointPattern?: string): void {
  if (!endpointPattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(endpointPattern)) {
      cache.delete(key);
    }
  }
}

/**
 * Fast custom fetch utility with in-memory caching and automatic auth header insertion.
 */
export async function customFetch<T = any>(
  endpoint: string,
  options: CustomFetchOptions = {}
): Promise<T> {
  const {
    skipCache = false,
    ttl = DEFAULT_TTL,
    token,
    headers: customHeaders,
    method = "GET",
    body,
    ...restOptions
  } = options;

  const fullUrl = buildFullUrl(endpoint);
  const uppercaseMethod = method.toUpperCase();

  // For GET requests, check cache first if not skipping
  if (uppercaseMethod === "GET" && !skipCache) {
    const cachedData = getCache<T>(fullUrl);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // Construct request headers
  const headers = new Headers(customHeaders);

  if (
    body &&
    typeof body === "string" &&
    !headers.has("Content-Type") &&
    !headers.has("content-type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token from localStorage if client-side and token present
  const authToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null);

  if (authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const fetchOptions: RequestInit = {
    method: uppercaseMethod,
    headers,
    body,
    ...restOptions,
  };

  const response = await fetch(fullUrl, fetchOptions);

  let responseData: any;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMsg =
      typeof responseData === "object" && responseData?.error
        ? responseData.error
        : typeof responseData === "object" && responseData?.message
        ? responseData.message
        : response.statusText || "An API error occurred";

    const error: ApiError = new Error(errorMsg);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  // Cache GET response
  if (uppercaseMethod === "GET" && !skipCache) {
    setCache(fullUrl, responseData, ttl);
  }

  // Invalidate relevant cache on mutation methods (POST, PUT, DELETE, PATCH)
  if (["POST", "PUT", "DELETE", "PATCH"].includes(uppercaseMethod)) {
    if (endpoint.includes("/blogs")) {
      clearCache("/blogs");
    } else if (endpoint.includes("/notifications")) {
      clearCache("/notifications");
    } else if (endpoint.includes("/subscriptions")) {
      clearCache("/subscriptions");
    }
  }

  return responseData as T;
}
