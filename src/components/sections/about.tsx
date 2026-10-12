import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { AvatarViewer } from "./avatar-viewer";

/** Every figure here comes from the résumé or a public store listing. */
const record = [
  { value: "3.5+", label: "years shipping Flutter apps professionally" },
  { value: "6+", label: "production apps delivered for international clients" },
  { value: "5", label: "industries, from fire safety to food delivery" },
  { value: "2", label: "of my own apps live on Google Play" },
];

const chapters = [
  {
    year: "2014–18",
    title: "Engineering foundations",
    body: "B.Tech in Electrical Engineering in Jaipur — systems thinking before software.",
  },
  {
    year: "2022",
    title: "First web stack",
    body: "A full-stack web development internship, plus Python, Django and React projects on GitHub.",
  },
  {
    year: "2023",
    title: "Professional Flutter",
    body: "Joined Sublimity Softwares and started shipping client apps across five domains.",
  },
  {
    year: "2026",
    title: "Building my own",
    body: "Indie products on Google Play and the web, AI features in production, and building in public.",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div aria-hidden className="absolute -left-40 top-20 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(139_112_255/0.12),transparent_65%)] blur-2xl" />
      <div className="container-page relative">
        <SectionHeading
          index="02"
          label="About"
          id="about-title"
          align="left"
          title={
            <>
              The person behind <span className="font-serif font-normal italic text-cyan-soft">the products.</span>
            </>
          }
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[clamp(1.35rem,2.3vw,1.95rem)] font-medium leading-[1.35] tracking-[-0.02em]">
                I&rsquo;m a software developer focused on building practical mobile applications and exploring new ways to create
                products with AI.{" "}
                <span className="text-muted">
                  I enjoy working across the product lifecycle — from implementation and debugging to refining the details that make
                  software dependable and useful.
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10 grid gap-6 text-[1.02rem] leading-relaxed text-muted sm:grid-cols-2">
                <p>
                  For the last {siteConfig.experienceLabel} I&rsquo;ve built Flutter apps for international clients — offline-first
                  inspection tools, biometric attendance kiosks, HR platforms and marketplaces. That work taught me to care about the
                  unglamorous parts: sync that survives bad connectivity, migrations with zero data loss, and code a team can keep
                  shipping.
                </p>
                <p>
                  I also build my own products, end to end. PDFify and Civil Site Calculator are on Google Play, Viral Hunter is live
                  on the web, and Mega Site is in development. I learn by implementing — and I&rsquo;d rather build something useful
                  than collect technologies.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <dl className="mt-14 grid grid-cols-2 border-l border-t border-line sm:grid-cols-4">
                {record.map((item) => (
                  <div key={item.label} className="border-b border-r border-line p-5">
                    <dt className="sr-only">{item.label}</dt>
                    <dd>
                      <span className="block text-[2.1rem] font-semibold leading-none tracking-[-0.04em] text-fg">{item.value}</span>
                      <span aria-hidden className="mt-3 block text-[0.8rem] leading-snug text-subtle">
                        {item.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-subtle">
                Figures from my résumé and public store listings
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <figure>
              <div className="corner-frame relative mx-auto aspect-[5/6] max-w-md overflow-hidden rounded-sm border border-line bg-[#232a3d]">
                <AvatarViewer />
                <p className="sr-only">
                  An interactive 3D avatar of Jitendra Saini that follows your pointer and waves when clicked.
                </p>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.025)_0px,rgb(255_255_255/0.025)_1px,transparent_1px,transparent_4px)]"
                />
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <p className="absolute left-4 top-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan-soft">Avatar · 3D</p>
              </div>
              <figcaption className="mx-auto mt-5 flex max-w-md flex-wrap gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-subtle">
                <span>
                  {siteConfig.location.city}, {siteConfig.location.country}
                </span>
                <span>English · Hindi</span>
                <span>B.Tech, Electrical Eng.</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-24 md:mt-32">
          <Reveal>
            <h3 className="eyebrow mb-10">How I got here</h3>
          </Reveal>
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-cyan/60 via-line-strong to-transparent md:left-0 md:top-[5px] md:h-px md:w-full md:bg-gradient-to-r" />
            {chapters.map((chapter, i) => (
              <Reveal as="li" key={chapter.year} delay={i * 0.08} className="relative pl-8 md:pl-0 md:pt-10">
                <span aria-hidden className="absolute left-0 top-1.5 size-[11px] rounded-full border border-cyan bg-ink-950 md:top-0" />
                <p className="font-mono text-xs text-cyan">{chapter.year}</p>
                <h4 className="mt-2 text-lg font-semibold tracking-[-0.02em]">{chapter.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{chapter.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
