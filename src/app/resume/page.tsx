import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { siteConfig } from "@/config/site";
import { defaultOgImage } from "@/lib/social-image";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { resume } from "@/data/resume";
import { buttonClasses } from "@/components/ui/button-link";
import { PrintButton } from "./print-button";

const description = `Résumé of ${siteConfig.name} — Flutter developer with ${siteConfig.experienceLabel} of experience shipping production mobile apps.`;

export const metadata: Metadata = {
  title: "Résumé",
  description,
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: "/resume",
    title: `Résumé | ${siteConfig.name}`,
    description,
    siteName: siteConfig.brand,
    images: [defaultOgImage],
  },
};

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-4 border-b border-line pb-2 font-mono text-[0.72rem] font-medium uppercase tracking-[0.2em] text-cyan-soft print:border-neutral-300 print:text-neutral-700">
      {children}
    </h2>
  );
}

/**
 * A plain, printable, ATS-friendly résumé generated from the same data as the
 * rest of the site. Print it (or "Save as PDF") for a clean single-column copy.
 */
export default function ResumePage() {
  const { contact, location, socials } = siteConfig;
  const linkedin = socials.find((s) => s.id === "linkedin");
  const github = socials.find((s) => s.id === "github");
  const selected = projects.filter((p) => p.tier !== "client");

  return (
    <div className="container-page pb-24 pt-[calc(var(--header-height)+3rem)] print:p-0">
      <div className="mx-auto max-w-[52rem]">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/#experience" className="inline-flex items-center gap-2 rounded-full text-sm text-muted transition-colors hover:text-fg">
            <ArrowLeft aria-hidden size={16} /> Back to the portfolio
          </Link>
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            {siteConfig.resume.enabled && (
              <a href={siteConfig.resume.href} download className={buttonClasses("secondary", "md", "h-10")}>
                <Download aria-hidden size={15} /> PDF
              </a>
            )}
          </div>
        </div>

        <article className="resume-doc surface rounded-[1.5rem] p-6 sm:p-10 print:rounded-none print:border-0 print:bg-none print:p-0 print:text-black">
          <header className="border-b border-line pb-6 print:border-neutral-300">
            <h1 className="text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-none tracking-[-0.04em]">{siteConfig.name}</h1>
            <p className="mt-2 text-lg text-muted print:text-neutral-700">Flutter Developer · Mobile Engineer · AI Builder</p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted print:text-neutral-700">
              <span>
                {location.city}, {location.country} ({location.timeZoneLabel})
              </span>
              <a href={`mailto:${contact.email}`} className="hover:text-fg">
                {contact.email}
              </a>
              {linkedin && <a href={linkedin.href} className="hover:text-fg">{linkedin.href.replace(/^https?:\/\/(www\.)?/, "")}</a>}
              {github && <a href={github.href} className="hover:text-fg">{github.href.replace(/^https?:\/\//, "")}</a>}
              {!siteConfig.url.includes("localhost") && (
                <a href={siteConfig.url} className="hover:text-fg">
                  {siteConfig.url.replace(/^https?:\/\//, "")}
                </a>
              )}
            </p>
          </header>

          <section className="mt-8">
            <Heading>Summary</Heading>
            <p className="leading-relaxed text-fg/90 print:text-black">{resume.summary}</p>
          </section>

          <section className="mt-8">
            <Heading>Experience</Heading>
            <div className="space-y-7">
              {experience
                .filter((e) => e.kind !== "education" && e.kind !== "internship")
                .map((entry) => (
                  <div key={entry.id} className="break-inside-avoid-page">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-semibold">
                        {entry.role} · <span className="font-normal text-muted print:text-neutral-700">{entry.organization}</span>
                      </h3>
                      <p className="font-mono text-xs text-subtle print:text-neutral-600">
                        {entry.start} – {entry.end}
                      </p>
                    </div>
                    {entry.summary && <p className="mt-2 text-sm leading-relaxed text-muted print:text-neutral-800">{entry.summary}</p>}
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-cyan print:text-neutral-800 print:marker:text-neutral-500">
                      {entry.products?.flatMap((product) =>
                        product.points.map((point, i) => (
                          <li key={`${product.name}-${i}`}>
                            {i === 0 && <span className="font-medium text-fg print:text-black">{product.name}: </span>}
                            {point}
                          </li>
                        )),
                      )}
                      {entry.points?.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  </div>
                ))}
            </div>
          </section>

          <section className="mt-8">
            <Heading>Selected products</Heading>
            <ul className="space-y-3 text-sm">
              {selected.map((project) => (
                <li key={project.slug} className="break-inside-avoid">
                  <p>
                    <span className="font-semibold">{project.name}</span>
                    <span className="text-subtle print:text-neutral-600"> — {project.category} · {project.status.label}</span>
                  </p>
                  <p className="mt-0.5 leading-relaxed text-muted print:text-neutral-800">{project.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <Heading>Skills</Heading>
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[11rem_1fr]">
              {resume.skills.map((skill) => (
                <div key={skill.area} className="contents">
                  <dt className="font-medium text-fg print:text-black">{skill.area}</dt>
                  <dd className="text-muted print:text-neutral-800">{skill.items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <section>
              <Heading>Education</Heading>
              {experience
                .filter((e) => e.kind === "education")
                .map((e) => (
                  <p key={e.id} className="text-sm">
                    <span className="font-medium">{e.role}</span>
                    <br />
                    <span className="text-muted print:text-neutral-700">
                      {e.organization}, {e.start}–{e.end}
                    </span>
                  </p>
                ))}
            </section>
            <section>
              <Heading>Certifications & languages</Heading>
              <ul className="space-y-1.5 text-sm text-muted print:text-neutral-800">
                {[...resume.certifications, ...resume.languages].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
