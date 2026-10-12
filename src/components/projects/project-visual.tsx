"use client";

import { type CSSProperties, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { Project, ProjectImage, ProjectVideo } from "@/types";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { cn } from "@/lib/cn";

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const n = parseInt(value.length === 3 ? value.replace(/(.)/g, "$1$1") : value, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * Muted, looping product video inside a phone frame. Only created near the
 * viewport, paused off-screen, and skipped for reduced motion or Save-Data.
 */
function PhoneVideo({ video }: { video: ProjectVideo }) {
  const holder = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLVideoElement>(null);
  const near = useNearViewport(holder, "300px");
  const reduce = useReducedMotion();
  const [saveData] = useState(
    () => typeof navigator !== "undefined" && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData),
  );
  const enabled = near && !reduce && !saveData;

  useEffect(() => {
    const v = el.current;
    if (!v) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    });
    observer.observe(v);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div ref={holder} className="absolute inset-0">
      {enabled && (
        <video
          ref={el}
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        >
          <source src={video.src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

/** A phone frame around a real screenshot or promo frame. */
function Phone({
  image,
  className,
  style,
  sizes,
  video,
}: {
  image: ProjectImage;
  className?: string;
  style?: CSSProperties;
  sizes: string;
  video?: ProjectVideo;
}) {
  return (
    <div
      className={cn(
        "absolute aspect-[9/19.5] overflow-hidden rounded-[1.6rem] border-[5px] border-[#090d19] bg-ink-900 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.08)]",
        className,
      )}
      style={style}
    >
      <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover object-top" />
      {video && <PhoneVideo video={video} />}
      <span aria-hidden className="absolute left-1/2 top-1.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/70" />
    </div>
  );
}

function Composition({ project }: { project: Project }) {
  const [a, b, c] = project.visual.images;

  switch (project.visual.variant) {
    case "phone-fan":
      return (
        <>
          {b && <Phone image={b} sizes="(min-width: 1024px) 18vw, 40vw" className="left-[8%] top-[16%] w-[30%] -rotate-[9deg] opacity-80" />}
          {c && <Phone image={c} sizes="(min-width: 1024px) 18vw, 40vw" className="right-[8%] top-[16%] w-[30%] rotate-[9deg] opacity-80" />}
          {a && <Phone image={a} sizes="(min-width: 1024px) 20vw, 45vw" className="left-1/2 top-[8%] w-[34%] -translate-x-1/2" />}
        </>
      );
    case "phone-stack":
      return (
        <>
          {c && <Phone image={c} sizes="(min-width: 1024px) 16vw, 36vw" className="left-[62%] top-[20%] w-[27%] rotate-[4deg] opacity-70" />}
          {b && <Phone image={b} sizes="(min-width: 1024px) 16vw, 36vw" className="left-[11%] top-[20%] w-[27%] -rotate-[4deg] opacity-70" />}
          {a && <Phone image={a} video={project.video} sizes="(min-width: 1024px) 20vw, 45vw" className="left-1/2 top-[7%] w-[33%] -translate-x-1/2" />}
        </>
      );
    case "browser":
      return a ? (
        <div className="absolute inset-x-[7%] top-[12%] [perspective:1400px]">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.95)] [transform:rotateY(-9deg)_rotateX(5deg)] [transform-origin:60%_50%]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#0b1020] px-3 py-2.5">
              <span className="size-2 rounded-full bg-[#ff5f57]/80" />
              <span className="size-2 rounded-full bg-[#febc2e]/80" />
              <span className="size-2 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[0.62rem] text-subtle">
                {project.visual.label ?? ""}
              </span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image src={a.src} alt={a.alt} fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-cover object-top" />
            </div>
          </div>
        </div>
      ) : null;
    case "banner":
      return a ? <Image src={a.src} alt={a.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" /> : null;
  }
}

function sourceLabel(project: Project): string {
  const kinds = new Set(project.visual.images.map((image) => image.kind));
  if (kinds.size === 1 && kinds.has("screenshot")) return project.status.kind === "in-development" ? "Real screenshots · development build" : "Real screenshot";
  if (kinds.size === 1 && kinds.has("promo")) return project.visual.label ?? "Promotional artwork";
  return "Screenshots & artwork";
}

/**
 * The visual "stage" for a featured project, with a soft glow in the
 * product's own brand colour and a gentle pointer tilt on desktop.
 */
export function ProjectStage({ project, index, children }: { project: Project; index: string; children?: ReactNode }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 140, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 140, damping: 18 });

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const rgb = hexToRgb(project.accent);
  const showLabels = project.visual.variant !== "banner";

  return (
    <div className="[perspective:1600px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        style={{ rotateX, rotateY, ["--accent" as string]: rgb }}
        className="noise relative aspect-[5/4] overflow-hidden rounded-[1.75rem] border border-line bg-ink-900 sm:aspect-[4/3]"
      >
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgb(var(--accent)/0.24),transparent_70%)]" />
        <div aria-hidden className="grid-backdrop absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_70%_at_50%_40%,black,transparent)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900 to-transparent" />

        <Composition project={project} />

        {showLabels && (
          <>
            <p className="absolute left-4 top-4 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-subtle sm:left-5 sm:top-5">
              {index} / {project.name}
            </p>
            <p className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted backdrop-blur-sm sm:bottom-5 sm:left-5">
              {sourceLabel(project)}
            </p>
            {project.visual.label && project.visual.variant === "phone-fan" && (
              <p className="absolute right-4 top-4 font-mono text-[0.62rem] tracking-[0.12em] text-[rgb(var(--accent))] sm:right-5 sm:top-5">
                {project.visual.label}
              </p>
            )}
          </>
        )}
        {children}
      </motion.div>
    </div>
  );
}
