import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { contentEntries } from "@/data/content";
import { formatDate } from "@/lib/format";
import { externalLinkProps } from "@/lib/links";

/** A live-feeling status board, built entirely from the site's own data. */
export function NowStrip() {
  const building = projects.find((p) => p.slug === siteConfig.now.buildingSlug);
  const latestRelease = projects
    .filter((p) => p.updated)
    .sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""))[0];
  const latestVideo = [...contentEntries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  const cells = [
    building && {
      label: "Now building",
      live: true,
      title: building.name,
      meta: siteConfig.now.buildingNote,
      href: `/work/${building.slug}`,
      external: false,
    },
    latestRelease?.updated && {
      label: "Latest release",
      live: false,
      title: latestRelease.name,
      meta: `Google Play · ${formatDate(latestRelease.updated)}`,
      href: `/work/${latestRelease.slug}`,
      external: false,
    },
    latestVideo && {
      label: "Latest video",
      live: false,
      title: latestVideo.title,
      meta: `YouTube · ${formatDate(latestVideo.publishedAt)}`,
      href: latestVideo.url,
      external: true,
    },
  ].filter(Boolean) as { label: string; live: boolean; title: string; meta: string; href: string; external: boolean }[];

  if (cells.length === 0) return null;

  return (
    <section aria-label="What I'm working on now" className="relative border-y border-line bg-ink-900/40">
      <ul className="container-page grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {cells.map((cell) => {
          const content = (
            <>
              <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-subtle">
                {cell.live && (
                  <span aria-hidden className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal-green opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-signal-green" />
                  </span>
                )}
                {cell.label}
              </span>
              <span className="mt-2 flex items-start justify-between gap-3">
                <span className="line-clamp-1 text-[0.98rem] font-medium tracking-[-0.01em] text-fg transition-colors group-hover:text-cyan-soft">
                  {cell.title}
                </span>
                <ArrowUpRight
                  aria-hidden
                  size={15}
                  className="mt-0.5 shrink-0 text-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                />
              </span>
              <span className="mt-1 block text-xs text-subtle">{cell.meta}</span>
            </>
          );
          const className = "group block py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0";
          return (
            <li key={cell.label}>
              {cell.external ? (
                <a href={cell.href} {...externalLinkProps} className={className}>
                  {content}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link href={cell.href} className={className}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
