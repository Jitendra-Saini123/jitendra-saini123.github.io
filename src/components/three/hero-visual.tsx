"use client";

import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { HeroFallback } from "./hero-fallback";
import { detectQuality, type SceneQuality, shouldSkip3D, supportsWebGL2 } from "./capabilities";
import { heroSignals, pulseHero, setSceneLive } from "./hero-signals";

// three.js and the scene are split into their own chunk and never server-rendered.
const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

type Mode = "pending" | "webgl" | "fallback";

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
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

/**
 * Hero backdrop. Paints the CSS sculpture immediately, then — when the browser
 * is idle and the device can handle it — lazy-loads the WebGL scene and
 * cross-fades it in. Any failure leaves the CSS version in place.
 */
export function HeroVisual({ heroId }: { heroId: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<SceneQuality>("high");
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  // The hero unmounts on other pages: make sure the Rebuild control hides.
  useEffect(() => () => setSceneLive(false), []);

  // Decide whether to load WebGL, once the main thread is idle.
  useEffect(() => {
    const decide = () => {
      if (!supportsWebGL2() || shouldSkip3D()) {
        setMode("fallback");
        return;
      }
      setQuality(detectQuality());
      setMode("webgl");
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(decide, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(decide, 400);
    return () => clearTimeout(id);
  }, []);

  // Pause rendering when the hero leaves the viewport or the tab is hidden.
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), { threshold: 0 });
    observer.observe(hero);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [heroId]);

  // Pointer, touch and scroll signals for the scene (no React re-renders).
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      heroSignals.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      heroSignals.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button")) return;
      heroSignals.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      heroSignals.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
      pulseHero();
    };
    const onScroll = () => {
      const height = hero.offsetHeight || window.innerHeight;
      heroSignals.scroll = Math.min(Math.max(window.scrollY / height, 0), 1);
    };

    onScroll();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      heroSignals.pointerX = 0;
      heroSignals.pointerY = 0;
    };
  }, [heroId]);

  const showCanvas = mode === "webgl";
  const handleReady = useCallback(() => {
    setReady(true);
    setSceneLive(true);
  }, []);
  const handleFailure = useCallback(() => {
    setReady(false);
    setMode("fallback");
    setSceneLive(false);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[54svh] lg:inset-0 lg:h-auto"
      data-scene={mode === "pending" ? "loading" : mode}
    >
      <HeroFallback hidden={showCanvas && ready} />
      {showCanvas && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1600ms] ease-out", ready ? "opacity-100" : "opacity-0")}>
          <SceneErrorBoundary onError={handleFailure}>
            <HeroCanvas
              quality={quality}
              animate={!prefersReducedMotion}
              active={inView && pageVisible}
              onReady={handleReady}
              onFailure={handleFailure}
            />
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  );
}
