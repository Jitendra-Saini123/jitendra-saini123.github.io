"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { navItems, siteConfig } from "@/config/site";
import { BrandMark } from "@/components/ui/brand-mark";
import { buttonClasses } from "@/components/ui/button-link";
import { SocialIcon } from "@/components/ui/icons";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/cn";
import { externalLinkProps } from "@/lib/links";
import { openCommandPalette } from "@/components/command/palette-events";

const sectionIds = [...navItems.map((item) => item.id), "contact"];

const subscribeNever = () => () => {};
const platformShortcut = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K");

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const active = useActiveSection(sectionIds);
  const shortcut = useSyncExternalStore(subscribeNever, platformShortcut, () => "Ctrl K");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (query.matches) menuRef.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const openMenu = () => {
    menuRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className="fixed inset-x-0 top-0 z-50 print:hidden">
      <div
        className={cn(
          "relative border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "glass border-x-0 border-t-0 border-b-line" : "border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Primary" className="container-page flex h-[var(--header-height)] items-center justify-between gap-6">
          <Link href="/#top" className="group flex items-center gap-2.5 rounded-lg" aria-label={`${siteConfig.brand} — back to top`}>
            <BrandMark className="transition-transform duration-500 group-hover:rotate-[30deg]" />
            <span className="text-[0.95rem] font-semibold tracking-[-0.02em]">
              Jitendra <span className="font-normal text-muted">Builds</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-cyan transition-transform duration-500",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCommandPalette}
              aria-haspopup="dialog"
              className="hidden h-10 items-center gap-2.5 rounded-full border border-line px-3.5 text-sm text-subtle transition-colors hover:border-line-strong hover:text-fg md:inline-flex"
            >
              <Search aria-hidden size={15} />
              <span className="hidden text-muted xl:inline">Search or ask</span>
              <span className="sr-only xl:hidden">Search or ask a question</span>
              <kbd className="font-mono text-[0.68rem] tracking-wide">{shortcut}</kbd>
            </button>
            <Link href="/#contact" className={buttonClasses("secondary", "md", "h-10 px-4 max-[22.5rem]:hidden")}>
              Let&rsquo;s talk
            </Link>
            <button
              type="button"
              onClick={openMenu}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-cyan/60 lg:hidden"
            >
              <Menu size={18} aria-hidden />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </nav>
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cyan via-cyan-soft to-violet opacity-80"
        />
      </div>

      <dialog
        id="mobile-menu"
        ref={menuRef}
        aria-label="Site menu"
        onClose={() => setMenuOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-ink-950/96 p-0 text-fg backdrop:bg-transparent"
      >
        <div className="container-page flex h-full flex-col">
          <div className="flex h-[var(--header-height)] items-center justify-between">
            <span className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-[-0.02em]">
              <BrandMark />
              <span>
                Jitendra <span className="font-normal text-muted">Builds</span>
              </span>
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-cyan/60"
            >
              <X size={18} aria-hidden />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-6 flex-1">
            <ol className="space-y-1">
              {[...navItems, { id: "contact", label: "Contact" } as const].map((item, i) => (
                <li key={item.id} className={cn(menuOpen && "hero-rise")} style={{ ["--d" as string]: 60 + i * 45 }}>
                  <Link
                    href={`/#${item.id}`}
                    onClick={closeMenu}
                    className="group flex items-baseline gap-4 border-b border-line py-4 text-[clamp(1.7rem,8vw,2.4rem)] font-semibold tracking-[-0.03em]"
                  >
                    <span className="font-mono text-xs font-normal tracking-normal text-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <span className="transition-colors group-hover:text-cyan">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-3 py-8">
            {siteConfig.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                {...externalLinkProps}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-muted transition-colors hover:border-cyan/60 hover:text-fg"
              >
                <SocialIcon id={social.id} />
                <span className="sr-only">{social.label} (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </dialog>
    </header>
  );
}
