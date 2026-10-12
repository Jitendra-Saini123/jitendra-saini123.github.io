import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { contentEntries } from "@/data/content";
import { skillGroups } from "@/data/skills";
import { isUsableUrl } from "@/lib/links";

const publicDir = join(process.cwd(), "public");
const existsInPublic = (src: string) => existsSync(join(publicDir, src));

describe("projects data", () => {
  it("has unique slugs and exactly three featured projects", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(projects.filter((p) => p.tier === "featured").map((p) => p.slug)).toEqual(["pdfify", "mega-site", "viral-hunter"]);
  });

  it("only links to real, configured URLs", () => {
    for (const project of projects) {
      for (const link of project.links) expect(isUsableUrl(link.href), `${project.slug}: ${link.href}`).toBe(true);
    }
  });

  it("references images and videos that exist", () => {
    for (const project of projects) {
      const images = [...project.visual.images, ...project.gallery, ...(project.icon ? [project.icon] : [])];
      for (const image of images) {
        expect(existsInPublic(image.src), `${project.slug}: ${image.src}`).toBe(true);
        expect(image.alt.length, `${project.slug}: alt for ${image.src}`).toBeGreaterThan(3);
      }
      if (project.video) {
        expect(existsInPublic(project.video.src)).toBe(true);
        expect(existsInPublic(project.video.poster)).toBe(true);
      }
    }
  });

  it("does not link an unreleased project to a store", () => {
    for (const project of projects.filter((p) => p.status.kind === "in-development")) {
      expect(project.links.filter((l) => l.kind === "store")).toHaveLength(0);
    }
  });

  it("gives every featured project a case study", () => {
    for (const project of projects.filter((p) => p.tier === "featured")) expect(project.caseStudy).toBeDefined();
  });
});

describe("site config", () => {
  it("uses real social and contact links", () => {
    for (const social of siteConfig.socials) expect(isUsableUrl(social.href), social.id).toBe(true);
    expect(siteConfig.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("ships the 3D avatar model and its video fallback", () => {
    for (const file of ["/models/avatar.glb", "/media/avatar-loop.webm", "/media/avatar-loop.mp4", "/images/about/avatar-poster.webp"]) {
      expect(existsInPublic(file), file).toBe(true);
    }
  });

  it("only enables the résumé when the file exists", () => {
    if (siteConfig.resume.enabled) expect(existsInPublic(siteConfig.resume.href)).toBe(true);
  });
});

describe("other content", () => {
  it("has experience entries with dates", () => {
    for (const entry of experience) {
      expect(entry.start).toBeTruthy();
      expect(entry.end).toBeTruthy();
    }
  });

  it("has valid content entries", () => {
    for (const entry of contentEntries) {
      expect(isUsableUrl(entry.url)).toBe(true);
      expect(entry.thumbnail.startsWith("https://i.ytimg.com/vi/")).toBe(true);
      expect(entry.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("backs every skill with evidence", () => {
    for (const group of skillGroups) {
      expect(group.skills.length).toBeGreaterThan(0);
      for (const skill of group.skills) expect(skill.evidence.length, skill.name).toBeGreaterThan(10);
    }
  });
});
