"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { SceneQuality } from "../capabilities";
import { ProceduralEnvironment } from "../procedural-environment";
import { AvatarRig } from "./avatar-rig";
import { avatarSignals } from "./avatar-signals";

export interface AvatarCanvasProps {
  src: string;
  quality: SceneQuality;
  animate: boolean;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function Avatar({ src, animate, onLoaded }: { src: string; animate: boolean; onLoaded: () => void }) {
  const gltf = useLoader(GLTFLoader, src, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const group = useRef<Group>(null);
  // A wave requested before the model finished loading still plays once it's ready.
  const seenWaves = useRef(avatarSignals.waveRequests - (avatarSignals.pendingWave ? 1 : 0));

  const rig = useMemo(() => {
    gltf.scene.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      const material = mesh.material as MeshStandardMaterial;
      material.envMapIntensity = material.name === "glasses" ? 1.6 : 0.55;
      if (material.name === "haircut") {
        // Low cutoff + alpha-to-coverage: dense, softly antialiased hair cards
        // without the scalp showing through the gaps.
        material.alphaTest = 0.28;
        material.alphaToCoverage = true;
        material.color.setScalar(0.82);
        material.roughness = 0.85;
        material.envMapIntensity = 0.2;
      }
    });
    return new AvatarRig(gltf.scene);
  }, [gltf]);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const now = performance.now();
    const t = state.clock.elapsedTime;
    const s = avatarSignals;

    if (s.waveRequests !== seenWaves.current) {
      seenWaves.current = s.waveRequests;
      s.pendingWave = false;
      rig.wave(t);
    }

    // Body turn: follows the drag, then eases back to face the visitor.
    if (!s.dragging && now - s.releasedAt > 1600) s.dragYaw = damp(s.dragYaw, 0, 1.6, dt);
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, s.dragYaw, 8, dt);

    // Gaze: the pointer while it's active, otherwise a slow look around.
    const idleGaze = animate && now - s.lastPointer > 4000;
    const lookX = idleGaze ? Math.sin(t * 0.31) * 0.35 : s.lookX;
    const lookY = idleGaze ? Math.sin(t * 0.23) * 0.12 : s.lookY;

    rig.update(dt, t, { lookX, lookY, idle: animate });
  });

  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  );
}

/** Compiles shaders off the main thread before the first visible frame. */
function Warmup({ ready, onCompiled }: { ready: boolean; onCompiled: (v: boolean) => void }) {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const { gl, scene, camera } = getState();
    const done = () => {
      if (!cancelled) onCompiled(true);
    };
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      cancelled = true;
    };
  }, [ready, getState, onCompiled]);
  return null;
}

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

export default function AvatarCanvas({ src, quality, animate, active, onReady, onFailure }: AvatarCanvasProps) {
  const low = quality === "low";
  const [loaded, setLoaded] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const markLoaded = useMemo(() => () => setLoaded(true), []);

  // Reduced motion still renders on demand so the gaze responds to the pointer.
  const continuous = active && compiled && !low;
  const frameloop = continuous ? "always" : active && compiled ? "demand" : "never";

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
      dpr={low ? [1, 1.5] : [1, 1.75]}
      frameloop={frameloop}
      camera={{ position: [0, 1.4, 2.75], fov: 30, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        camera.lookAt(0, 1.27, 0);
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
      <hemisphereLight args={["#dfe3ff", "#1a2040", 0.6]} />
      {/* Warm key, cyan rim and violet fill — the site's palette as studio lighting. */}
      <directionalLight position={[1.4, 2.4, 3]} intensity={2.9} color="#ffe8d4" />
      <directionalLight position={[-2.2, 2.2, -2]} intensity={2.6} color="#45d9ff" />
      <directionalLight position={[2.6, 1.2, -1.6]} intensity={1.4} color="#8b70ff" />
      <ProceduralEnvironment size={128} />
      <Suspense fallback={null}>
        <Avatar src={src} animate={animate} onLoaded={markLoaded} />
      </Suspense>
      <Warmup ready={loaded} onCompiled={setCompiled} />
      {active && compiled && (low || !animate) && <FrameLimiter fps={animate ? 30 : 12} />}
    </Canvas>
  );
}
