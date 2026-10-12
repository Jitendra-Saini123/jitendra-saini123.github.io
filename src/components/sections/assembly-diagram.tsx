"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  type MotionValue,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Scattered start offset and rotation. */
  sx: number;
  sy: number;
  r: number;
  accent?: boolean;
}

const NODES: Node[] = [
  { id: "ui", label: "Interface", x: 260, y: 78, sx: -120, sy: -40, r: -14 },
  { id: "state", label: "State", x: 140, y: 182, sx: -90, sy: 60, r: 18 },
  { id: "routing", label: "Routing", x: 380, y: 182, sx: 110, sy: -70, r: -22 },
  { id: "domain", label: "Domain", x: 260, y: 282, sx: 30, sy: 110, r: 12, accent: true },
  { id: "storage", label: "Offline store", x: 140, y: 382, sx: -130, sy: 40, r: -10 },
  { id: "api", label: "API", x: 380, y: 382, sx: 120, sy: 70, r: 26 },
  { id: "model", label: "AI model", x: 380, y: 466, sx: 60, sy: 40, r: -18 },
];

const EDGES: [string, string][] = [
  ["ui", "state"],
  ["ui", "routing"],
  ["state", "domain"],
  ["routing", "domain"],
  ["domain", "storage"],
  ["domain", "api"],
  ["api", "model"],
  ["storage", "api"],
];

const STAGES = ["Idea", "Prototype", "Product", "Iterating"] as const;

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function DiagramNode({ node, progress, index }: { node: Node; progress: MotionValue<number>; index: number }) {
  const start = 0.04 + index * 0.025;
  const end = 0.32 + index * 0.025;
  const x = useTransform(progress, [start, end], [node.sx, 0]);
  const y = useTransform(progress, [start, end], [node.sy, 0]);
  const rotate = useTransform(progress, [start, end], [node.r, 0]);
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  const w = node.label.length * 8.6 + 34;

  return (
    <motion.g style={{ x, y, rotate, opacity, transformOrigin: `${node.x}px ${node.y}px` }}>
      <rect
        x={node.x - w / 2}
        y={node.y - 19}
        width={w}
        height={38}
        rx={10}
        fill={node.accent ? "rgb(69 217 255 / 0.12)" : "#0d1427"}
        stroke={node.accent ? "rgb(69 217 255 / 0.7)" : "rgb(162 172 194 / 0.3)"}
      />
      <circle cx={node.x - w / 2 + 14} cy={node.y} r={3} fill={node.id === "model" ? "#8b70ff" : "#45d9ff"} />
      <text x={node.x + 6} y={node.y + 5} textAnchor="middle" fontSize={14} className="fill-fg font-mono">
        {node.label}
      </text>
    </motion.g>
  );
}

function Edge({ from, to, progress, index }: { from: Node; to: Node; progress: MotionValue<number>; index: number }) {
  const start = 0.36 + index * 0.025;
  const pathLength = useTransform(progress, [start, start + 0.18], [0, 1]);
  const d = `M ${from.x} ${from.y} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${(from.y + to.y) / 2}, ${to.x} ${to.y}`;
  return <motion.path d={d} fill="none" stroke="rgb(69 217 255 / 0.45)" strokeWidth={1.3} style={{ pathLength }} />;
}

/**
 * An abstract system assembling itself: scattered parts snap into an
 * architecture, get wired together, then enter a release loop.
 * Scroll-driven on large screens; a short timed sequence elsewhere.
 */
export function AssemblyDiagram({ scrollTarget }: { scrollTarget: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const [scrollDriven, setScrollDriven] = useState(false);
  const [stage, setStage] = useState(0);
  const timed = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: ["start 75%", "end 60%"] });
  const progress = scrollDriven && !reduce ? scrollYProgress : timed;
  const loopLength = useTransform(progress, [0.7, 0.92], [0, 1]);
  const loopOpacity = useTransform(progress, [0.68, 0.74], [0, 1]);

  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, amount: 0.4 });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const update = () => setScrollDriven(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce) {
      timed.set(1);
      return;
    }
    if (scrollDriven || !inView) return;
    const controls = animate(timed, 1, { duration: 3.2, ease: [0.45, 0, 0.2, 1] });
    return () => controls.stop();
  }, [reduce, scrollDriven, inView, timed]);

  const updateStage = (value: number) => setStage(value < 0.3 ? 0 : value < 0.6 ? 1 : value < 0.85 ? 2 : 3);
  useMotionValueEvent(scrollYProgress, "change", (v) => scrollDriven && !reduce && updateStage(v));
  useMotionValueEvent(timed, "change", (v) => (!scrollDriven || reduce) && updateStage(v));

  return (
    <div className="surface relative overflow-hidden rounded-[1.75rem] p-4 sm:p-6">
      <div aria-hidden className="grid-backdrop absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_70%_at_50%_50%,black,transparent)]" />
      <div className="relative flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.18em]">
        <span className="text-subtle">system.assemble()</span>
        <span className="flex items-center gap-2 text-cyan" aria-live="polite">
          <span aria-hidden className="size-1.5 rounded-full bg-cyan" />
          <span className="sr-only">Stage: </span>
          {STAGES[stage]}
        </span>
      </div>

      <svg ref={svgRef} viewBox="0 0 520 540" className="relative mt-2 h-auto w-full" aria-hidden focusable="false">
        <motion.ellipse
          cx={260}
          cy={282}
          rx={238}
          ry={248}
          fill="none"
          stroke="rgb(139 112 255 / 0.55)"
          strokeWidth={1.2}
          strokeDasharray="1 0"
          style={{ pathLength: loopLength, opacity: loopOpacity, rotate: -90, transformOrigin: "260px 282px" }}
        />
        {EDGES.map(([a, b], i) => (
          <Edge key={`${a}-${b}`} from={byId[a]!} to={byId[b]!} progress={progress} index={i} />
        ))}
        {NODES.map((node, i) => (
          <DiagramNode key={node.id} node={node} progress={progress} index={i} />
        ))}
        <motion.g style={{ opacity: loopOpacity }}>
          <text x={260} y={22} textAnchor="middle" fontSize={12} className="fill-violet-soft font-mono">
            ship → learn → refine → ship
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
