"use client";

import { Component, type KeyboardEvent, type PointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { Hand } from "lucide-react";
import { detectQuality, type SceneQuality, shouldSkip3D, supportsWebGL2 } from "@/components/three/capabilities";
import { avatarSignals, requestWave } from "@/components/three/avatar/avatar-signals";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { cn } from "@/lib/cn";
import { AvatarLoop } from "./avatar-loop";

const AvatarCanvas = dynamic(() => import("@/components/three/avatar/avatar-canvas"), { ssr: false });

const MODEL_SRC = "/models/avatar.glb";

class AvatarErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Mode = "pending" | "webgl" | "video";

const clampYaw = (yaw: number) => Math.max(-1.1, Math.min(1.1, yaw));

/** Turns the avatar by a delta; it holds the pose briefly, then faces the visitor again. */
function turnBy(delta: number) {
  avatarSignals.dragYaw = clampYaw(avatarSignals.dragYaw + delta);
  avatarSignals.releasedAt = performance.now();
}

/**
 * Live 3D avatar for the About section. The ~2.4 MB model only loads when the
 * section approaches the viewport. Without WebGL (or on Save-Data / very weak
 * devices) the recorded avatar clip is shown instead.
 */
export function AvatarViewer() {
  const stage = useRef<HTMLDivElement>(null);
  const near = useNearViewport(stage, "500px");
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<SceneQuality>("high");
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [touch, setTouch] = useState(false);
  const drag = useRef<{ x: number; y: number; yaw: number; moved: boolean; at: number } | null>(null);
  const surface = useRef<HTMLDivElement>(null);

  // Decide once the stage is close: 3D or the video fallback.
  useEffect(() => {
    if (!near || mode !== "pending") return;
    const id = setTimeout(() => {
      if (!supportsWebGL2() || shouldSkip3D()) {
        setMode("video");
        return;
      }
      setQuality(detectQuality());
      setTouch(window.matchMedia("(pointer: coarse)").matches);
      setMode("webgl");
    }, 0);
    return () => clearTimeout(id);
  }, [near, mode]);

  // Render only while the stage is on screen.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Gaze follows the pointer anywhere on the page, relative to the avatar.
  useEffect(() => {
    if (mode !== "webgl") return;
    const onMove = (event: globalThis.PointerEvent) => {
      const el = stage.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.28;
      avatarSignals.lookX = Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth * 0.45)));
      avatarSignals.lookY = Math.max(-1, Math.min(1, (cy - event.clientY) / (window.innerHeight * 0.5)));
      avatarSignals.lastPointer = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  // Trackpads: a two-finger horizontal swipe turns the avatar. Vertical
  // scrolling is left alone, and the horizontal swipe is consumed so the
  // browser doesn't treat it as a back/forward navigation gesture.
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      turnBy(-event.deltaX * 0.004);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [mode]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, yaw: avatarSignals.dragYaw, moved: false, at: performance.now() };
    avatarSignals.dragging = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    // A little jitter (common on trackpads) still counts as a click.
    if (Math.hypot(dx, event.clientY - d.y) > 8) d.moved = true;
    if (d.moved) avatarSignals.dragYaw = clampYaw(d.yaw + dx * 0.008);
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    avatarSignals.dragging = false;
    avatarSignals.releasedAt = performance.now();
    if (d && !d.moved && performance.now() - d.at < 700) requestWave();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      turnBy(event.key === "ArrowLeft" ? -0.35 : 0.35);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      requestWave();
    }
  };

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback(() => {
    setReady(false);
    setMode("video");
  }, []);

  const live = mode === "webgl";

  return (
    <div ref={stage} className="absolute inset-0">
      {/* Poster / fallback layer */}
      <div className={cn("absolute inset-0 transition-opacity duration-1000", live && ready ? "opacity-0" : "opacity-100")}>
        {mode === "video" ? (
          <AvatarLoop
            poster="/images/about/avatar-poster.webp"
            webm="/media/avatar-loop.webm"
            mp4="/media/avatar-loop.mp4"
            label="Animated 3D avatar of Jitendra Saini"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- decorative placeholder under the canvas
          <img src="/images/about/avatar-poster.webp" alt="" loading="lazy" className="size-full object-cover object-[50%_35%] opacity-60" />
        )}
      </div>

      {live && (
        <div
          ref={surface}
          role="button"
          tabIndex={ready ? 0 : -1}
          aria-label="Interactive 3D avatar of Jitendra. Press Enter to wave; use the left and right arrow keys to turn."
          className={cn(
            "absolute inset-0 touch-pan-y select-none rounded-sm transition-opacity duration-1000 focus-visible:outline-offset-[-4px]",
            ready ? "cursor-grab opacity-100 active:cursor-grabbing" : "opacity-0",
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        >
          <AvatarErrorBoundary onError={handleFailure}>
            <AvatarCanvas
              src={MODEL_SRC}
              quality={quality}
              animate={!reduce}
              active={inView}
              onReady={handleReady}
              onFailure={handleFailure}
            />
          </AvatarErrorBoundary>
        </div>
      )}

      {live && !ready && (
        <p className="absolute inset-x-0 bottom-16 flex items-center justify-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-cyan-soft">
          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-cyan" />
          Loading 3D avatar
        </p>
      )}

      {live && ready && (
        <>
          {/* Sits under the card's "Avatar · 3D" label so the two never collide on narrow cards. */}
          <p className="pointer-events-none absolute inset-x-4 top-9 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.16em] text-muted">
            {touch ? "Swipe to turn · tap to wave" : "Drag or swipe to turn · click to wave"}
          </p>
          <button
            type="button"
            onClick={() => requestWave()}
            className="absolute bottom-4 right-4 z-10 inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-ink-950/70 px-3.5 text-xs text-fg backdrop-blur-sm transition-colors hover:border-cyan/60"
          >
            <Hand size={14} aria-hidden />
            Say hi
          </button>
        </>
      )}
    </div>
  );
}
