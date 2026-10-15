"use client";

import Topfile from "@/components/Topfile";
import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";

/**
 * Shimmering skeleton placeholder for individual blog cards in the list view.
 * Matches the layout and dimensions of BlogsDetails.tsx exactly to eliminate layout shift.
 */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow animate-pulse">
      {/* Cover image placeholder */}
      <div className="w-full md:w-80 h-52 md:h-auto shrink-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

      {/* Content body placeholder */}
      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <div>
          {/* Metadata row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-5 w-20 rounded-full bg-gray-200" />
            <div className="h-2 w-2 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-2 w-2 rounded-full bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>

          {/* Title placeholder */}
          <div className="space-y-2 mb-3">
            <div className="h-6 w-5/6 rounded bg-gray-200" />
            <div className="h-6 w-3/5 rounded bg-gray-200" />
          </div>

          {/* Description lines */}
          <div className="space-y-2 pt-1">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-11/12 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton list displaying multiple card placeholders.
 */
export function BlogListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Full page skeleton for the /blogs list page.
 * Keeps Topfile, Navbar, and layout static while streaming skeleton content.
 */
export function BlogsPageSkeleton() {
  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />
        <div className="max-w-5xl mx-auto mb-6">
          <div className="h-8 w-64 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-4 w-96 rounded bg-gray-100 animate-pulse" />
        </div>
        <BlogListSkeleton count={4} />
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for an individual blog article (/blogs/[id]).
 * Mirrors BlogPost.tsx geometry with hero image, title, author row, and prose lines.
 */
export function BlogPostSkeleton() {
  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />

        <div className="max-w-5xl mx-auto animate-pulse">
          {/* Header navigation bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <div className="h-7 w-48 rounded bg-gray-200 mb-1" />
                <div className="h-4 w-56 rounded bg-gray-100" />
              </div>
            </div>
            <div className="h-9 w-24 rounded-lg bg-gray-200" />
          </div>

          {/* Article card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
            {/* Cover image banner */}
            <div className="w-full h-72 md:h-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

            <div className="p-6 md:p-12 space-y-6">
              {/* Metadata row */}
              <div className="flex items-center gap-3">
                <div className="h-5 w-32 rounded-full bg-gray-200" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>

              {/* Title lines */}
              <div className="space-y-3">
                <div className="h-10 md:h-12 w-4/5 rounded-lg bg-gray-200" />
                <div className="h-10 md:h-12 w-3/5 rounded-lg bg-gray-200" />
              </div>

              <hr className="border-gray-200 my-6" />

              {/* Body paragraphs */}
              <div className="space-y-4 pt-2">
                <div className="h-4.5 w-full rounded bg-gray-100" />
                <div className="h-4.5 w-full rounded bg-gray-100" />
                <div className="h-4.5 w-11/12 rounded bg-gray-100" />
                <div className="h-4.5 w-4/5 rounded bg-gray-100" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="h-6 w-2/5 rounded bg-gray-200" />
                <div className="h-4.5 w-full rounded bg-gray-100" />
                <div className="h-4.5 w-full rounded bg-gray-100" />
                <div className="h-4.5 w-3/4 rounded bg-gray-100" />
              </div>

              {/* Inset image placeholder */}
              <div className="w-full h-64 rounded-xl bg-gray-200 my-6" />

              <div className="space-y-4 pt-2">
                <div className="h-4.5 w-full rounded bg-gray-100" />
                <div className="h-4.5 w-5/6 rounded bg-gray-100" />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="h-5 w-36 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
