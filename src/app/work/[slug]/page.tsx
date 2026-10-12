import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { caseStudyOgImage } from "@/lib/social-image";
import { ProjectStage } from "@/components/projects/project-visual";
import { ProjectLinks } from "@/components/projects/project-links";
import { CaseStudyBody } from "@/components/projects/case-study-body";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { StatusBadge } from "@/components/ui/status-badge";

export const dynamicParams = false;

const caseStudies = projects.filter((project) => project.caseStudy);

export function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} — Case study`;
  const image = caseStudyOgImage(project.slug, project.name);
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${title} | ${siteConfig.name}`,
      description: project.summary,
      siteName: siteConfig.brand,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [image] },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = caseStudies.findIndex((p) => p.slug === slug);
  const project = caseStudies[index];
  if (!project) notFound();
  const next = caseStudies[(index + 1) % caseStudies.length]!;
  const number = String(projects.indexOf(project) + 1).padStart(2, "0");

  return (
    <article className="relative">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(70%_60%_at_70%_20%,rgb(69_217_255/0.08),transparent_70%)]" />

      <header className="container-page pt-[calc(var(--header-height)+3rem)] md:pt-[calc(var(--header-height)+5rem)]">
        <Link href="/#work" className="group inline-flex items-center gap-2 rounded-full text-sm text-muted transition-colors hover:text-fg">
          <ArrowLeft aria-hidden size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          All work
        </Link>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3">
              <span className="text-cyan">{number}</span>
              <span aria-hidden className="h-px w-10 bg-line-strong" />
              <span>Case study</span>
            </p>
            <div className="mt-6 flex items-center gap-4">
              {project.icon && (
                <Image src={project.icon.src} alt="" width={64} height={64} preload className="size-14 rounded-2xl border border-white/10 object-cover" />
              )}
              <h1 className="text-display text-[clamp(2.4rem,5vw,4.2rem)]">{project.name}</h1>
            </div>
            <p className="eyebrow mt-5 text-[0.66rem]">{project.category}</p>
            <p className="mt-6 text-[1.08rem] leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-6">
              <StatusBadge status={project.status} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ProjectLinks links={project.links} projectName={project.name} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProjectStage project={project} index={number} />
          </div>
        </div>
      </header>

      {(project.architecture || project.metrics) && (
        <section aria-labelledby="built-title" className="container-page mt-20 md:mt-28">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 id="built-title" className="text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-[-0.03em]">
              How it&rsquo;s built
            </h2>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-subtle">From the project&rsquo;s source code</p>
          </div>
          {project.architecture && <ArchitectureDiagram architecture={project.architecture} accent={project.accent} />}
          {project.metrics && (
            <dl className={`grid grid-cols-2 border-l border-t border-line ${project.metrics.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} ${project.architecture ? "mt-10" : ""}`}>
              {project.metrics.map((metric) => (
                <div key={metric.label} className="border-b border-r border-line p-5">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block text-[2rem] font-semibold leading-none tracking-[-0.04em]">{metric.value}</span>
                    <span aria-hidden className="mt-3 block text-[0.82rem] leading-snug text-subtle">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}

      <div className="container-page mt-20 md:mt-28">
        <CaseStudyBody project={project} level={2} />
      </div>

      <nav aria-label="More case studies" className="container-page mt-24 pb-24 md:mt-32">
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col gap-4 border-y border-line py-10 transition-colors hover:border-cyan/40 sm:flex-row sm:items-end sm:justify-between"
        >
          <span>
            <span className="eyebrow block">Next case study</span>
            <span className="mt-3 block text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-none tracking-[-0.04em] transition-colors group-hover:text-cyan-soft">
              {next.name}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-fg">
            {next.category}
            <ArrowRight aria-hidden size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </nav>
    </article>
  );
}
