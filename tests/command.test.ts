import { describe, expect, it } from "vitest";
import { buildCommands } from "@/config/commands";
import { filterCommands, scoreMatch } from "@/lib/command";
import { projects } from "@/data/projects";
import { isUsableUrl } from "@/lib/links";

describe("scoreMatch", () => {
  it("ranks exact > prefix > word start > substring > subsequence", () => {
    const exact = scoreMatch("work", "work");
    const prefix = scoreMatch("workflow", "work");
    const word = scoreMatch("selected work", "work");
    const substring = scoreMatch("homework", "work");
    const subsequence = scoreMatch("w-o-r-k", "wrk");
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(word);
    expect(word).toBeGreaterThan(substring);
    expect(substring).toBeGreaterThan(subsequence);
    expect(subsequence).toBeGreaterThan(0);
    expect(scoreMatch("pdfify", "xyz")).toBe(0);
  });
});

describe("command palette", () => {
  const commands = buildCommands();

  it("has unique ids and only real external links", () => {
    expect(new Set(commands.map((c) => c.id)).size).toBe(commands.length);
    for (const command of commands) {
      if (command.action.type === "external" || command.action.type === "navigate" || command.action.type === "download") {
        expect(isUsableUrl(command.action.href), command.id).toBe(true);
      }
    }
  });

  it("offers a case study for every project that has one", () => {
    for (const project of projects.filter((p) => p.caseStudy)) {
      expect(commands.some((c) => c.action.type === "navigate" && c.action.href === `/work/${project.slug}`)).toBe(true);
    }
  });

  it("finds projects by name and by technology", () => {
    expect(filterCommands(commands, "pdf")[0]?.id).toBe("case-pdfify");
    expect(filterCommands(commands, "supabase").map((c) => c.id)).toContain("case-viral-hunter");
    expect(filterCommands(commands, "email")[0]?.group).toBe("Actions");
  });

  it("returns everything for an empty query and nothing for nonsense", () => {
    expect(filterCommands(commands, "")).toHaveLength(commands.length);
    expect(filterCommands(commands, "qqqqzzzz")).toHaveLength(0);
  });
});
