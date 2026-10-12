import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { TagList } from "@/components/ui/tag-list";
import { GooglePlayIcon } from "@/components/ui/icons";
import { externalLinkProps, isUsableUrl } from "@/lib/links";

/** Professional client work: text-only, no client screenshots or internals. */
export function ClientProject({ project, index }: { project: Project; index: number }) {
  const store = project.links.find((link) => link.kind === "store" && isUsableUrl(link.href));
  const headingId = `project-${project.slug}-title`;

  return (
    <article aria-labelledby={headingId} className="corner-frame relative flex h-full flex-col border border-line bg-ink-900/40 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-cyan">C{String(index + 1).padStart(2, "0")}</p>
          <h3 id={headingId} className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
            {project.name}
          </h3>
          <p className="eyebrow mt-2 text-[0.62rem]">{project.category}</p>
        </div>
        {store && (
          <a
            href={store.href}
            {...externalLinkProps}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-xs text-muted transition-colors hover:border-cyan/60 hover:text-fg"
          >
            <GooglePlayIcon size={13} />
            Google Play
            <ArrowUpRight aria-hidden size={13} />
            <span className="sr-only"> listing for {project.name} (opens in a new tab)</span>
          </a>
        )}
      </div>

      <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{project.summary}</p>
      <ul className="mt-5 space-y-2 border-t border-line pt-5">
        {project.highlights.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-snug text-fg/85">
            <span aria-hidden className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-cyan" />
            {item}
          </li>
        ))}
      </ul>
      <TagList items={project.stack} label={`${project.name} technology`} className="mt-auto pt-6" />
    </article>
  );
}
