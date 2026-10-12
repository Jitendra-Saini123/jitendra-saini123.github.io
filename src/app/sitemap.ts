import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

// Generated once at build time (also required for the static export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/resume/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...projects
      .filter((project) => project.caseStudy)
      .map((project) => ({
        url: `${siteConfig.url}/work/${project.slug}/`,
        lastModified: project.updated ? new Date(`${project.updated}T00:00:00Z`) : now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
