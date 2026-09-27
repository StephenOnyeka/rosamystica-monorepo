import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

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

/** Strips ALL HTML tags and returns plain text — use for short descriptions / truncated previews. */
export function stripHtmlTags(rawHtml: string | undefined | null): string {
  if (!rawHtml) return "";
  const sanitized = cleanHtmlContent(rawHtml);
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = sanitized;
    return div.textContent ?? div.innerText ?? "";
  }
  // Server-side fallback
  return sanitized.replace(/<[^>]*>/g, "");
}

export function parseCleanHtml(rawHtml: string | undefined | null) {
  if (!rawHtml) return null;
  const cleanHtml = cleanHtmlContent(rawHtml);
  return parse(cleanHtml);
}

