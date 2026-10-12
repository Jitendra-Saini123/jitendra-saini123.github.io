import { type CSSProperties, Fragment } from "react";
import { siteConfig } from "@/config/site";
import { SocialIcon } from "@/components/ui/icons";
import { HeroVisual } from "@/components/three/hero-visual";
import { externalLinkProps } from "@/lib/links";
import { HeroActions } from "./hero-actions";
import { RebuildButton } from "./rebuild-button";

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

/**
 * Each word rises out of its own mask, staggered. Pure CSS, so it plays on
 * first paint without waiting for JavaScript.
 */
function MaskedWords({ text, start, wordClassName }: { text: string; start: number; wordClassName?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
            <span className={`word-rise inline-block ${wordClassName ?? ""}`} style={delay(start + i * 60)}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}

export function Hero() {
  const { hero, availability, location, socials } = siteConfig;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(110%_80%_at_72%_38%,#0e1834_0%,#070b19_45%,#050711_75%)]" />
      <div
        aria-hidden
        className="grid-backdrop absolute inset-0 -z-20 opacity-70 [mask-image:radial-gradient(60%_55%_at_70%_45%,black,transparent)]"
      />

      <div className="absolute inset-0 -z-10">
        <HeroVisual heroId="top" />
      </div>

      {/* Legibility: fade the scene behind the copy */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent lg:hidden" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[58%] bg-gradient-to-r from-ink-950/85 via-ink-950/40 to-transparent lg:block" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="container-page relative flex flex-1 flex-col justify-end pb-14 pt-[calc(var(--header-height)+24svh)] lg:justify-center lg:pb-16 lg:pt-[calc(var(--header-height)+3rem)]">
        <div className="max-w-[46rem] lg:max-w-[min(46rem,56%)]">
          {availability.enabled && (
            <p className="hero-rise mb-6 inline-flex items-center gap-2 rounded-full border border-signal-green/30 bg-signal-green/[0.07] px-3 py-1.5 text-xs text-signal-green" style={delay(40)}>
              <span aria-hidden className="size-1.5 rounded-full bg-signal-green" />
              {availability.label}
            </p>
          )}

          <p className="eyebrow hero-rise flex items-center gap-2.5" style={delay(80)}>
            <span aria-hidden className="size-1.5 rounded-full bg-cyan shadow-[0_0_10px_2px_rgb(69_217_255/0.6)]" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="mt-7">
            <span className="hero-rise flex items-center gap-3 text-[clamp(1.2rem,2vw,1.55rem)] font-semibold tracking-[-0.02em]" style={delay(160)}>
              <span aria-hidden className="h-px w-8 bg-gradient-to-r from-cyan to-violet" />
              {siteConfig.name}
            </span>
            <span className="sr-only"> — </span>
            <span className="text-display mt-4 block text-[clamp(2.55rem,6.4vw,5.75rem)] lg:text-[clamp(3rem,5.1vw,5.75rem)]">
              <MaskedWords text={hero.headlineLead} start={220} />{" "}
              <MaskedWords
                text={hero.headlineAccent}
                start={220 + hero.headlineLead.split(" ").length * 60}
                wordClassName="text-gradient pr-[0.06em] font-serif font-normal italic tracking-[-0.025em]"
              />
            </span>
          </h1>

          <p className="hero-rise mt-6 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-cyan-soft/90" style={delay(360)}>
            {hero.descriptor.join("  ·  ")}
          </p>

          <p className="hero-rise mt-5 max-w-[35rem] text-[1.05rem] leading-relaxed text-muted sm:text-[1.1rem]" style={delay(420)}>
            {hero.intro}
          </p>

          <div className="hero-rise mt-9" style={delay(500)}>
            <HeroActions />
          </div>
        </div>
      </div>

      {/* Instrument bar */}
      <div className="container-page relative pb-6">
        <div className="hero-rise flex items-center justify-between gap-6 border-t border-line pt-5" style={delay(700)}>
          <ul className="flex items-center gap-1" aria-label="Social profiles">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  {...externalLinkProps}
                  className="inline-flex size-10 items-center justify-center rounded-full text-subtle transition-colors hover:bg-white/5 hover:text-fg"
                >
                  <SocialIcon id={social.id} size={17} />
                  <span className="sr-only">{social.label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
          <RebuildButton />
          <a href="#work" className="group flex items-center gap-3 rounded-full py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-fg">
            Scroll
            <span aria-hidden className="relative h-8 w-px overflow-hidden bg-line">
              <span className="absolute inset-0 animate-scroll-cue bg-cyan" />
            </span>
          </a>
          </div>

          <p className="hidden text-right font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-subtle md:block">
            {location.city}, {location.country} · {location.timeZoneLabel}
            <br />
            {location.coordinates}
          </p>
        </div>
      </div>
    </section>
  );
}
