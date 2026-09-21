"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollTriggerProps {
  onEnter?: () => void;
  onExit?: () => void;
  children?: ReactNode;
}

/**
 * Local replacement for `react-scroll-trigger`, which is not compatible with
 * React 19 (it relies on ReactDOM.findDOMNode, removed in React 19).
 * Renders the same plain div wrapper and fires onEnter/onExit when the
 * element enters or leaves the viewport.
 */
function ScrollTrigger({ onEnter, onExit, children }: ScrollTriggerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onEnter, onExit });

  useEffect(() => {
    callbacksRef.current = { onEnter, onExit };
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbacksRef.current.onEnter?.();
        } else {
          callbacksRef.current.onExit?.();
        }
      },
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={elementRef}>{children}</div>;
}

export default ScrollTrigger;
