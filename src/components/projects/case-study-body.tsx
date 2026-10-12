import type { ReactNode } from "react";
import Image from "next/image";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ProjectLinks } from "./project-links";

type Level = 2 | 3;

function Heading({ level, className, children }: { level: Level; className?: string; children: ReactNode }) {
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag className={className}>{children}</Tag>;
}

function Section({ title, level, children }: { title: string; level: Level; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <Heading level={level} className="eyebrow mb-3 text-cyan-soft">
        {title}
      </Heading>
      {children}
    </section>
  );
}

/**
 * The full case study: narrative, engineering decisions, facts sidebar and
 * gallery. Shared by the quick-view dialog and the /work/[slug] pages.
 */
/** `level` is the heading level for section titles: 2 on its own page, 3 inside the dialog. */
export function CaseStudyBody({ project, className, level = 3 }: { project: Project; className?: string; level?: Level }) {
  const SubHeading = level === 2 ? "h3" : "h4";
  const study = project.caseStudy;
  if (!study) return null;

  return (
    <div className={className}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={project.status} />
              {project.status.note && <span className="text-xs text-subtle">{project.status.note}</span>}
            </div>
            <p className="mt-5 text-[1.12rem] leading-relaxed text-fg/90">{study.overview}</p>
          </div>

          <Section level={level} title="The problem">
            <p className="leading-relaxed text-muted">{study.problem}</p>
          </Section>

          <Section level={level} title="My role">
            <p className="leading-relaxed text-muted">{study.role}</p>
          </Section>

          <Section level={level} title="Technical approach">
            <ul className="space-y-3">
              {study.approach.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-muted">
                  <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section level={level} title="Engineering decisions">
            <div className="grid gap-4 sm:grid-cols-2">
              {study.decisions.map((decision) => (
                <div key={decision.title} className="surface rounded-2xl p-5">
                  <SubHeading className="font-semibold tracking-[-0.01em]">{decision.title}</SubHeading>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{decision.body}</p>
                </div>
              ))}
            </div>
          </Section>

          {study.capabilities && (
            <Section
              level={level}
              title={study.capabilities.experimental?.length || study.capabilities.planned?.length ? "What's shipped vs. in progress" : "What's shipped"}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ["Implemented", study.capabilities.implemented, "text-signal-green"],
                    ["Experimental", study.capabilities.experimental, "text-signal-amber"],
                    ["Planned", study.capabilities.planned, "text-violet-soft"],
                  ] as const
                )
                  .filter(([, items]) => items && items.length > 0)
                  .map(([label, items, tone]) => (
                    <div key={label}>
                      <p className={cn("font-mono text-[0.68rem] uppercase tracking-[0.16em]", tone)}>{label}</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted">
                        {items!.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </Section>
          )}

          <Section level={level} title="Status">
            <p className="leading-relaxed text-muted">{study.statusDetail}</p>
          </Section>
        </div>

        <aside className="space-y-8 lg:col-span-4" aria-label="Project details">
          <div className="surface rounded-2xl p-5">
            <dl className="space-y-4 text-sm">
              {project.publisher && (
                <div>
                  <dt className="eyebrow text-[0.62rem]">Published as</dt>
                  <dd className="mt-1 text-fg/90">{project.publisher}</dd>
                </div>
              )}
              {project.updated && (
                <div>
                  <dt className="eyebrow text-[0.62rem]">Last release</dt>
                  <dd className="mt-1 text-fg/90">{formatDate(project.updated)}</dd>
                </div>
              )}
              {project.year && !project.updated && (
                <div>
                  <dt className="eyebrow text-[0.62rem]">Year</dt>
                  <dd className="mt-1 text-fg/90">{project.year}</dd>
                </div>
              )}
              <div>
                <dt className="eyebrow mb-2 text-[0.62rem]">Stack</dt>
                <dd>
                  <TagList items={project.stack} label={`${project.name} technology`} />
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col gap-2.5">
              <ProjectLinks links={project.links} projectName={project.name} className="w-full" />
            </div>
          </div>

          {project.video && (
            <figure>
              <video
                controls
                playsInline
                preload="none"
                poster={project.video.poster}
                width={project.video.width}
                height={project.video.height}
                className="mx-auto max-h-[70vh] w-auto rounded-2xl border border-line bg-black"
              >
                <source src={project.video.src} type="video/mp4" />
              </video>
              <figcaption className="mt-2 text-xs text-subtle">
                {project.video.caption}
                {project.video.hasAudio && " Contains music — sound starts only when you press play."}
              </figcaption>
            </figure>
          )}
        </aside>
      </div>

      {project.gallery.length > 0 && (
        <section aria-label={`${project.name} gallery`} className="mt-12 border-t border-line pt-8">
          <Heading level={level} className="eyebrow mb-5 text-cyan-soft">
            Gallery
          </Heading>
          <ul className="scrollbar-none -mx-[var(--case-gutter,0px)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--case-gutter,0px)] pb-2">
            {project.gallery.map((image) => {
              const portrait = image.height > image.width;
              return (
                <li key={image.src} className="shrink-0 snap-start">
                  <figure className={portrait ? "w-[11.5rem] sm:w-[13rem]" : "w-[min(78vw,30rem)]"}>
                    <div className={cn("relative overflow-hidden rounded-xl border border-line bg-ink-950", portrait ? "aspect-[9/19]" : "aspect-[16/10]")}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={portrait ? "208px" : "(min-width: 640px) 480px, 78vw"}
                        className="object-cover object-top"
                      />
                    </div>
                    <figcaption className="mt-2.5 text-xs leading-snug text-muted">
                      <span
                        className={cn(
                          "mr-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em]",
                          image.kind === "promo" ? "text-violet-soft" : "text-signal-green",
                        )}
                      >
                        {image.kind === "promo" ? "Artwork" : "Screenshot"}
                      </span>
                      {image.caption ?? image.alt}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
