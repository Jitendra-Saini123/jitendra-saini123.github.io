"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { buttonClasses } from "@/components/ui/button-link";
import { cn } from "@/lib/cn";
import { ProjectStage } from "./project-visual";
import { ProjectLinks } from "./project-links";

interface FeaturedProjectProps {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}

export function FeaturedProject({ project, index, onOpen }: FeaturedProjectProps) {
  const number = String(index + 1).padStart(2, "0");
  const flip = index % 2 === 1;
  const headingId = `project-${project.slug}-title`;

  return (
    <article aria-labelledby={headingId} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <ProjectStage project={project} index={number} />
      </div>

      <div className={cn("lg:col-span-5", flip && "lg:order-1")}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-cyan">{number}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="eyebrow text-[0.66rem]">{project.category}</span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          {project.icon && (
            <Image
              src={project.icon.src}
              alt=""
              width={56}
              height={56}
              className="size-12 rounded-[0.9rem] border border-white/10 object-cover sm:size-14"
            />
          )}
          <h3 id={headingId} className="text-[clamp(1.9rem,3.4vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            {project.name}
          </h3>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge status={project.status} />
          {project.status.note && <span className="text-xs text-subtle">{project.status.note}</span>}
        </div>

        <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">{project.summary}</p>

        <ul className="mt-6 space-y-2.5">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-[0.92rem] leading-snug text-fg/90">
              <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-cyan" />
              {highlight}
            </li>
          ))}
        </ul>

        <TagList items={project.stack} label={`${project.name} technology`} max={7} className="mt-7" />

        <div className="mt-8 flex flex-wrap gap-3">
          {project.caseStudy && (
            <button
              type="button"
              onClick={() => onOpen(project.slug)}
              aria-haspopup="dialog"
              className={buttonClasses("primary", "md")}
            >
              Read case study
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
