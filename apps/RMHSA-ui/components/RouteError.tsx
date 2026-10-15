"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import Topfile from "@/components/Topfile";
import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

/**
 * Shared route-level error screen. Shown when a server render fails and there
 * is no previously cached (ISR) version to fall back to.
 */
export default function RouteError({
  reset,
  backHref = "/",
  backLabel = "Back to Home",
}: {
  reset: () => void;
  backHref?: string;
  backLabel?: string;
}) {
  const router = useRouter();

  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="px-4 md:px-6 lg:px-8">
        <br />
        <Navbar />
        <br />
        <br />
        <ErrorState
          onRetry={() => {
            // Re-run the server render, then reset the boundary
            startTransition(() => {
              router.refresh();
              reset();
            });
          }}
          backHref={backHref}
          backLabel={backLabel}
        />
      </div>
    </div>
  );
}
