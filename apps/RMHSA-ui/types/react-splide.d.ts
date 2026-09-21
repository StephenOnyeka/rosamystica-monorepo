/**
 * Type shim for @splidejs/react-splide.
 *
 * The package ships type declarations (dist/types/index.d.ts), but its
 * package.json "exports" map has no "types" condition, so TypeScript cannot
 * resolve them. This ambient declaration re-exposes the runtime API used by
 * the app, reusing the option types from the core @splidejs/splide package.
 */
declare module "@splidejs/react-splide" {
  import type { ComponentType, ReactNode } from "react";
  import type { Options } from "@splidejs/splide";

  export type { Options };

  export interface SplideProps {
    options?: Options;
    extensions?: Record<string, unknown>;
    hasTrack?: boolean;
    tag?: string;
    className?: string;
    children?: ReactNode;
  }

  export interface SplideSlideProps {
    tag?: string;
    className?: string;
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}
