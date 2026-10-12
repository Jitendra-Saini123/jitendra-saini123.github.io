import Link from "next/link";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import { experience } from "@/data/experience";
import type { ExperienceEntry } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag-list";
import { buttonClasses } from "@/components/ui/button-link";
import { cn } from "@/lib/cn";
import { externalLinkProps, isUsableUrl } from "@/lib/links";

const kindLabel: Record<ExperienceEntry["kind"], string> = {
  "full-time": "Full-time",
  independent: "Independent",
  internship: "Internship",
  education: "Education",
};

function Entry({ entry }: { entry: ExperienceEntry }) {
  const major = entry.kind === "full-time" || entry.kind === "independent";
  return (
    <li className="relative grid gap-4 pb-14 pl-8 last:pb-0 md:grid-cols-12 md:gap-10 md:pl-0">
      {/* Timeline rail and node */}
      <span aria-hidden className="absolute left-[5px] top-2 h-full w-px bg-line md:left-[calc(25%-0.5px)]" />
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1.5 size-[11px] rounded-full border md:left-[calc(25%-5.5px)]",
          major ? "border-cyan bg-cyan/30 shadow-[0_0_12px_rgb(69_217_255/0.6)]" : "border-line-strong bg-ink-950",
        )}
      />

      <div className="md:col-span-3 md:pr-10 md:text-right">
        <p className="font-mono text-sm text-fg/90">
          {entry.start} — {entry.end}
        </p>
        <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-subtle">{kindLabel[entry.kind]}</p>
      </div>

      <div className="md:col-span-9 md:pl-6">
        <Reveal>
          <h3 className={cn("font-semibold tracking-[-0.025em]", major ? "text-[1.6rem] leading-tight" : "text-xl")}>{entry.role}</h3>
          <p className="mt-1 text-muted">
            {entry.organization}
            {entry.location && <span className="text-subtle"> · {entry.location}</span>}
          </p>
          {entry.summary && <p className="mt-5 max-w-3xl leading-relaxed text-fg/85">{entry.summary}</p>}
        </Reveal>

        {entry.products && entry.products.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {entry.products.map((product, i) => (
              <Reveal as="li" key={product.name} delay={(i % 2) * 0.06} className="surface rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold tracking-[-0.01em]">{product.name}</h4>
                    <p className="mt-0.5 text-xs text-subtle">{product.description}</p>
                  </div>
                  {isUsableUrl(product.href) && (
                    <a
                      href={product.href}
                      {...externalLinkProps}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[0.7rem] text-muted transition-colors hover:border-cyan/60 hover:text-fg"
                    >
                      Play <ArrowUpRight aria-hidden size={12} />
                      <span className="sr-only"> Store listing for {product.name} (opens in a new tab)</span>
                    </a>
                  )}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {product.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span aria-hidden className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-cyan/80" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        )}

        {entry.points && entry.points.length > 0 && (
          <Reveal>
            <ul className="mt-6 space-y-2.5">
              {entry.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-muted">
                  <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-violet-soft" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {entry.stack && <TagList items={entry.stack} label={`Technology used at ${entry.organization}`} className="mt-6" />}
      </div>
    </li>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          index="04"
          label="Experience"
          id="experience-title"
          title={
            <>
              Shipping for clients, <span className="text-muted">then for myself.</span>
            </>
          }
          intro={
            <>
              <p>Three and a half years of production Flutter work for international clients, and a growing portfolio of my own products.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/resume" className={buttonClasses("primary", "md")}>
                  <FileText aria-hidden size={16} />
                  Web résumé
                </Link>
                {siteConfig.resume.enabled && isUsableUrl(siteConfig.resume.href) && (
                  <a href={siteConfig.resume.href} download className={buttonClasses("secondary", "md")}>
                    <Download aria-hidden size={16} />
                    {siteConfig.resume.label}
                    <span className="text-xs text-subtle">PDF</span>
                  </a>
                )}
              </div>
            </>
          }
        />

        <ol className="relative">
          {experience.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))}
        </ol>
      </div>
    </section>
  );
}
