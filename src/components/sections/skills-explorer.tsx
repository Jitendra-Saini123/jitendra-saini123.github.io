"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SkillDepth, SkillGroup } from "@/types";
import { depthMeta } from "@/data/skills";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const W = 1000;
const H = 440;
const HUB = { x: W / 2, y: H / 2 };
const RX = 270;
const RY = 158;

function nodePositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (i / count) * Math.PI * 2 + 0.22;
    return { x: HUB.x + Math.cos(angle) * RX, y: HUB.y + Math.sin(angle) * RY };
  });
}

export function DepthMarker({ depth, className }: { depth: SkillDepth; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2.5 shrink-0 rounded-full",
        depth === "production" && "bg-cyan shadow-[0_0_10px_rgb(69_217_255/0.7)]",
        depth === "shipped" && "bg-violet",
        depth === "exploring" && "border border-dashed border-muted",
        className,
      )}
    />
  );
}

function Constellation({ group, activeIndex, onHover }: { group: SkillGroup; activeIndex: number; onHover: (i: number) => void }) {
  const positions = nodePositions(group.skills.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden focusable="false">
      <defs>
        <radialGradient id="hub-glow">
          <stop offset="0%" stopColor="#45d9ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#45d9ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={HUB.x} cy={HUB.y} rx={RX} ry={RY} fill="none" stroke="rgb(162 172 194 / 0.12)" strokeDasharray="3 7" />
      <ellipse cx={HUB.x} cy={HUB.y} rx={170} ry={90} fill="none" stroke="rgb(162 172 194 / 0.08)" />
      <circle cx={HUB.x} cy={HUB.y} r={120} fill="url(#hub-glow)" />

      <AnimatePresence mode="wait">
        <motion.g key={group.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          {positions.map((p, i) => {
            const active = i === activeIndex;
            return (
              <motion.line
                key={`l-${i}`}
                x1={HUB.x}
                y1={HUB.y}
                x2={p.x}
                y2={p.y}
                stroke={active ? "#45d9ff" : "rgb(162 172 194 / 0.22)"}
                strokeWidth={active ? 1.4 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.04 }}
              />
            );
          })}

          {positions.map((p, i) => {
            const skill = group.skills[i]!;
            const active = i === activeIndex;
            const anchor = p.x < HUB.x - 40 ? "end" : p.x > HUB.x + 40 ? "start" : "middle";
            const dx = anchor === "end" ? -16 : anchor === "start" ? 16 : 0;
            const dy = anchor === "middle" ? (p.y < HUB.y ? -18 : 28) : 5;
            return (
              <motion.g
                key={`n-${i}`}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                onPointerEnter={() => onHover(i)}
                className="cursor-pointer"
              >
                {active && <circle cx={p.x} cy={p.y} r={20} fill="rgb(69 217 255 / 0.12)" />}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 8 : 6.5}
                  fill={skill.depth === "production" ? "#45d9ff" : skill.depth === "shipped" ? "#8b70ff" : "#050711"}
                  stroke={skill.depth === "exploring" ? "#a2acc2" : "none"}
                  strokeDasharray={skill.depth === "exploring" ? "2 2" : undefined}
                  strokeWidth={1.5}
                />
                <text
                  x={p.x + dx}
                  y={p.y + dy}
                  textAnchor={anchor}
                  className={cn("hidden font-mono sm:block", active ? "fill-fg" : "fill-muted")}
                  fontSize={17}
                >
                  {skill.name}
                </text>
              </motion.g>
            );
          })}

          <g>
            <circle cx={HUB.x} cy={HUB.y} r={46} fill="#0a1020" stroke="rgb(69 217 255 / 0.5)" />
            <text x={HUB.x} y={HUB.y + 5} textAnchor="middle" className="fill-fg font-sans" fontSize={15} fontWeight={600}>
              {group.short}
            </text>
          </g>
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

export function SkillsExplorer({ groups }: { groups: SkillGroup[] }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [skillIndex, setSkillIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const group = groups[groupIndex]!;
  const activeSkill = group.skills[skillIndex] ?? group.skills[0]!;

  const selectGroup = (index: number) => {
    setGroupIndex(index);
    setSkillIndex(0);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = groups.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = groupIndex === last ? 0 : groupIndex + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = groupIndex === 0 ? last : groupIndex - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    selectGroup(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div
        role="tablist"
        aria-label="Skill areas"
        aria-orientation="vertical"
        className="scrollbar-none -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {groups.map((g, i) => {
          const selected = i === groupIndex;
          return (
            <button
              key={g.id}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              role="tab"
              id={`${baseId}-tab-${g.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectGroup(i)}
              onKeyDown={onTabKeyDown}
              className={cn(
                "group relative shrink-0 rounded-2xl border px-5 py-4 text-left transition-colors duration-300 lg:py-5",
                selected ? "border-cyan/40 bg-cyan/[0.05]" : "border-line hover:border-line-strong",
              )}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-mono text-[0.66rem] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[0.66rem] text-subtle">{g.skills.length} skills</span>
              </span>
              <span className={cn("mt-2 block whitespace-nowrap font-semibold tracking-[-0.02em] lg:text-lg", selected ? "text-fg" : "text-muted")}>
                {g.title}
              </span>
              <span className="mt-1.5 hidden text-sm leading-snug text-subtle lg:block">{g.description}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${group.id}`}
        className="surface relative overflow-hidden rounded-[1.75rem] lg:col-span-8"
      >
        <div aria-hidden className="grid-backdrop absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]" />
        <div className="relative px-3 pt-4 sm:px-6 sm:pt-6">
          <Constellation group={group} activeIndex={skillIndex} onHover={setSkillIndex} />
        </div>

        <div className="relative border-t border-line p-5 sm:p-7">
          <p className="mb-4 text-sm text-muted lg:hidden">{group.description}</p>
          <ul className="flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
            {group.skills.map((skill, i) => {
              const active = i === skillIndex;
              return (
                <li key={skill.name}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSkillIndex(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setSkillIndex(i)}
                    onFocus={() => setSkillIndex(i)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200",
                      active ? "border-cyan/50 bg-cyan/[0.08] text-fg" : "border-line text-muted hover:border-line-strong hover:text-fg",
                    )}
                  >
                    <DepthMarker depth={skill.depth} />
                    {skill.name}
                    <span className="sr-only"> — {depthMeta[skill.depth].label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div aria-live="polite" className="mt-6 min-h-[4.5rem] rounded-2xl border border-line bg-ink-950/60 p-4 sm:p-5">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold">{activeSkill.name}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-subtle">
                <DepthMarker depth={activeSkill.depth} className="size-2" />
                {depthMeta[activeSkill.depth].label}
              </span>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{activeSkill.evidence}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
