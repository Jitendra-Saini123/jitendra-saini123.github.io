import { describe, expect, it } from "vitest";
import { getKnowledge } from "@/lib/knowledge/knowledge-base";
import { retrieve } from "@/lib/knowledge/retrieve";

/**
 * Retrieval evals for the portfolio assistant: realistic visitor questions
 * and the fact(s) that must be in the top 3 results. If retrieval misses,
 * the model never sees the fact — so these guard answer quality in both the
 * offline and the Claude-backed modes.
 */
const cases: { q: string; expect: string[] }[] = [
  { q: "What is PDFify?", expect: ["pdfify-summary", "pdfify-overview"] },
  { q: "Does PDFify upload my documents to a server?", expect: ["pdfify-summary", "pdfify-overview", "pdfify-problem", "pdfify-numbers"] },
  { q: "Tell me about the idle game", expect: ["mega-site-summary", "mega-site-overview"] },
  { q: "Is Mega Site released on Google Play?", expect: ["mega-site-status", "mega-site-summary"] },
  { q: "What is Viral Hunter built with?", expect: ["viral-hunter-summary", "viral-hunter-approach"] },
  { q: "How does Viral Hunter keep AI costs under control?", expect: ["viral-hunter-decision-cost-aware-by-design"] },
  { q: "Where is Jitendra based?", expect: ["profile-location"] },
  { q: "What time zone does he work in?", expect: ["profile-location"] },
  { q: "How can I contact Jitendra?", expect: ["profile-contact"] },
  { q: "Is Jitendra available for freelance work?", expect: ["profile-availability"] },
  { q: "Can I download a CV?", expect: ["profile-resume"] },
  // Ambiguous on purpose: the employer, the independent work and the city are all correct answers.
  { q: "Where does Jitendra work?", expect: ["experience-sublimity", "experience-independent", "profile-location"] },
  { q: "Has he built face recognition?", expect: ["experience-sublimity-clockedin-hrm-zaad-hr", "experience-sublimity-attendance-kiosks", "clockedin-hrm-summary", "skills-ai"] },
  { q: "Experience with offline sync?", expect: ["experience-sublimity-firearrest", "firearrest-summary", "skills-mobile"] },
  { q: "Which payment providers has Jitendra integrated?", expect: ["skills-integrations", "experience-sublimity-weweed", "experience-sublimity-1-reception-propertyapp"] },
  { q: "Does Jitendra know Next.js?", expect: ["skills-web", "viral-hunter-summary"] },
  { q: "How does Jitendra use AI?", expect: ["approach-ai", "skills-ai"] },
  { q: "What's the YouTube channel about?", expect: ["content-channel"] },
  { q: "What did Jitendra study?", expect: ["experience-education"] },
  { q: "Which apps are live on Google Play?", expect: ["pdfify-summary", "civil-site-calculator-summary"] },
  { q: "Construction calculator in Hindi?", expect: ["civil-site-calculator-summary", "civil-site-calculator-approach", "civil-site-calculator-numbers"] },
  { q: "What is TubeNative?", expect: ["tubenative-summary", "tubenative-overview"] },
];

describe("assistant retrieval evals", () => {
  const knowledge = getKnowledge();
  const ids = new Set(knowledge.map((c) => c.id));

  it("references only facts that exist", () => {
    for (const c of cases) for (const id of c.expect) expect(ids.has(id), id).toBe(true);
  });

  it.each(cases)("finds the right fact for: $q", ({ q, expect: expected }) => {
    const top = retrieve(knowledge, q, 3).map((r) => r.chunk.id);
    expect(
      top.some((id) => expected.includes(id)),
      `top 3 were: ${top.join(", ")}`,
    ).toBe(true);
  });

  it("returns nothing for questions with no content words", () => {
    expect(retrieve(knowledge, "what is the", 3)).toHaveLength(0);
  });
});
