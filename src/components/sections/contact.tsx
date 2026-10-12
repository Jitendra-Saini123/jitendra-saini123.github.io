import { ArrowUpRight, Clock, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { GitHubIcon, SocialIcon } from "@/components/ui/icons";
import { externalLinkProps, isUsableUrl } from "@/lib/links";
import { ContactForm } from "./contact-form";
import { AskButton } from "@/components/command/ask-button";
import { CopyEmailButton, LocalTime } from "./contact-widgets";

export function Contact() {
  const { contact, socials, location } = siteConfig;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailSubject)}`;
  const github = socials.find((s) => s.id === "github");

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_20%_10%,rgb(69_217_255/0.1),transparent_60%),radial-gradient(60%_60%_at_90%_80%,rgb(139_112_255/0.12),transparent_60%)]" />
      <div aria-hidden className="grid-backdrop absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="text-cyan">07</span>
            <span aria-hidden className="h-px w-10 bg-line-strong" />
            <span>Contact</span>
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="contact-title" className="text-display max-w-5xl text-[clamp(2.8rem,8.4vw,7.6rem)]">
            Have something <span className="text-gradient font-serif font-normal italic tracking-[-0.02em]">worth building?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-[1.08rem] leading-relaxed text-muted">
            Whether you&rsquo;re developing a mobile product, exploring an AI-powered idea, or looking for a Flutter engineer to
            strengthen your team, I&rsquo;d love to hear what you&rsquo;re working on.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-col gap-3 xs:flex-row">
            <Magnetic>
              <ButtonLink href={mailto} size="lg" className="w-full xs:w-auto">
                <Mail aria-hidden size={17} />
                Start a Conversation
              </ButtonLink>
            </Magnetic>
            {github && isUsableUrl(github.href) && (
              <ButtonLink href={github.href} variant="secondary" size="lg">
                <GitHubIcon size={17} />
                Explore My GitHub
              </ButtonLink>
            )}
          </div>
          <div className="mt-5">
            <AskButton />
          </div>
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="min-w-0 lg:col-span-5">
            <h3 className="eyebrow mb-5">Direct lines</h3>
            <ul className="divide-y divide-line border-y border-line">
              <li className="flex items-center gap-4 py-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-muted">
                  <Mail size={16} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-subtle">Email</p>
                  <a href={`mailto:${contact.email}`} className="block truncate text-[0.95rem] transition-colors hover:text-cyan">
                    {contact.email}
                  </a>
                </div>
                <CopyEmailButton email={contact.email} />
              </li>
              {socials.map((social) => (
                <li key={social.id}>
                  <a href={social.href} {...externalLinkProps} className="group flex items-center gap-4 py-4">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-cyan/50 group-hover:text-fg">
                      <SocialIcon id={social.id} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-subtle">{social.label}</span>
                      <span className="block truncate text-[0.95rem] transition-colors group-hover:text-cyan">{social.handle}</span>
                    </span>
                    <ArrowUpRight aria-hidden size={16} className="text-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 font-mono text-xs text-subtle">
              <Clock size={14} aria-hidden />
              <LocalTime timeZone={location.timeZone} city={location.city} />
              <span aria-hidden>·</span>
              <span>{location.timeZoneLabel}</span>
            </p>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 lg:col-span-7">
            <div className="surface rounded-[1.75rem] p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">Send a short brief</h3>
              <p className="mb-7 mt-2 text-sm text-muted">A few details help me reply with something useful.</p>
              <ContactForm email={contact.email} subject={contact.mailSubject} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
