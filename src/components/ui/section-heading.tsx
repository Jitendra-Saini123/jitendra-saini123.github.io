import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  /** Chapter number, e.g. "01". */
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  align?: "left" | "split";
  className?: string;
}

/**
 * Chapter header used by every section: a numbered instrument label, a large
 * title, and an optional intro that sits beside the title on wide screens.
 */
export function SectionHeading({ index, label, title, intro, id, align = "split", className }: SectionHeadingProps) {
  return (
    <header className={cn("mb-12 md:mb-16", className)}>
      <Reveal>
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-cyan">{index}</span>
          <span aria-hidden className="h-px w-10 bg-line-strong" />
          <span>{label}</span>
        </p>
      </Reveal>
      <div className={cn("grid gap-6", align === "split" && "lg:grid-cols-12 lg:items-end lg:gap-10")}>
        <Reveal delay={0.05} className={cn(align === "split" && "lg:col-span-7")}>
          <h2 id={id} className="text-display text-[clamp(2.25rem,5.4vw,4.4rem)]">
            {title}
          </h2>
        </Reveal>
        {intro && (
          <Reveal delay={0.12} className={cn(align === "split" ? "lg:col-span-5 lg:pb-2" : "max-w-2xl")}>
            <div className="text-[1.02rem] leading-relaxed text-muted">{intro}</div>
          </Reveal>
        )}
      </div>
    </header>
  );
}
