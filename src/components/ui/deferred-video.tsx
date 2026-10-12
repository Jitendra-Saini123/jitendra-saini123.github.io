"use client";

import { useRef } from "react";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { cn } from "@/lib/cn";

interface DeferredVideoProps {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  className?: string;
}

/**
 * A click-to-play video whose element (and poster image) is only created once
 * it's close to the viewport, so it never competes with the initial page load.
 */
export function DeferredVideo({ src, poster, width, height, label, className }: DeferredVideoProps) {
  const holder = useRef<HTMLDivElement>(null);
  const near = useNearViewport(holder);

  return (
    <div ref={holder} className={cn("relative overflow-hidden bg-black", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      {near && (
        <video
          controls
          playsInline
          preload="none"
          poster={poster}
          width={width}
          height={height}
          aria-label={label}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
