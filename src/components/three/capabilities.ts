export type SceneQuality = "high" | "low";

interface NavigatorWithHints extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

/** three.js r16x+ requires WebGL 2. */
export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    const ok = context !== null;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/** Visitors who asked to save data, or very weak devices, get the CSS scene. */
export function shouldSkip3D(): boolean {
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return true;
  return false;
}

/** Small or touch-first devices render a lighter scene. */
export function detectQuality(): SceneQuality {
  const nav = navigator as NavigatorWithHints;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 900;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
  return coarse || small || lowMemory ? "low" : "high";
}
