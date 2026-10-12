"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { buttonClasses } from "@/components/ui/button-link";
import { ProjectLinks } from "./project-links";

/** Secondary products: a banner-led card. */
export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const cover = project.visual.images[0];
  const headingId = `project-${project.slug}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className="group/card flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-ink-900/60 transition-colors duration-500 hover:border-line-strong"
    >
      {cover && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 92vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover/card:scale-[1.03]"
          />
          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-ink-950/75 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
            {cover.kind === "promo" ? "Promotional artwork" : "Screenshot"}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="eyebrow text-[0.64rem]">{project.category}</p>
        <div className="mt-3 flex items-center gap-3">
          {project.icon && (
            <Image src={project.icon.src} alt="" width={40} height={40} className="size-10 rounded-xl border border-white/10 object-cover" />
          )}
          <h3 id={headingId} className="text-2xl font-semibold tracking-[-0.03em]">
            {project.name}
          </h3>
        </div>
        <div className="mt-4">
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{project.summary}</p>
        <TagList items={project.stack} label={`${project.name} technology`} max={5} className="mt-5" />

        <div className="mt-auto flex flex-wrap gap-3 pt-7">
          {project.caseStudy && (
            <button type="button" onClick={() => onOpen(project.slug)} aria-haspopup="dialog" className={buttonClasses("primary", "md")}>
              Case study
              <span className="sr-only">: {project.name}</span>
              <ArrowRight aria-hidden size={16} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </button>
          )}
          <ProjectLinks links={project.links} projectName={project.name} />
        </div>
      </div>
    </article>
  );
}
