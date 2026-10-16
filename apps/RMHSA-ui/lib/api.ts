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
  isOffline?: boolean; // Browser could not reach the network at all
  isTimeout?: boolean; // Request exceeded the timeout window
}

export interface CustomFetchOptions extends RequestInit {
  skipCache?: boolean;
  ttl?: number; // Cache time-to-live in milliseconds (default: 5 mins)
  token?: string; // Explicit auth token override
  skipDeduplication?: boolean; // Bypass in-flight & cooldown deduplication
  dedupWindowMs?: number; // Cooldown window for identical mutations (default: 800ms)
  timeoutMs?: number; // Abort the request after this many ms (default: 15s)
}

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ---- Constants --------------------------------------------------------------

const DEFAULT_BASE_URL = "https://rosamystica-monorepo.onrender.com";
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_DEDUP_WINDOW_MS = 800; // 800 milliseconds
const DEFAULT_TIMEOUT_MS = 15_000; // 15 seconds

// ---- In-Memory Storage -----------------------------------------------------

const cache = new Map<string, CacheItem>();
const inFlightRequests = new Map<string, Promise<any>>();
const recentMutations = new Map<string, { data: any; timestamp: number }>();

// ---- URL Helpers -----------------------------------------------------------

export function getBaseApiUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    DEFAULT_BASE_URL;
  return url ? url.replace(/\/+$/, "") : "";
}

export function buildFullUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const base = getBaseApiUrl();
  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
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
    timeoutMs = DEFAULT_TIMEOUT_MS,
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

  // 4. Execution pipeline with timeout + lifecycle cleanup
  const execute = async (): Promise<T> => {
    // Respect a caller-supplied signal; otherwise enforce our own timeout.
    const controller = restOptions.signal ? null : new AbortController();
    const timer = controller
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        ...(controller ? { signal: controller.signal } : {}),
      });
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
    } catch (err) {
      throw normalizeNetworkError(err, controller?.signal.aborted ?? false);
    } finally {
      if (timer) clearTimeout(timer);
      inFlightRequests.delete(requestKey);
    }
  };

  const promise = execute();

  if (!skipDeduplication) {
    inFlightRequests.set(requestKey, promise);
  }

  return await promise;
}

// ---- Error Normalization & Helpers ------------------------------------------

/**
 * Converts low-level fetch failures (TypeError: Failed to fetch, AbortError)
 * into typed ApiErrors. HTTP errors already carry a status and pass through.
 */
function normalizeNetworkError(err: unknown, timedOut: boolean): unknown {
  if (!(err instanceof Error)) return err;
  if ((err as ApiError).status !== undefined) return err; // Real HTTP error

  if (timedOut || err.name === "AbortError" || err.name === "TimeoutError") {
    const e: ApiError = new Error("The request took too long to respond.");
    e.isTimeout = true;
    return e;
  }

  if (err instanceof TypeError) {
    const e: ApiError = new Error("Unable to reach the server.");
    e.isOffline = true;
    return e;
  }

  return err;
}

/** True when the failure is a connectivity problem (no network / unreachable). */
export function isOfflineError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  if ((err as ApiError).isOffline) return true;
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/** True when the request was aborted for taking too long. */
export function isTimeoutError(err: unknown): boolean {
  return !!err && typeof err === "object" && !!(err as ApiError).isTimeout;
}

export function getErrorStatus(err: unknown): number | undefined {
  return err && typeof err === "object"
    ? (err as ApiError).status
    : undefined;
}

/**
 * Returns a short, human-friendly message that never leaks technical details
 * such as "Failed to fetch" or stack traces to visitors.
 */
export function getFriendlyErrorMessage(err: unknown): string {
  if (isOfflineError(err)) {
    return "You appear to be offline. Please check your internet connection.";
  }
  if (isTimeoutError(err)) {
    return "This is taking longer than usual. Your connection may be slow.";
  }
  const status = getErrorStatus(err);
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status && status >= 500) {
    return "Something went wrong on our side. Please try again shortly.";
  }
  return "We couldn't load this content right now. Please try again.";
}
