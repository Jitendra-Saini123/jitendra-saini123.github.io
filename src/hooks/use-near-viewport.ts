"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Becomes true (once) when the element comes within `rootMargin` of the
 * viewport — used to defer loading media until it's about to be seen.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = "600px"): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}
