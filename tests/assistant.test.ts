import { describe, expect, it } from "vitest";
import { getKnowledge } from "@/lib/knowledge/knowledge-base";
import { detectEntities, looksLikeQuestion, retrieve } from "@/lib/knowledge/retrieve";
import { isUsableUrl } from "@/lib/links";

describe("knowledge base", () => {
  const knowledge = getKnowledge();

  it("has unique ids, real links and no empty or undefined facts", () => {
    expect(new Set(knowledge.map((c) => c.id)).size).toBe(knowledge.length);
    for (const c of knowledge) {
      expect(c.text.length, c.id).toBeGreaterThan(20);
      expect(c.text, c.id).not.toMatch(/undefined|null|\[object Object\]/);
      expect(isUsableUrl(c.href), c.id).toBe(true);
    }
  });

  it("never contains the résumé phone number", () => {
    expect(knowledge.map((c) => c.text).join(" ")).not.toMatch(/8949994351|\+91/);
  });
});

describe("question handling", () => {
  it("recognises questions and named projects", () => {
    expect(looksLikeQuestion("What has Jitendra shipped?")).toBe(true);
    expect(looksLikeQuestion("does he know supabase")).toBe(true);
    expect(looksLikeQuestion("pdfify")).toBe(false);
    expect(detectEntities("Is Mega Site live?")).toEqual(["mega-site"]);
    expect(detectEntities("viral hunter vs pdfify")).toEqual(expect.arrayContaining(["pdfify", "viral-hunter"]));
  });

  it("answers contact questions with the contact fact", () => {
    expect(retrieve(getKnowledge(), "How can I get in touch?", 1)[0]?.chunk.id).toBe("profile-contact");
  });
});
