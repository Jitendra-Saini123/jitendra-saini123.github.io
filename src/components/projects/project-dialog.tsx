"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/types";
import { CaseStudyBody } from "./case-study-body";

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Quick-view case study in a native modal <dialog>: the browser provides focus
 * trapping, Escape to close, an inert background and focus restoration.
 * Each case study also has its own shareable page at /work/[slug].
 */
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (project && !el.open) {
      el.showModal();
      el.scrollTop = 0;
    } else if (!project && el.open) {
      el.close();
    }
  }, [project]);

  const titleId = project ? `dialog-${project.slug}-title` : undefined;

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="project-dialog m-auto h-[min(92dvh,60rem)] max-h-none w-[min(100%-1.5rem,68rem)] max-w-none overflow-y-auto overscroll-contain rounded-[1.5rem] border border-line-strong bg-ink-900 p-0 text-fg shadow-[0_40px_140px_-30px_rgb(0_0_0/0.95)] sm:w-[min(100%-3rem,68rem)]"
    >
      {project?.caseStudy && (
        <article className="relative">
          <header className="glass sticky top-0 z-10 flex items-center justify-between gap-4 border-x-0 border-t-0 px-5 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              {project.icon && (
                <Image src={project.icon.src} alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl border border-white/10 object-cover" />
              )}
              <div className="min-w-0">
                <p className="eyebrow truncate text-[0.62rem]">{project.category}</p>
                <h2 id={titleId} className="truncate text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                  {project.name}
                </h2>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/work/${project.slug}`}
                className="hidden h-11 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm text-muted transition-colors hover:border-cyan/60 hover:text-fg sm:inline-flex"
              >
                Full page <ArrowUpRight aria-hidden size={14} />
              </Link>
              <form method="dialog">
                <button
                  type="submit"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-cyan/60"
                >
                  <X size={18} aria-hidden />
                  <span className="sr-only">Close case study</span>
                </button>
              </form>
            </div>
          </header>

          <CaseStudyBody project={project} className="px-5 pb-10 pt-8 [--case-gutter:1.25rem] sm:px-8 sm:[--case-gutter:2rem]" />
        </article>
      )}
    </dialog>
  );
}
