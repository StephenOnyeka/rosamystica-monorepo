import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeHtmlEntities(str: string | undefined | null): string {
  if (!str) return "";
  let decoded = str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");

  if (typeof window !== "undefined" && decoded.includes("&")) {
    try {
      const doc = new DOMParser().parseFromString(decoded, "text/html");
      decoded = doc.documentElement.textContent || decoded;
    } catch {
      // Fallback
    }
  }
  return decoded;
}

export function cleanHtmlContent(rawHtml: string | undefined | null): string {
  if (!rawHtml) return "";
  const decoded = decodeHtmlEntities(rawHtml);
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(decoded);
  }
  return decoded;
}

