/**
 * API Client & Network Utilities
 *
 * Provides:
 * - URL building & base endpoint resolution
 * - Fast in-memory SWR caching for GET requests
 * - In-flight request deduplication & mutation cooldown
 * - Automatic Authorization token injection
 * - Unified ApiError handling
 */

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export interface CustomFetchOptions extends RequestInit {
  skipCache?: boolean;
  ttl?: number; // Cache time-to-live in milliseconds (default: 5 mins)
  token?: string; // Explicit auth token override
  skipDeduplication?: boolean; // Bypass in-flight & cooldown deduplication
  dedupWindowMs?: number; // Cooldown window for identical mutations (default: 800ms)
}

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ---- Constants --------------------------------------------------------------

const DEFAULT_BASE_URL = "http://localhost:8080";
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_DEDUP_WINDOW_MS = 800; // 800 milliseconds

// ---- In-Memory Storage -----------------------------------------------------

const cache = new Map<string, CacheItem>();
const inFlightRequests = new Map<string, Promise<any>>();
const recentMutations = new Map<string, { data: any; timestamp: number }>();

// ---- URL Helpers -----------------------------------------------------------

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

// ---- Cache Helpers ---------------------------------------------------------

export function getCache<T = any>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() - item.timestamp > item.ttl) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCache<T = any>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL_MS
): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
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

export function clearInFlightRequests(): void {
  inFlightRequests.clear();
  recentMutations.clear();
}

// ---- Deduplication Helpers -------------------------------------------------

function getRequestKey(method: string, url: string, body?: any): string {
  let bodyKey = "";
  if (body) {
    if (typeof body === "string") {
      bodyKey = body;
    } else if (typeof FormData !== "undefined" && body instanceof FormData) {
      bodyKey = "[FormData]";
    } else {
      try {
        bodyKey = JSON.stringify(body);
      } catch {
        bodyKey = String(body);
      }
    }
  }
  return `${method}:${url}:${bodyKey}`;
}

function getDeduplicated<T>(
  requestKey: string,
  method: string,
  dedupWindowMs: number = DEFAULT_DEDUP_WINDOW_MS
): Promise<T> | T | null {
  // 1. If an identical request is actively in-flight, reuse its ongoing promise
  const inFlight = inFlightRequests.get(requestKey);
  if (inFlight) return inFlight as Promise<T>;

  // 2. If an identical mutation recently succeeded within the cooldown window, return cached data
  if (method !== "GET") {
    const recent = recentMutations.get(requestKey);
    if (recent && Date.now() - recent.timestamp < dedupWindowMs) {
      return recent.data as T;
    }
  }

  return null;
}

function recordRecentMutation(
  requestKey: string,
  data: any,
  dedupWindowMs: number = DEFAULT_DEDUP_WINDOW_MS
): void {
  recentMutations.set(requestKey, { data, timestamp: Date.now() });
  setTimeout(() => {
    recentMutations.delete(requestKey);
  }, dedupWindowMs);
}

// ---- Network & Header Helpers ----------------------------------------------

function buildHeaders(
  customHeaders?: HeadersInit,
  body?: any,
  tokenOverride?: string
): Headers {
  const headers = new Headers(customHeaders);

  if (
    body &&
    typeof body === "string" &&
    !headers.has("Content-Type") &&
    !headers.has("content-type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (tokenOverride && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${tokenOverride}`);
  }

  return headers;
}

async function parseResponsePayload(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}

function handleResponseError(response: Response, data: any): never {
  const message =
    (typeof data === "object" && (data?.error || data?.message)) ||
    response.statusText ||
    "An API error occurred";

  const error: ApiError = new Error(message);
  error.status = response.status;
  error.data = data;
  throw error;
}

function invalidateCachesForMutation(endpoint: string): void {
  const targets = ["/blogs", "/notifications", "/subscriptions"];
  for (const target of targets) {
    if (endpoint.includes(target)) {
      clearCache(target);
    }
  }
}

// ---- Main Fetch Function ---------------------------------------------------

/**
 * Fast custom fetch utility with in-memory caching, in-flight request deduplication,
 * and automatic auth header insertion.
 */
export async function customFetch<T = any>(
  endpoint: string,
  options: CustomFetchOptions = {}
): Promise<T> {
  const {
    skipCache = false,
    ttl = DEFAULT_TTL_MS,
    token,
    headers: customHeaders,
    method = "GET",
    body,
    skipDeduplication = false,
    dedupWindowMs = DEFAULT_DEDUP_WINDOW_MS,
    ...restOptions
  } = options;

  const fullUrl = buildFullUrl(endpoint);
  const uppercaseMethod = method.toUpperCase();
  const requestKey = getRequestKey(uppercaseMethod, fullUrl, body);

  // 1. Check in-flight or recent mutation deduplication
  if (!skipDeduplication) {
    const deduplicated = getDeduplicated<T>(
      requestKey,
      uppercaseMethod,
      dedupWindowMs
    );
    if (deduplicated !== null) {
      return deduplicated;
    }
  }

  // 2. Check GET in-memory cache
  if (uppercaseMethod === "GET" && !skipCache) {
    const cachedData = getCache<T>(fullUrl);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // 3. Prepare request options (credentials: "include" sends httpOnly cookies)
  const fetchOptions: RequestInit = {
    method: uppercaseMethod,
    headers: buildHeaders(customHeaders, body, token),
    body,
    credentials: "include",
    ...restOptions,
  };

  // 4. Execution pipeline with lifecycle cleanup
  const execute = async (): Promise<T> => {
    try {
      const response = await fetch(fullUrl, fetchOptions);
      const data = await parseResponsePayload(response);

      if (!response.ok) {
        handleResponseError(response, data);
      }

      if (uppercaseMethod === "GET" && !skipCache) {
        setCache(fullUrl, data, ttl);
      } else if (["POST", "PUT", "DELETE", "PATCH"].includes(uppercaseMethod)) {
        invalidateCachesForMutation(endpoint);

        if (!skipDeduplication) {
          recordRecentMutation(requestKey, data, dedupWindowMs);
        }
      }

      return data as T;
    } finally {
      inFlightRequests.delete(requestKey);
    }
  };

  const promise = execute();

  if (!skipDeduplication) {
    inFlightRequests.set(requestKey, promise);
  }

  return await promise;
}
