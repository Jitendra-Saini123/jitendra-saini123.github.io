import { navItems, siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import type { Command } from "@/lib/command";
import { isUsableUrl } from "@/lib/links";

/** Everything the ⌘K palette can do, generated from the site's own data. */
export function buildCommands(): Command[] {
  const suggestions = [
    "What has Jitendra shipped?",
    "Has Jitendra built offline-first apps?",
    "How does Jitendra use AI?",
    "How can I get in touch?",
  ];
  const commands: Command[] = [
    ...suggestions.map(
      (question, i): Command => ({
        id: `ask-suggestion-${i}`,
        label: question,
        group: "Ask",
        hint: "Instant answer from this site's content",
        keywords: ["ask", "question"],
        action: { type: "ask", question },
      }),
    ),
    ...[{ id: "top", label: "Home" } as const, ...navItems, { id: "contact", label: "Contact" } as const].map(
      (item): Command => ({
        id: `nav-${item.id}`,
        label: item.label,
        group: "Navigate",
        hint: item.id === "top" ? "Back to the hero" : `Jump to ${item.label.toLowerCase()}`,
        action: { type: "navigate", href: `/#${item.id}` },
      }),
    ),
    ...projects
      .filter((project) => project.caseStudy)
      .map(
        (project): Command => ({
          id: `case-${project.slug}`,
          label: project.name,
          group: "Case studies",
          hint: project.category,
          keywords: project.stack,
          action: { type: "navigate", href: `/work/${project.slug}` },
        }),
      ),
    {
      id: "copy-email",
      label: "Copy email address",
      group: "Actions",
      hint: siteConfig.contact.email,
      keywords: ["contact", "hire", "mail"],
      action: { type: "copy", text: siteConfig.contact.email, message: "Email address copied" },
    },
    {
      id: "write-email",
      label: "Start a conversation",
      group: "Actions",
      hint: "Opens your email app",
      keywords: ["contact", "hire", "freelance", "project"],
      action: { type: "external", href: `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(siteConfig.contact.mailSubject)}` },
    },
  ];

  commands.push({
    id: "resume-web",
    label: "View web résumé",
    group: "Actions",
    hint: "Printable and ATS-friendly",
    keywords: ["cv", "resume", "print"],
    action: { type: "navigate", href: "/resume" },
  });

  if (siteConfig.resume.enabled && isUsableUrl(siteConfig.resume.href)) {
    commands.push({
      id: "resume",
      label: "Download résumé",
      group: "Actions",
      hint: "PDF",
      keywords: ["cv", "resume"],
      action: { type: "download", href: siteConfig.resume.href },
    });
  }

  for (const social of siteConfig.socials) {
    commands.push({
      id: `link-${social.id}`,
      label: `Open ${social.label}`,
      group: "Links",
      hint: social.handle,
      action: { type: "external", href: social.href },
    });
  }

  for (const project of projects) {
    for (const link of project.links) {
      if (link.kind === "store" && project.tier !== "client" && isUsableUrl(link.href)) {
        commands.push({
          id: `store-${project.slug}`,
          label: `${project.name} on Google Play`,
          group: "Links",
          hint: "Opens the store listing",
          action: { type: "external", href: link.href },
        });
      }
      if (link.kind === "website" && isUsableUrl(link.href)) {
        commands.push({
          id: `site-${project.slug}`,
          label: `Visit ${project.name}`,
          group: "Links",
          hint: link.href.replace(/^https?:\/\//, ""),
          action: { type: "external", href: link.href },
        });
      }
    }
  }

  commands.push(
    {
      id: "play-rebuild",
      label: "Rebuild the tower",
      group: "Play",
      hint: "Replays the hero's assembly",
      keywords: ["3d", "hero", "animation"],
      action: { type: "rebuild" },
    },
    {
      id: "play-wave",
      label: "Say hi to my avatar",
      group: "Play",
      hint: "It waves back",
      keywords: ["3d", "avatar", "hello", "wave"],
      action: { type: "wave" },
    },
  );

  return commands;
}
