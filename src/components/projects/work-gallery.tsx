"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project, ProjectFilter } from "@/types";
import { countByFilter, filterProjects, projectFilters } from "@/lib/projects";
import { cn } from "@/lib/cn";
import { FeaturedProject } from "./featured-project";
import { ProjectCard } from "./project-card";
import { ClientProject } from "./client-project";
import { ProjectDialog } from "./project-dialog";

const EASE = [0.16, 1, 0.3, 1] as const;

const itemMotion = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" as const } },
};

function GroupHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-2 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
      <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
      {note && <p className="max-w-md text-sm text-subtle sm:text-right">{note}</p>}
    </div>
  );
}

export function WorkGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const counts = useMemo(() => countByFilter(projects), [projects]);
  const visible = useMemo(() => filterProjects(projects, filter), [projects, filter]);
  const featured = visible.filter((p) => p.tier === "featured");
  const more = visible.filter((p) => p.tier === "more");
  const client = visible.filter((p) => p.tier === "client");
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;
  const activeLabel = projectFilters.find((f) => f.id === filter)?.label ?? "All";

  return (
    <>
      <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter projects by platform" className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1">
          <div className="flex gap-1 rounded-full border border-line bg-ink-900/70 p-1">
            {projectFilters.map((option) => {
              const active = option.id === filter;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    "relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-300",
                    active ? "text-ink-950" : "text-muted hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter-pill"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{option.label}</span>
                  <span className={cn("relative font-mono text-[0.68rem]", active ? "text-ink-950/60" : "text-subtle")}>
                    {counts[option.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p aria-live="polite" className="font-mono text-xs text-subtle">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          {filter !== "all" && ` · ${activeLabel}`}
        </p>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {featured.length > 0 && (
          <motion.div key="featured" layout className="space-y-24 md:space-y-32" {...itemMotion}>
            <AnimatePresence mode="popLayout" initial={false}>
              {featured.map((project) => (
                <motion.div key={project.slug} layout {...itemMotion}>
                  <FeaturedProject project={project} index={projects.indexOf(project)} onOpen={setOpenSlug} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {more.length > 0 && (
          <motion.div key="more" layout className="mt-28 md:mt-36" {...itemMotion}>
            <GroupHeading title="More products" note="Shipped and maintained on my own — utilities, media and developer products." />
            <div className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {more.map((project) => (
                  <motion.div key={project.slug} layout {...itemMotion}>
                    <ProjectCard project={project} onOpen={setOpenSlug} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {client.length > 0 && (
          <motion.div key="client" layout className="mt-24 md:mt-28" {...itemMotion}>
            <GroupHeading
              title="Professional work"
              note="Built as a Flutter Developer at Sublimity Softwares for international clients. Shown with public store listings only."
            />
            <div className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {client.map((project, i) => (
                  <motion.div key={project.slug} layout {...itemMotion}>
                    <ClientProject project={project} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectDialog project={openProject} onClose={() => setOpenSlug(null)} />
    </>
  );
}
