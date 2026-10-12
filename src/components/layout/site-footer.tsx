import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navItems, siteConfig } from "@/config/site";
import { BrandMark } from "@/components/ui/brand-mark";
import { SocialIcon } from "@/components/ui/icons";
import { externalLinkProps } from "@/lib/links";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line print:hidden">
      <div className="container-page pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/#top" className="inline-flex items-center gap-3 rounded-lg" aria-label={`${siteConfig.brand} — back to top`}>
              <BrandMark size={36} />
              <span className="text-lg font-semibold tracking-[-0.02em]">
                Jitendra <span className="font-normal text-muted">Builds</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.name} — Flutter developer and independent product builder based in {siteConfig.location.city},{" "}
              {siteConfig.location.country}.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <p className="eyebrow mb-4">Explore</p>
              <ul className="space-y-2.5 text-sm">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link href={`/#${item.id}`} className="text-muted transition-colors hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Elsewhere</p>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      {...externalLinkProps}
                      className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
                    >
                      <SocialIcon id={social.id} size={14} />
                      {social.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow mb-4">Get in touch</p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/#contact" className="text-muted transition-colors hover:text-fg">
                    Start a conversation
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-muted transition-colors hover:text-fg">
                    Email me
                  </a>
                </li>
                {siteConfig.resume.enabled && (
                  <li>
                    <a href={siteConfig.resume.href} className="text-muted transition-colors hover:text-fg" download>
                      Résumé (PDF)
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="eyebrow mb-4">Colophon</p>
          <ul className="grid gap-x-8 gap-y-2 text-sm text-subtle sm:grid-cols-2 lg:grid-cols-4">
            <li>Statically generated with Next.js — no server round-trips to read a page.</li>
            <li>No cookies, no analytics, no third-party scripts.</li>
            <li>3D loads only when the device can afford it, and pauses off-screen.</li>
            <li>
              Respects reduced motion. Press <kbd className="rounded border border-line px-1 font-mono text-[0.7rem] text-muted">⌘K</kbd> /{" "}
              <kbd className="rounded border border-line px-1 font-mono text-[0.7rem] text-muted">Ctrl K</kbd> to get around.
            </li>
          </ul>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[clamp(2.4rem,10.2vw,11rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(162_172_194/0.18)]"
        >
          Jitendra Builds
        </p>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Built with Next.js, React Three Fiber and Tailwind CSS.
          </p>
          <a href="#main" className="inline-flex items-center gap-2 rounded-full text-muted transition-colors hover:text-fg">
            Back to top <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
