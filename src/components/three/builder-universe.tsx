"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  type Group,
  type InstancedMesh,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  type Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  type PointLight,
  type ShaderMaterial,
  type Sprite,
  SRGBColorSpace,
  TetrahedronGeometry,
} from "three";
import { heroEnergyTarget, heroSignals } from "./hero-signals";
import type { SceneQuality } from "./capabilities";
import { ProceduralEnvironment } from "./procedural-environment";

/* -------------------------------------------------------------------------- */
/* Art direction                                                              */
/* -------------------------------------------------------------------------- */

const CYAN = "#45d9ff";
const CYAN_SOFT = "#9eeaff";
const VIOLET = "#8b70ff";
const SLAB_COUNT = 9;
const SLAB_HEIGHT = 0.15;
const TWIST = 0.21;

/** Framerate-independent exponential smoothing. */
function damp(current: number, target: number, lambda: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

/** Small deterministic PRNG so the composition is identical on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Assembly intro: a shared timeline (in scene seconds) every part reads from. */
const intro = { start: 0, seen: 0 };
const SLAB_DELAY = 0.45;
const SLAB_STAGGER = 0.12;
const SLAB_DURATION = 0.9;
const CROWN_AT = SLAB_DELAY + SLAB_COUNT * SLAB_STAGGER + 0.45;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOutQuart = (p: number) => 1 - Math.pow(1 - p, 4);

/** Seconds since the current intro started; "long ago" when motion is off. */
function introElapsed(t: number, animate: boolean) {
  return animate ? t - intro.start : 1e3;
}

/** Starts the intro on mount and replays it whenever a rebuild is requested. */
function IntroDirector() {
  useEffect(() => {
    intro.start = 0;
    intro.seen = heroSignals.rebuildRequests;
  }, []);
  useFrame((state) => {
    if (heroSignals.rebuildRequests !== intro.seen) {
      intro.seen = heroSignals.rebuildRequests;
      intro.start = state.clock.elapsedTime;
    }
  });
  return null;
}

/** A soft light that follows the pointer, so the metal glints as you move. */
function CursorLight() {
  const light = useRef<PointLight>(null);
  useFrame((_, delta) => {
    const l = light.current;
    if (!l) return;
    l.position.x = damp(l.position.x, heroSignals.pointerX * 3.4, 3, delta);
    l.position.y = damp(l.position.y, heroSignals.pointerY * 2.2 + 0.4, 3, delta);
  });
  return <pointLight ref={light} position={[0, 0.4, 2.4]} color="#d4f7ff" intensity={2.4} distance={7} decay={2} />;
}

function useGlowTexture() {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.18, "rgba(255,255,255,0.6)");
      g.addColorStop(0.45, "rgba(255,255,255,0.14)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/* -------------------------------------------------------------------------- */
/* Scene root                                                                 */
/* -------------------------------------------------------------------------- */

export function BuilderUniverse({ quality, animate }: { quality: SceneQuality; animate: boolean }) {
  const { viewport, size } = useThree();
  const glow = useGlowTexture();
  const wide = size.width >= 1024;

  // Desktop: the sculpture sits in the right half, leaving room for the copy.
  // Mobile: centred in its own band above the copy, scaled to fit.
  const offsetX = wide ? viewport.width * 0.28 : 0;
  const scale = wide ? Math.min(Math.max(viewport.width / 11, 0.72), 1) : Math.min(0.74, viewport.width / 7);

  return (
    <>
      <CameraRig animate={animate} />
      <fog attach="fog" args={["#050711", 9, 24]} />

      <ambientLight intensity={0.35} color="#7a88b8" />
      <directionalLight position={[-4, 5, 6]} intensity={1.6} color={CYAN_SOFT} />
      <directionalLight position={[5, 1, -5]} intensity={3} color={VIOLET} />

      {/* Reflections come from a one-off procedural PMREM; low-tier devices skip it
          and get a hemisphere light instead, which costs nothing per frame. */}
      {quality === "high" ? (
        <ProceduralEnvironment size={256} />
      ) : (
        <hemisphereLight args={["#5a6fd6", "#050711", 1.4]} />
      )}

      <IntroDirector />
      <group position={[offsetX, wide ? 0.05 : 0.55, 0]} scale={scale}>
        {animate && quality === "high" && <CursorLight />}
        <AtmosphereGlows texture={glow} />
        <AssemblyTower texture={glow} animate={animate} quality={quality} />
        <OrbitRings animate={animate} texture={glow} />
        <Fragments count={quality === "high" ? 46 : 18} animate={animate} />
        <BlueprintFloor animate={animate} />
      </group>

      <StarField count={quality === "high" ? 900 : 320} texture={glow} animate={animate} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Camera: restrained pointer parallax and a scroll-linked dolly              */
/* -------------------------------------------------------------------------- */

function CameraRig({ animate }: { animate: boolean }) {
  useFrame((state, delta) => {
    const { camera } = state;
    const s = heroSignals;
    const px = animate ? s.pointerX : 0;
    const py = animate ? s.pointerY : 0;
    const targetX = px * 0.45;
    const targetY = 2.3 + py * 0.25 - s.scroll * 1.1;
    const targetZ = 10 + s.scroll * 2.4;
    const lambda = animate ? 2.6 : 100;
    camera.position.x = damp(camera.position.x, targetX, lambda, delta);
    camera.position.y = damp(camera.position.y, targetY, lambda, delta);
    camera.position.z = damp(camera.position.z, targetZ, lambda, delta);
    camera.lookAt(0, 0.15 - s.scroll * 0.5, 0);
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/* Atmosphere                                                                 */
/* -------------------------------------------------------------------------- */

function AtmosphereGlows({ texture }: { texture: CanvasTexture }) {
  return (
    <>
      <sprite position={[0, 0.1, -1.6]} scale={7.5}>
        <spriteMaterial map={texture} color={CYAN} transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[1.6, 1.4, -3]} scale={10}>
        <spriteMaterial map={texture} color={VIOLET} transparent opacity={0.2} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* The tower: hexagonal slabs assembling inside a blueprint envelope          */
/* -------------------------------------------------------------------------- */

function AssemblyTower({ texture, animate, quality }: { texture: CanvasTexture; animate: boolean; quality: SceneQuality }) {
  const group = useRef<Group>(null);
  const slabs = useRef<(Group | null)[]>([]);
  const crown = useRef<Mesh>(null);
  const crownGlow = useRef<Sprite>(null);
  const envelopeRef = useRef<LineSegments>(null);
  const coreLight = useRef<PointLight>(null);
  const spineMaterial = useRef<MeshBasicMaterial>(null);
  const energy = useRef(0);

  const { geometries, edges, materials, envelope } = useMemo(() => {
    const geometries = Array.from({ length: SLAB_COUNT }, (_, i) => {
      const r = 1.16 - i * 0.066;
      return new CylinderGeometry(r * 0.985, r, SLAB_HEIGHT, 6, 1);
    });
    const edges = geometries.map((g) => new EdgesGeometry(g, 15));

    const metal = new MeshStandardMaterial({
      color: "#24315a",
      metalness: 0.62,
      roughness: 0.32,
      envMapIntensity: 1.8,
      flatShading: true,
    });
    const glassParams = {
      color: "#8fe4ff",
      metalness: 0.15,
      roughness: 0.06,
      envMapIntensity: 2.2,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      side: DoubleSide,
      flatShading: true,
    } as const;
    // Clearcoat is a noticeably heavier shader; phones get the standard material.
    const glass =
      quality === "high"
        ? new MeshPhysicalMaterial({ ...glassParams, clearcoat: 1, clearcoatRoughness: 0.1 })
        : new MeshStandardMaterial({ ...glassParams, opacity: 0.32 });
    const edge = new LineBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.6,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    // The planned envelope: a dashed hexagonal prism the slabs build into.
    const envelopeGeometry = new EdgesGeometry(new CylinderGeometry(1.42, 1.42, 3.9, 6, 1));
    const envelopeLines = new LineSegments(
      envelopeGeometry,
      new LineDashedMaterial({
        color: CYAN_SOFT,
        dashSize: 0.12,
        gapSize: 0.09,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    envelopeLines.computeLineDistances();

    return { geometries, edges, materials: { metal, glass, edge }, envelope: envelopeLines };
  }, [quality]);

  useEffect(
    () => () => {
      geometries.forEach((g) => g.dispose());
      edges.forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
      envelope.geometry.dispose();
      (envelope.material as LineDashedMaterial).dispose();
    },
    [geometries, edges, materials, envelope],
  );

  useFrame((state, delta) => {
    const t = animate ? state.clock.elapsedTime : 0;
    energy.current = damp(energy.current, animate ? heroEnergyTarget() : 0, 3, delta);
    const e = energy.current;

    const since = introElapsed(state.clock.elapsedTime, animate);

    // The blueprint envelope draws in first…
    const env = easeOutQuart(clamp01(since / 0.9));
    const envelopeLines = envelopeRef.current;
    if (envelopeLines) {
      envelopeLines.scale.set(1, Math.max(env, 0.001), 1);
      (envelopeLines.material as LineDashedMaterial).opacity = 0.22 * env;
    }

    // …then each slab drops and twists into place; every lock-in flashes the core.
    // Scroll "explodes" the assembly a little, like an exploded technical view.
    const spread = 0.34 + heroSignals.scroll * 0.32 + e * 0.07;
    let flash = 0;
    slabs.current.forEach((slab, i) => {
      if (!slab) return;
      const p = clamp01((since - SLAB_DELAY - i * SLAB_STAGGER) / SLAB_DURATION);
      const k = easeOutQuart(p);
      const base = (i - (SLAB_COUNT - 1) / 2) * spread;
      slab.visible = p > 0;
      slab.position.y = base + Math.sin(t * 0.9 + i * 0.7) * 0.025 + (1 - k) * (2.4 + i * 0.12);
      slab.rotation.y = i * TWIST + Math.sin(t * 0.35 + i * 0.4) * 0.05 * (i % 2 === 0 ? 1 : -1) + (1 - k) * 2.6 * (i % 2 ? 1 : -1);
      slab.scale.setScalar(0.4 + 0.6 * k);
      const locked = since - (SLAB_DELAY + i * SLAB_STAGGER + SLAB_DURATION * 0.75);
      if (locked > 0 && locked < 1) flash += Math.exp(-locked * 7);
    });

    if (group.current && animate) {
      group.current.rotation.y += delta * (0.11 + e * 0.55);
      group.current.rotation.x = damp(group.current.rotation.x, heroSignals.pointerY * 0.06, 2, delta);
      group.current.rotation.z = damp(group.current.rotation.z, -heroSignals.pointerX * 0.04, 2, delta);
    }
    // Finally the crown — the idea — settles on top.
    const crownK = easeOutQuart(clamp01((since - CROWN_AT) / 0.8));
    if (crown.current) {
      crown.current.rotation.y = t * 0.8;
      crown.current.rotation.x = t * 0.5;
      crown.current.position.y = (SLAB_COUNT / 2) * spread + 0.55 + Math.sin(t * 1.2) * 0.08 + (1 - crownK) * 1.2;
      crown.current.scale.setScalar(Math.max(crownK, 0.001));
    }
    if (crownGlow.current) {
      crownGlow.current.position.y = (SLAB_COUNT / 2) * spread + 0.6 + (1 - crownK) * 1.2;
      crownGlow.current.scale.setScalar(1.6 * crownK + 0.001);
    }
    if (coreLight.current) coreLight.current.intensity = 3 + e * 7 + flash * 7;
    if (spineMaterial.current) spineMaterial.current.opacity = Math.min(0.45 + e * 0.4 + flash * 0.45, 1);
  });

  return (
    <group ref={group} rotation={[0, 0.4, 0]}>
      <primitive ref={envelopeRef} object={envelope} />

      {geometries.map((geometry, i) => (
        <group
          key={i}
          ref={(node) => {
            slabs.current[i] = node;
          }}
          position={[0, (i - (SLAB_COUNT - 1) / 2) * 0.34, 0]}
          rotation={[0, i * TWIST, 0]}
        >
          <mesh geometry={geometry} material={i % 2 === 1 || i === SLAB_COUNT - 1 ? materials.glass : materials.metal} />
          <lineSegments geometry={edges[i]} material={materials.edge} />
        </group>
      ))}

      {/* Spine: the core everything is assembled around. */}
      <mesh>
        <cylinderGeometry args={[0.022, 0.022, 3.6, 10, 1, true]} />
        <meshBasicMaterial ref={spineMaterial} color={CYAN} transparent opacity={0.5} toneMapped={false} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={coreLight} color={CYAN} intensity={3} distance={5} decay={2} />

      {/* Crown: the idea at the top of the build. */}
      <mesh ref={crown} position={[0, 2.1, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={CYAN_SOFT} emissive={CYAN} emissiveIntensity={0.55} metalness={0.5} roughness={0.15} flatShading envMapIntensity={2} />
      </mesh>
      <sprite ref={crownGlow} position={[0, 2.15, 0]} scale={1.6}>
        <spriteMaterial map={texture} color={CYAN} transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Orbit rings with travelling nodes                                          */
/* -------------------------------------------------------------------------- */

interface RingSpec {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
  nodes: number[];
}

const RINGS: RingSpec[] = [
  { radius: 2.05, rotation: [1.28, 0.1, 0.18], speed: 0.22, color: CYAN, opacity: 0.4, nodes: [0, Math.PI] },
  { radius: 2.6, rotation: [1.08, 0.42, -0.32], speed: -0.14, color: VIOLET, opacity: 0.36, nodes: [1.2] },
  { radius: 3.3, rotation: [1.42, -0.24, 0.5], speed: 0.09, color: CYAN_SOFT, opacity: 0.2, nodes: [0.4, 2.5, 4.4] },
];

function OrbitRings({ animate, texture }: { animate: boolean; texture: CanvasTexture }) {
  const spinners = useRef<(Group | null)[]>([]);
  const holders = useRef<(Group | null)[]>([]);
  const lineRefs = useRef<(Line | null)[]>([]);

  // Built as THREE.Line objects (the JSX <line> tag collides with SVG's).
  const lines = useMemo(
    () =>
      RINGS.map((ring) => {
        const points: number[] = [];
        const segments = 192;
        for (let i = 0; i <= segments; i++) {
          const a = (i / segments) * Math.PI * 2;
          points.push(Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0);
        }
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
        const material = new LineBasicMaterial({
          color: ring.color,
          transparent: true,
          opacity: ring.opacity,
          blending: AdditiveBlending,
          depthWrite: false,
        });
        return new Line(geometry, material);
      }),
    [],
  );
  useEffect(
    () => () =>
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as LineBasicMaterial).dispose();
      }),
    [lines],
  );

  useFrame((state, delta) => {
    const since = introElapsed(state.clock.elapsedTime, animate);
    holders.current.forEach((holder, i) => {
      if (!holder) return;
      const k = easeOutQuart(clamp01((since - 0.2 - i * 0.25) / 1.4));
      holder.scale.setScalar(0.55 + 0.45 * k);
      const line = lineRefs.current[i];
      if (line) (line.material as LineBasicMaterial).opacity = RINGS[i]!.opacity * k;
      holder.visible = k > 0.01;
    });
    if (!animate) return;
    const boost = 1 + heroEnergyTarget() * 1.5 + Math.max(0, 1 - since / 2.5) * 3;
    spinners.current.forEach((spinner, i) => {
      const ring = RINGS[i];
      if (spinner && ring) spinner.rotation.z += delta * ring.speed * boost;
    });
  });

  return (
    <>
      {RINGS.map((ring, i) => (
        <group key={i} rotation={ring.rotation}>
          <group
            ref={(node) => {
              holders.current[i] = node;
            }}
          >
          <group
            ref={(node) => {
              spinners.current[i] = node;
            }}
          >
            <primitive
              ref={(node: Line | null) => {
                lineRefs.current[i] = node;
              }}
              object={lines[i]!}
            />
            {ring.nodes.map((angle, j) => (
              <group key={j} position={[Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0]}>
                <mesh>
                  <sphereGeometry args={[0.035, 12, 12]} />
                  <meshBasicMaterial color={ring.color} toneMapped={false} />
                </mesh>
                <sprite scale={0.42}>
                  <spriteMaterial map={texture} color={ring.color} transparent opacity={0.8} blending={AdditiveBlending} depthWrite={false} />
                </sprite>
              </group>
            ))}
          </group>
          </group>
        </group>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Fragments: components drifting in orbit around the build                   */
/* -------------------------------------------------------------------------- */

function Fragments({ count, animate }: { count: number; animate: boolean }) {
  const dark = useRef<InstancedMesh>(null);
  const lit = useRef<InstancedMesh>(null);
  const scratch = useRef<Object3D | null>(null);

  const items = useMemo(() => {
    const rand = mulberry32(1189);
    return Array.from({ length: count }, (_, i) => {
      const radius = 3 + rand() * 3.4;
      const theta = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * 4.2;
      return {
        radius,
        theta,
        y,
        speed: (0.025 + rand() * 0.05) * (rand() > 0.5 ? 1 : -1),
        spin: 0.2 + rand() * 0.8,
        scale: 0.55 + rand() * 1.1,
        lit: i % 4 === 0,
        phase: rand() * Math.PI * 2,
      };
    });
  }, [count]);

  const darkItems = useMemo(() => items.filter((item) => !item.lit), [items]);
  const litItems = useMemo(() => items.filter((item) => item.lit), [items]);

  const geometries = useMemo(() => ({ oct: new OctahedronGeometry(0.09, 0), tet: new TetrahedronGeometry(0.075, 0) }), []);
  const materials = useMemo(
    () => ({
      dark: new MeshStandardMaterial({ color: "#121a30", metalness: 0.9, roughness: 0.3, flatShading: true, envMapIntensity: 1.4 }),
      lit: new MeshBasicMaterial({ color: new Color(CYAN), transparent: true, opacity: 0.75 }),
    }),
    [],
  );
  useEffect(
    () => () => {
      geometries.oct.dispose();
      geometries.tet.dispose();
      materials.dark.dispose();
      materials.lit.dispose();
    },
    [geometries, materials],
  );

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0;
    scratch.current ??= new Object3D();
    const dummy = scratch.current;
    const layers: [InstancedMesh | null, typeof items][] = [
      [dark.current, darkItems],
      [lit.current, litItems],
    ];
    for (const [mesh, list] of layers) {
      if (!mesh) continue;
      for (let i = 0; i < list.length; i++) {
        const item = list[i]!;
        const a = item.theta + t * item.speed;
        dummy.position.set(Math.cos(a) * item.radius, item.y + Math.sin(t * 0.6 + item.phase) * 0.12, Math.sin(a) * item.radius - 1);
        dummy.rotation.set(t * item.spin, t * item.spin * 0.7, item.phase);
        dummy.scale.setScalar(item.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={dark} args={[geometries.oct, materials.dark, darkItems.length]} frustumCulled={false} />
      <instancedMesh ref={lit} args={[geometries.tet, materials.lit, litItems.length]} frustumCulled={false} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Blueprint floor: a construction grid with a slow scanning pulse            */
/* -------------------------------------------------------------------------- */

const floorVertex = /* glsl */ `
  varying vec2 vPos;
  #include <fog_pars_vertex>
  void main() {
    vPos = position.xy;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const floorFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uTime;
  uniform float uReveal;
  varying vec2 vPos;
  #include <fog_pars_fragment>

  float gridLine(vec2 p, float spacing, float width) {
    vec2 coord = p / spacing;
    vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    return 1.0 - min(min(g.x, g.y) / width, 1.0);
  }

  void main() {
    float d = length(vPos);
    float minor = gridLine(vPos, 0.5, 1.0) * 0.28;
    float major = gridLine(vPos, 2.5, 1.2) * 0.65;
    float fade = 1.0 - smoothstep(1.5, 11.0, d);

    float pulse = fract(uTime * 0.09);
    float ring = (1.0 - smoothstep(0.0, 0.06, abs(d - pulse * 11.0))) * (1.0 - pulse) * 0.8;
    float footprint = (1.0 - smoothstep(0.0, 0.025, abs(d - 1.55))) * 0.6;

    float reveal = 1.0 - smoothstep(uReveal - 2.0, uReveal, d);
    float alpha = ((max(minor, major) * fade) * 0.55 + (ring + footprint) * fade) * reveal;
    vec3 color = mix(uColor, uAccent, ring);
    gl_FragColor = vec4(color, alpha);
    #include <fog_fragment>
  }
`;

function BlueprintFloor({ animate }: { animate: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(CYAN) },
      uAccent: { value: new Color(CYAN_SOFT) },
      uTime: { value: 0 },
      uReveal: { value: 14 },
      fogColor: { value: new Color("#050711") },
      fogNear: { value: 9 },
      fogFar: { value: 24 },
    }),
    [],
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    if (animate) m.uniforms.uTime!.value = state.clock.elapsedTime;
    const since = introElapsed(state.clock.elapsedTime, animate);
    m.uniforms.uReveal!.value = 16 * easeOutQuart(clamp01(since / 1.8));
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -2.25, 0]}>
      <planeGeometry args={[26, 26, 1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={floorVertex}
        fragmentShader={floorFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        fog
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Star field                                                                 */
/* -------------------------------------------------------------------------- */

function StarField({ count, texture, animate }: { count: number; texture: CanvasTexture; animate: boolean }) {
  const points = useRef<Group>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(42);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new Color(CYAN), new Color(VIOLET), new Color("#ffffff"), new Color(CYAN_SOFT)];
    for (let i = 0; i < count; i++) {
      const r = 6 + rand() * 14;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 6;
      const c = palette[Math.floor(rand() * palette.length)]!;
      const dim = 0.35 + rand() * 0.65;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (points.current && animate) points.current.rotation.y += delta * 0.012;
  });

  return (
    <group ref={points}>
      <points geometry={geometry}>
        <pointsMaterial
          map={texture}
          size={0.09}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
