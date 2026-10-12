"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useNearViewport } from "@/hooks/use-near-viewport";

/**
 * Looping clip of a 3D avatar. Muted, plays only while visible, and never
 * autoplays for visitors who prefer reduced motion.
 */
export function AvatarLoop({ poster, mp4, webm, label }: { poster: string; mp4: string; webm: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const near = useNearViewport(holder);
  const reduce = useReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !reduce && !userPaused) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce, userPaused, near]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      el.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      el.pause();
    }
  };

  return (
    <div ref={holder} className="absolute inset-0">
      {near && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 size-full object-cover object-[50%_35%]"
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 right-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-ink-950/70 text-fg backdrop-blur-sm transition-colors hover:border-cyan/60"
      >
        {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
        <span className="sr-only">{playing ? "Pause avatar animation" : "Play avatar animation"}</span>
      </button>
    </div>
  );
}
