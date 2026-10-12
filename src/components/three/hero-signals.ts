/**
 * A tiny mutable store shared between the DOM and the WebGL scene.
 * Written by event listeners, read inside useFrame — so updates never cause
 * React re-renders.
 */
export const heroSignals = {
  /** Pointer position, normalised to -1..1 (0 = centre). */
  pointerX: 0,
  pointerY: 0,
  /** Scroll progress through the hero, 0..1. */
  scroll: 0,
  /** 1 while a hero CTA is hovered or focused. */
  hover: 0,
  /** Timestamp (ms) until which a tap-triggered pulse is active. */
  pulseUntil: 0,
  /** Incremented to replay the tower's assembly sequence. */
  rebuildRequests: 0,
  /** True while the WebGL scene is rendering (not the CSS fallback). */
  sceneLive: false,
};

export const HERO_SCENE_EVENT = "hero-scene-change";

export function setSceneLive(live: boolean) {
  heroSignals.sceneLive = live;
  window.dispatchEvent(new Event(HERO_SCENE_EVENT));
}

export function requestRebuild() {
  heroSignals.rebuildRequests += 1;
}

export function setHeroHover(active: boolean) {
  heroSignals.hover = active ? 1 : 0;
}

export function pulseHero(durationMs = 700) {
  heroSignals.pulseUntil = performance.now() + durationMs;
}

/** Target "energy" for the scene: hovered CTAs and taps make it surge. */
export function heroEnergyTarget(): number {
  return Math.max(heroSignals.hover, performance.now() < heroSignals.pulseUntil ? 1 : 0);
}
