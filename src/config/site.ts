import type { SocialLink } from "@/types";

/**
 * Central personal configuration.
 *
 * Every value here is either taken from Jitendra's résumé (Oct 2026), a public
 * profile that was checked on 9 Oct 2026, or is explicitly marked as a setting.
 * Search for "VERIFY" before publishing.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  url: resolveSiteUrl(),
  brand: "Jitendra Builds",
  name: "Jitendra Saini",
  firstName: "Jitendra",
  title: "Jitendra Saini | Flutter Developer, AI Builder & Indie Developer",
  description:
    "Explore the work of Jitendra Saini, a Flutter developer and independent product builder creating mobile applications and exploring AI-powered software.",
  locale: "en_US",

  hero: {
    eyebrow: "Independent developer · Product builder",
    headlineLead: "I build digital products that",
    headlineAccent: "move ideas forward.",
    descriptor: ["Flutter Developer", "AI Builder", "Indie Maker"],
    intro:
      "I build cross-platform mobile applications and explore AI-powered products, combining practical engineering with a curiosity for what's next.",
    primaryCta: { label: "Explore My Work", href: "#work" },
    secondaryCta: { label: "Let's Work Together", href: "#contact" },
    tertiaryCta: { label: "View GitHub", href: "https://github.com/Jitendra-Saini123" },
  },

  /**
   * Availability badge. Disabled by default — only switch it on when it is
   * actually true, and keep the label specific.
   */
  availability: {
    enabled: false,
    label: "Open to select freelance projects and Flutter roles",
  },

  /** The "Now" strip under the hero. Release and video entries are derived from data. */
  now: {
    buildingSlug: "viral-hunter",
    buildingNote: "Building it in public on YouTube",
  },

  location: {
    city: "Jaipur",
    country: "India",
    timeZone: "Asia/Kolkata",
    timeZoneLabel: "IST · UTC+5:30",
    coordinates: "26.91° N, 75.79° E",
  },

  /** Years of professional Flutter experience, as stated on the résumé. */
  experienceLabel: "3.5+ years",

  contact: {
    // From the résumé. VERIFY this is the inbox you want public.
    email: "jitendra.saini1189@gmail.com",
    mailSubject: "Project enquiry via Jitendra Builds",
  },

  resume: {
    enabled: true,
    // NOTE: the PDF includes a phone number. Remove or redact it before publishing
    // if you don't want that publicly downloadable.
    href: "/jitendra-saini-resume.pdf",
    label: "Download résumé",
  },

  socials: [
    {
      id: "github",
      label: "GitHub",
      handle: "Jitendra-Saini123",
      href: "https://github.com/Jitendra-Saini123",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "in/jitendrabuilds",
      // From the résumé. LinkedIn blocks automated checks — VERIFY manually.
      href: "https://www.linkedin.com/in/jitendrabuilds",
    },
    {
      id: "youtube",
      label: "YouTube",
      handle: "@JitendrBuilds",
      // Verified 12 Oct 2026: resolves to the "Jitendra Builds" channel.
      href: "https://www.youtube.com/@JitendrBuilds",
    },
    {
      id: "telegram",
      label: "Telegram",
      handle: "@jitendra161",
      href: "https://t.me/jitendra161",
    },
  ] satisfies SocialLink[],
} as const;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "philosophy", label: "Approach" },
  { id: "content", label: "Content" },
] as const;

export type SiteConfig = typeof siteConfig;
