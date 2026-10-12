"use client";

import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { AssemblyDiagram } from "./assembly-diagram";

const principles = [
  {
    title: "Build first.",
    body: "A working prototype answers questions a document can't. I start with the smallest real version of an idea, put it on a device, and let it tell me what actually matters.",
  },
  {
    title: "Learn deeply.",
    body: "Then I go under the hood — memory limits in PDF conversion, sync that survives bad connectivity, how an LLM fails before I trust it with users. Depth is what turns a demo into software.",
  },
  {
    title: "Iterate relentlessly.",
    body: "Ship, listen, fix, repeat. Store releases, feedback and small refactors compound into products people can rely on — and every release teaches the next one.",
  },
];

export function PhilosophyBody() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div ref={container} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
          <AssemblyDiagram scrollTarget={container} />
        </div>
      </div>

      <ol className="lg:col-span-6">
        {principles.map((principle, i) => (
          <li key={principle.title} className="flex min-h-0 flex-col justify-center border-t border-line py-10 first:border-t-0 first:pt-0 lg:min-h-[52vh] lg:py-16">
            <Reveal>
              <p className="font-mono text-sm text-cyan">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{principle.title}</h3>
              <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-muted">{principle.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
