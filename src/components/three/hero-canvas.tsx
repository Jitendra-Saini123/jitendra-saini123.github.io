"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { BuilderUniverse } from "./builder-universe";
import type { SceneQuality } from "./capabilities";

export interface HeroCanvasProps {
  quality: SceneQuality;
  /** False when the visitor prefers reduced motion: render still frames only. */
  animate: boolean;
  /** False when the hero is off-screen or the tab is hidden: stop rendering. */
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
}

/** Renders a few frames on demand so a static (reduced-motion) scene settles. */
function SettleFrames() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    let frames = 0;
    let raf = 0;
    const tick = () => {
      invalidate();
      if (++frames < 6) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);
  return null;
}

/**
 * Compiles every shader before the first frame. With KHR_parallel_shader_compile
 * (most browsers) this happens off the main thread, so the page stays responsive
 * instead of stalling on one long compile task.
 */
function ShaderWarmup({ onCompiled }: { onCompiled: (value: boolean) => void }) {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    let cancelled = false;
    const { gl, scene, camera } = getState();
    const done = () => {
      if (!cancelled) onCompiled(true);
    };
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      cancelled = true;
    };
  }, [getState, onCompiled]);
  return null;
}

/** Caps rendering to a target frame rate (used on low-tier devices). */
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const interval = 1000 / fps;
    let last = 0;
    let raf = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (time - last >= interval - 1) {
        last = time;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);
  return null;
}

export default function HeroCanvas({ quality, animate, active, onReady, onFailure }: HeroCanvasProps) {
  const low = quality === "low";
  const [compiled, setCompiled] = useState(false);
  // Nothing renders until shaders are ready. Then desktop renders every frame;
  // phones and tablets render at 30fps on demand.
  const frameloop = !compiled || !active ? "never" : animate && !low ? "always" : "demand";

  // Reveal the canvas one frame after the first real render.
  useEffect(() => {
    if (!compiled) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => onReady());
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [compiled, onReady]);

  return (
    <Canvas
      aria-hidden
      dpr={low ? [1, 1.25] : [1, 1.75]}
      frameloop={frameloop}
      camera={{ position: [0, 2.3, 10], fov: 35, near: 0.1, far: 60 }}
      gl={{
        antialias: quality === "high",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onFailure();
          },
          { once: true },
        );
      }}
    >
      <BuilderUniverse quality={quality} animate={animate} />
      <ShaderWarmup onCompiled={setCompiled} />
      {compiled && !animate && <SettleFrames />}
      {compiled && animate && low && active && <FrameLimiter fps={30} />}
    </Canvas>
  );
}
