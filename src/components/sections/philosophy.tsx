import { Reveal } from "@/components/ui/reveal";
import { aiToday } from "@/data/approach";
import { PhilosophyBody } from "./philosophy-body";


export function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative overflow-x-clip border-t border-line py-28 md:py-40">
      <div aria-hidden className="absolute right-[-10rem] top-40 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(69_217_255/0.08),transparent_65%)] blur-2xl" />
      <div className="container-page relative">
        <header className="mb-16 md:mb-24">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="text-cyan">05</span>
              <span aria-hidden className="h-px w-10 bg-line-strong" />
              <span>AI &amp; building philosophy</span>
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="philosophy-title" className="text-display text-[clamp(2.6rem,7vw,6.2rem)]">
              Build first.
              <br />
              <span className="font-serif font-normal italic tracking-[-0.02em] text-cyan-soft">Learn deeply.</span>
              <br />
              <span className="text-muted">Iterate relentlessly.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
              I see AI as a way to expand what one developer can build — not a replacement for engineering judgement. The interesting
              work is turning experiments into maintainable software that people use every day.
            </p>
          </Reveal>
        </header>

        <PhilosophyBody />

        <div className="mt-24 md:mt-32">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h3 className="text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold tracking-[-0.03em]">Where AI fits in my work today</h3>
              <p className="max-w-md text-sm text-subtle md:text-right">
                Concrete uses, labelled honestly. I don&rsquo;t claim expertise in every new framework.
              </p>
            </div>
          </Reveal>
          <ul className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {aiToday.map((item, i) => (
              <Reveal as="li" key={item.text} delay={i * 0.05} className="bg-ink-950 p-6">
                <p
                  className={`font-mono text-[0.66rem] uppercase tracking-[0.16em] ${
                    item.where === "Exploring" ? "text-violet-soft" : item.where === "In production" ? "text-cyan" : "text-cyan-soft"
                  }`}
                >
                  {item.where}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
