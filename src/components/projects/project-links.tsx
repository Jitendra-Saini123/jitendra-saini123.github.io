import { ArrowUpRight, Globe, Package } from "lucide-react";
import type { ProjectLink } from "@/types";
import { buttonClasses } from "@/components/ui/button-link";
import { GitHubIcon, GooglePlayIcon } from "@/components/ui/icons";
import { externalLinkProps, isUsableUrl } from "@/lib/links";
import { cn } from "@/lib/cn";

function LinkIcon({ kind }: { kind: ProjectLink["kind"] }) {
  switch (kind) {
    case "store":
      return <GooglePlayIcon size={15} />;
    case "source":
      return <GitHubIcon size={15} />;
    case "product":
      return <Package size={15} aria-hidden />;
    default:
      return <Globe size={15} aria-hidden />;
  }
}

/** Renders only links that are configured with a real URL. */
export function ProjectLinks({ links, projectName, className }: { links: ProjectLink[]; projectName: string; className?: string }) {
  const usable = links.filter((link) => isUsableUrl(link.href));
  if (usable.length === 0) return null;
  return (
    <>
      {usable.map((link) => (
        <a
          key={link.href}
          href={link.href}
          {...externalLinkProps}
          className={cn(buttonClasses("secondary", "md"), className)}
          aria-label={`${link.label}: ${projectName} (opens in a new tab)`}
        >
          <LinkIcon kind={link.kind} />
          {link.label}
          <ArrowUpRight aria-hidden size={15} className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
        </a>
      ))}
    </>
  );
}
