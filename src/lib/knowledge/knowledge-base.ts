import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skillGroups, depthMeta } from "@/data/skills";
import { contentEntries } from "@/data/content";
import { aiToday } from "@/data/approach";

/**
 * The portfolio assistant's knowledge base: small, self-contained facts
 * generated from the same data the site renders. Nothing here is written
 * separately, so answers are always the site's own words. Searched in the
 * browser by ./retrieve.ts — no server or API involved.
 */
export interface KnowledgeChunk {
  /** Stable, human-readable id used for citations, e.g. "pdfify-overview". */
  id: string;
  title: string;
  text: string;
  /** Where the fact lives on the site. */
  href: string;
  /** The project this fact is about, if any — lets retrieval boost named projects. */
  entity?: string;
}

/** How visitors refer to each project; used to detect which one a question is about. */
export const ENTITY_ALIASES: Record<string, string[]> = {
  pdfify: ["pdfify", "pdf converter", "pdf app"],
  "mega-site": ["mega site", "mega", "civil tycoon", "tycoon", "idle game", "the game"],
  "viral-hunter": ["viral hunter", "viralhunter"],
  "civil-site-calculator": ["civil site calculator", "site calculator", "construction calculator", "calculator"],
  tubenative: ["tubenative", "tube native"],
  firearrest: ["firearrest", "fire arrest", "fire inspection"],
  "clockedin-hrm": ["clockedin", "clocked in", "zaad", "hrm", "attendance"],
};

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function profileChunks(): KnowledgeChunk[] {
  const { name, brand, location, contact, socials, resume, availability, experienceLabel } = siteConfig;
  const chunks: KnowledgeChunk[] = [
    {
      id: "profile-summary",
      title: `About ${name}`,
      text: `${name} (brand: ${brand}) is a Flutter developer, AI builder and independent product builder with ${experienceLabel} of professional Flutter experience. ${name} builds cross-platform mobile apps for Android and iOS, ships independent products on Google Play and the web, and explores AI-powered software.`,
      href: "/#about",
    },
    {
      id: "profile-location",
      title: "Location and time zone",
      text: `${name} is based in ${location.city}, ${location.country}, and works in the ${location.timeZoneLabel} time zone. Languages: English (professional working proficiency) and Hindi (native).`,
      href: "/#contact",
    },
    {
      id: "profile-contact",
      title: "How to get in touch",
      text: `The best way to reach ${name} is email: ${contact.email}. ${socials.map((s) => `${s.label}: ${s.href}`).join(". ")}. The contact form on the site opens your own email app with the message prefilled.`,
      href: "/#contact",
    },
    {
      id: "profile-availability",
      title: "Availability for work",
      text: availability.enabled
        ? `${availability.label}. Email ${contact.email} with a short brief to discuss.`
        : `The site doesn't publish current availability. To ask about freelance projects or roles, email ${contact.email} with a short brief.`,
      href: "/#contact",
    },
  ];
  if (resume.enabled) {
    chunks.push({
      id: "profile-resume",
      title: "Résumé",
      text: `A PDF résumé is available to download from the Experience section (${resume.href}).`,
      href: "/#experience",
    });
  }
  return chunks;
}

function projectChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  for (const p of projects) {
    const href = p.caseStudy ? `/work/${p.slug}` : "/#work";
    const links = p.links.map((l) => `${l.label}: ${l.href}`).join(". ");
    chunks.push({
      entity: p.slug,
      id: `${p.slug}-summary`,
      title: `${p.name} — ${p.category}`,
      text: clean(
        `${p.name} (${p.category}). Status: ${p.status.label}${p.status.note ? ` (${p.status.note})` : ""}. ${p.summary} Highlights: ${p.highlights.join("; ")}. Tech stack: ${p.stack.join(", ")}.${
          p.publisher ? ` Published under ${p.publisher}.` : ""
        }${p.updated ? ` Last release: ${p.updated}.` : ""}${links ? ` Links: ${links}.` : ""}${
          p.tier === "client" ? " Built by Jitendra as a Flutter Developer at Sublimity Softwares for a client." : ""
        }`,
      ),
      href,
    });
    const cs = p.caseStudy;
    if (!cs) continue;
    const entity = p.slug;
    chunks.push(
      { entity, id: `${p.slug}-overview`, title: `${p.name}: what it does`, text: clean(cs.overview), href },
      { entity, id: `${p.slug}-problem`, title: `${p.name}: the problem`, text: clean(cs.problem), href },
      { entity, id: `${p.slug}-role`, title: `${p.name}: Jitendra's role`, text: clean(cs.role), href },
      { entity, id: `${p.slug}-approach`, title: `${p.name}: technical approach and tech stack`, text: clean(cs.approach.join(" ")), href },
      { entity, id: `${p.slug}-status`, title: `${p.name}: current status and release`, text: clean(cs.statusDetail), href },
    );
    for (const d of cs.decisions) {
      chunks.push({ entity, id: `${p.slug}-decision-${slug(d.title)}`, title: `${p.name}: ${d.title}`, text: clean(d.body), href });
    }
    if (cs.capabilities) {
      const c = cs.capabilities;
      chunks.push({
        entity,
        id: `${p.slug}-capabilities`,
        title: `${p.name}: shipped vs. in progress`,
        text: clean(
          `Implemented: ${c.implemented.join("; ")}.${c.experimental?.length ? ` Experimental: ${c.experimental.join("; ")}.` : ""}${
            c.planned?.length ? ` Planned: ${c.planned.join("; ")}.` : ""
          }`,
        ),
        href,
      });
    }
    if (p.metrics?.length) {
      chunks.push({
        entity,
        id: `${p.slug}-numbers`,
        title: `${p.name}: by the numbers`,
        text: p.metrics.map((m) => `${m.value} ${m.label}`).join("; ") + ".",
        href,
      });
    }
  }
  return chunks;
}

function experienceChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  for (const e of experience) {
    const label = e.kind === "education" ? "Education" : e.kind === "internship" ? "Internship" : "Work experience";
    chunks.push({
      id: `experience-${e.id}`,
      title: `${label}: ${e.role} — ${e.organization}`,
      text: clean(
        `${label}: ${e.role} at ${e.organization}${e.location ? ` (${e.location})` : ""}, ${e.start} – ${e.end}.${e.summary ? ` ${e.summary}` : ""}${
          e.points?.length ? ` ${e.points.join(" ")}` : ""
        }${e.stack?.length ? ` Technologies: ${e.stack.join(", ")}.` : ""}`,
      ),
      href: "/#experience",
    });
    for (const product of e.products ?? []) {
      const productEntity = Object.keys(ENTITY_ALIASES).find((key) => slug(product.name).startsWith(key.split("-")[0]!));
      chunks.push({
        entity: productEntity,
        id: `experience-${e.id}-${slug(product.name)}`,
        title: `${product.name} (${e.organization})`,
        text: clean(`${product.name} — ${product.description}, built at ${e.organization}. ${product.points.join(" ")}`),
        href: "/#experience",
      });
    }
  }
  return chunks;
}

function skillChunks(): KnowledgeChunk[] {
  return skillGroups.map((g) => ({
    id: `skills-${g.id}`,
    title: `Skills: ${g.title}`,
    text: clean(
      `${g.description} ${g.skills.map((s) => `${s.name} (${depthMeta[s.depth].label.toLowerCase()}: ${s.evidence})`).join(" ")}`,
    ),
    href: "/#skills",
  }));
}

function contentChunks(): KnowledgeChunk[] {
  return [
    {
      id: "content-channel",
      title: "YouTube: Jitendra Builds",
      text: clean(
        `Jitendra publishes videos on the Jitendra Builds YouTube channel about building products in public, Flutter, AI products and agentic workflows, in English and Hindi. Recent videos: ${contentEntries
          .map((v) => `"${v.title}" (${v.publishedAt}, ${v.category}): ${v.description ?? ""} ${v.url}`)
          .join(" ")}`,
      ),
      href: "/#content",
    },
  ];
}

function approachChunks(): KnowledgeChunk[] {
  return [
    {
      id: "approach-philosophy",
      title: "Building philosophy",
      text: "Build first. Learn deeply. Iterate relentlessly. Jitendra starts with the smallest real version of an idea, goes deep on the hard parts (memory limits, sync under bad connectivity, how LLMs fail), then ships, listens and refines. AI is treated as a way to expand what one developer can build, not a replacement for engineering judgement.",
      href: "/#philosophy",
    },
    {
      id: "approach-ai",
      title: "Where AI fits in Jitendra's work",
      text: aiToday.map((a) => `${a.where}: ${a.text}`).join(" "),
      href: "/#philosophy",
    },
  ];
}

let cached: KnowledgeChunk[] | null = null;

export function getKnowledge(): KnowledgeChunk[] {
  cached ??= [...profileChunks(), ...projectChunks(), ...experienceChunks(), ...skillChunks(), ...contentChunks(), ...approachChunks()];
  return cached;
}
