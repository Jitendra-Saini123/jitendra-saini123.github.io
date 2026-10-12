/**
 * Mutable input shared between the DOM controls and the avatar scene.
 * Written by event handlers, read inside useFrame — no React re-renders.
 */
export const avatarSignals = {
  /** Gaze target, -1..1. */
  lookX: 0,
  lookY: 0,
  /** performance.now() of the last pointer movement. */
  lastPointer: 0,
  /** Target body rotation from dragging, in radians. */
  dragYaw: 0,
  dragging: false,
  /** performance.now() when the drag ended. */
  releasedAt: 0,
  /** Incremented to request a wave. */
  waveRequests: 0,
  /** True until a requested wave has been played (survives the model loading). */
  pendingWave: false,
};

export function requestWave() {
  avatarSignals.waveRequests += 1;
  avatarSignals.pendingWave = true;
}
