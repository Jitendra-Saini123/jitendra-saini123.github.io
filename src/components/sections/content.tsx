import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { siteConfig } from "@/config/site";
import { contentEntries, contentIntro } from "@/data/content";
import type { ContentEntry } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { DeferredVideo } from "@/components/ui/deferred-video";
import { YouTubeIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/format";
import { externalLinkProps, isUsableUrl } from "@/lib/links";
import { cn } from "@/lib/cn";

function VideoCard({ entry, featured = false }: { entry: ContentEntry; featured?: boolean }) {
  const vertical = entry.format === "short";
  return (
    <a
      href={entry.url}
      {...externalLinkProps}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-ink-900/60 transition-colors duration-500 hover:border-line-strong"
    >
      <div className={cn("relative overflow-hidden border-b border-line bg-black", vertical ? "aspect-[9/14]" : "aspect-video")}>
        <Image
          src={entry.thumbnail}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 55vw, 92vw" : "(min-width: 1024px) 20vw, 46vw"}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink-950/60 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
        >
          <Play size={20} className="translate-x-0.5 fill-fg text-fg" />
        </span>
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-ink-950/75 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
          {entry.format === "short" ? "Short" : "Video"}
          {entry.language ? ` · ${entry.language}` : ""}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-cyan">{entry.category}</p>
        <h3 className={cn("mt-2 font-semibold leading-snug tracking-[-0.02em]", featured ? "text-xl sm:text-2xl" : "text-base")}>
          {entry.title}
        </h3>
        {featured && entry.description && <p className="mt-3 text-sm leading-relaxed text-muted">{entry.description}</p>}
        <p className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-subtle">
          <span>{formatDate(entry.publishedAt)}</span>
          <span className="inline-flex items-center gap-1 text-muted transition-colors group-hover:text-fg">
            Watch on YouTube <ArrowUpRight aria-hidden size={13} />
          </span>
        </p>
      </div>
      <span className="sr-only"> (opens YouTube in a new tab)</span>
    </a>
  );
}

export function Content() {
  const youtube = siteConfig.socials.find((s) => s.id === "youtube");
  const [featured, ...rest] = contentEntries;

  return (
    <section id="content" aria-labelledby="content-title" className="relative border-t border-line py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          index="06"
          label="Content & experiments"
          id="content-title"
          title={
            <>
              Building in public as <span className="text-gradient">{contentIntro.channelName}.</span>
            </>
          }
          intro={
            <>
              <p>{contentIntro.description}</p>
              {youtube && isUsableUrl(youtube.href) && (
                <ButtonLink href={youtube.href} variant="secondary" className="mt-6">
                  <YouTubeIcon size={16} />
                  Visit the channel
                </ButtonLink>
              )}
            </>
          }
        />

        {featured ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <VideoCard entry={featured} featured />
            </Reveal>
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-5">
                {rest.slice(0, 2).map((entry, i) => (
                  <Reveal key={entry.id} delay={0.06 * (i + 1)}>
                    <VideoCard entry={entry} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="max-w-xl text-muted">New videos and write-ups are on the way — follow the channel to catch the first ones.</p>
        )}

        <div className="mt-20">
          <Reveal>
            <h3 className="eyebrow mb-8">Experiments</h3>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="corner-frame grid grid-cols-[minmax(0,1fr)_7.5rem] items-center gap-6 border border-line p-6 sm:grid-cols-[minmax(0,1fr)_9rem] sm:p-8">
              <div>
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-violet-soft">React · Remotion</p>
                <h4 className="mt-3 text-xl font-semibold tracking-[-0.02em]">Product videos written as code</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  PDFify&rsquo;s 30-second launch video is a React project rendered with Remotion — timing, typography and motion are all
                  defined in code.
                </p>
              </div>
              <DeferredVideo
                src="/media/pdfify-showcase.mp4"
                poster="/images/projects/pdfify/showcase-poster.webp"
                width={540}
                height={960}
                label="PDFify launch video (contains music)"
                className="w-full rounded-xl border border-line"
              />
            </Reveal>

            <Reveal delay={0.06} className="corner-frame flex flex-col border border-line p-6 sm:p-8">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-violet-soft">Flutter · Digital products</p>
              <h4 className="mt-3 text-xl font-semibold tracking-[-0.02em]">Selling a codebase as a product</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                TubeNative is packaged as a one-time source-code licence — which means the architecture, naming, documentation and tests
                are the user experience. An experiment in treating code quality as something customers pay for.
              </p>
              <a
                href="https://jitendra-saini123.github.io/nativestack/"
                {...externalLinkProps}
                className="mt-6 inline-flex items-center gap-1.5 self-start text-sm text-cyan transition-colors hover:text-cyan-soft"
              >
                NativeStack storefront <ArrowUpRight aria-hidden size={14} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
