import type { ProjectStatus } from "@/types";
import { cn } from "@/lib/cn";

const tone: Record<ProjectStatus["kind"], string> = {
  live: "text-signal-green border-signal-green/30 bg-signal-green/[0.07]",
  "early-access": "text-cyan border-cyan/30 bg-cyan/[0.07]",
  "in-development": "text-signal-amber border-signal-amber/30 bg-signal-amber/[0.07]",
  "source-product": "text-violet-soft border-violet/35 bg-violet/[0.08]",
  client: "text-muted border-line-strong bg-white/[0.03]",
};

const dot: Record<ProjectStatus["kind"], string> = {
  live: "bg-signal-green",
  "early-access": "bg-cyan",
  "in-development": "bg-signal-amber",
  "source-product": "bg-violet-soft",
  client: "bg-muted",
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em]",
        tone[status.kind],
        className,
      )}
    >
      <span aria-hidden className="relative flex size-1.5">
        {(status.kind === "live" || status.kind === "early-access") && (
          <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden", dot[status.kind])} />
        )}
        <span className={cn("relative inline-flex size-1.5 rounded-full", dot[status.kind])} />
      </span>
      <span className="sr-only">Status: </span>
      {status.label}
    </span>
  );
}
