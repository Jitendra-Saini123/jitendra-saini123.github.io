"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buttonClasses } from "@/components/ui/button-link";
import { GitHubIcon } from "@/components/ui/icons";
import { setHeroHover } from "@/components/three/hero-signals";
import { Magnetic } from "@/components/ui/magnetic";
import { externalLinkProps, isUsableUrl } from "@/lib/links";

const energise = {
  onPointerEnter: () => setHeroHover(true),
  onPointerLeave: () => setHeroHover(false),
  onFocus: () => setHeroHover(true),
  onBlur: () => setHeroHover(false),
};

export function HeroActions() {
  const { primaryCta, secondaryCta, tertiaryCta } = siteConfig.hero;
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-col gap-3 xs:flex-row">
        <Magnetic>
          <a href={primaryCta.href} className={buttonClasses("primary", "lg", "w-full xs:w-auto")} {...energise}>
            {primaryCta.label}
            <ArrowDown aria-hidden size={17} className="transition-transform duration-300 group-hover/btn:translate-y-0.5" />
          </a>
        </Magnetic>
        <Magnetic>
          <a href={secondaryCta.href} className={buttonClasses("secondary", "lg", "w-full xs:w-auto")} {...energise}>
            {secondaryCta.label}
            <ArrowRight aria-hidden size={17} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </a>
        </Magnetic>
      </div>
      {isUsableUrl(tertiaryCta.href) && (
        <a
          href={tertiaryCta.href}
          {...externalLinkProps}
          {...energise}
          className="group inline-flex items-center gap-2 self-start rounded-full py-2 text-sm text-muted transition-colors hover:text-fg sm:self-auto"
        >
          <GitHubIcon size={16} />
          <span className="underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-cyan">
            {tertiaryCta.label}
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
