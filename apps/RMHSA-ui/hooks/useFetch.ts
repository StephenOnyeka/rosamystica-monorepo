"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  customFetch,
  getCache,
  buildFullUrl,
  clearCache,
  type CustomFetchOptions,
  type ApiError,
} from "../lib/api";

export interface UseFetchOptions extends CustomFetchOptions {
  enabled?: boolean;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (overrideOptions?: CustomFetchOptions) => Promise<T | null>;
  isRevalidating: boolean;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Custom React hook for declarative data fetching with Stale-While-Revalidate (SWR) caching.
 */
export function useFetch<T = any>(
  endpoint: string | null,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { enabled = true, skipCache } = options;

  const [data, setData] = useState<T | null>(() => {
    if (!endpoint || !enabled) return null;
    const fullUrl = buildFullUrl(endpoint);
    return skipCache ? null : getCache<T>(fullUrl);
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!endpoint || !enabled) return false;
    const fullUrl = buildFullUrl(endpoint);
    const cached = skipCache ? null : getCache<T>(fullUrl);
    return cached === null;
  });

  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [prevEndpoint, setPrevEndpoint] = useState<string | null>(endpoint);
  const [prevSkipCache, setPrevSkipCache] = useState<boolean | undefined>(skipCache);

  if (endpoint !== prevEndpoint || skipCache !== prevSkipCache) {
    setPrevEndpoint(endpoint);
    setPrevSkipCache(skipCache);

    if (!endpoint || !enabled) {
      setData(null);
      setLoading(false);
    } else {
      const fullUrl = buildFullUrl(endpoint);
      const cached = skipCache ? null : getCache<T>(fullUrl);
      setData(cached);
      setLoading(cached === null);
    }
  }

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const fetchData = useCallback(
    async (overrideOptions?: CustomFetchOptions): Promise<T | null> => {
      if (!endpoint) return null;

      const mergedOptions = { ...optionsRef.current, ...overrideOptions };
      const fullUrl = buildFullUrl(endpoint);
      const cachedData = mergedOptions.skipCache ? null : getCache<T>(fullUrl);

      if (cachedData !== null) {
        setData(cachedData);
        setLoading(false);
        setIsRevalidating(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const result = await customFetch<T>(endpoint, mergedOptions);
        setData(result);
        return result;
      } catch (err) {
        const message = (err as ApiError).message || "Failed to fetch data";
        setError(message);
        return null;
      } finally {
        setLoading(false);
        setIsRevalidating(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    if (!enabled || !endpoint) {
      return;
    }

    let active = true;
    const currentOptions = optionsRef.current;

    customFetch<T>(endpoint, currentOptions)
      .then((result) => {
        if (active) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError((err as ApiError).message || "Error fetching data");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setIsRevalidating(false);
        }
      });

    return () => {
      active = false;
    };
  }, [endpoint, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isRevalidating,
    setData,
  };
}

/**
 * Fast custom hook for executing imperative API requests (POST/PUT/DELETE/GET)
 * with loading & error states.
 */
export function useCustomFetch() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useCallback(
    async <T = any>(
      endpoint: string,
      options: CustomFetchOptions = {}
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const res = await customFetch<T>(endpoint, options);
        return res;
      } catch (err) {
        const message = (err as ApiError).message || "An error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchApi,
    loading,
    error,
    setError,
    clearCache,
  };
}
