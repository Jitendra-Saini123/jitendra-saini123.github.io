import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { countByFilter, filterProjects, projectFilters } from "@/lib/projects";

describe("project filters", () => {
  it("returns every project for 'all'", () => {
    expect(filterProjects(projects, "all")).toHaveLength(projects.length);
  });

  it("filters by platform", () => {
    const web = filterProjects(projects, "web");
    expect(web.map((p) => p.slug)).toEqual(["viral-hunter"]);

    const games = filterProjects(projects, "game");
    expect(games.map((p) => p.slug)).toEqual(["mega-site"]);

    const mobile = filterProjects(projects, "mobile");
    expect(mobile.every((p) => p.platforms.includes("mobile"))).toBe(true);
    expect(mobile.map((p) => p.slug)).not.toContain("viral-hunter");
  });

  it("keeps original order", () => {
    const mobile = filterProjects(projects, "mobile");
    const indexes = mobile.map((p) => projects.indexOf(p));
    expect([...indexes].sort((a, b) => a - b)).toEqual(indexes);
  });

  it("counts match the filtered results for every filter", () => {
    const counts = countByFilter(projects);
    for (const filter of projectFilters) {
      expect(counts[filter.id]).toBe(filterProjects(projects, filter.id).length);
      expect(counts[filter.id]).toBeGreaterThan(0);
    }
  });
});
