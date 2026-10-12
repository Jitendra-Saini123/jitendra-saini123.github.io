"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { HERO_SCENE_EVENT, heroSignals, requestRebuild } from "@/components/three/hero-signals";

const subscribe = (callback: () => void) => {
  window.addEventListener(HERO_SCENE_EVENT, callback);
  return () => window.removeEventListener(HERO_SCENE_EVENT, callback);
};

/** Replays the tower's assembly. Only rendered while the 3D scene is live. */
export function RebuildButton() {
  const live = useSyncExternalStore(subscribe, () => heroSignals.sceneLive, () => false);
  const reduce = useReducedMotion();
  if (!live || reduce) return null;

  return (
    <button
      type="button"
      onClick={requestRebuild}
      className="group hero-rise hidden items-center gap-2 rounded-full py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-fg sm:inline-flex"
      style={{ ["--d" as string]: 0 }}
    >
      <RotateCcw aria-hidden size={13} className="transition-transform duration-500 group-hover:-rotate-180" />
      Rebuild
      <span className="sr-only"> the 3D tower</span>
    </button>
  );
}
