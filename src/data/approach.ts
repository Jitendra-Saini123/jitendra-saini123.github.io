/** Concrete, honestly labelled uses of AI — shared by the Approach section and the portfolio assistant. */
export const aiToday: { where: "In production" | "In my products" | "In my workflow" | "Exploring"; text: string }[] = [
  {
    where: "In production",
    text: "On-device face recognition and liveness detection with ML Kit and TensorFlow Lite, in client attendance apps and kiosks.",
  },
  {
    where: "In my products",
    text: "Viral Hunter analyses content with an LLM whose responses are validated against Zod schemas and capped by per-user usage limits.",
  },
  {
    where: "In my products",
    text: "Civil Site Calculator offers an optional Gemini-powered smart input using each user's own API key, kept in secure storage.",
  },
  {
    where: "In my workflow",
    text: "AI-assisted coding speeds up exploration and boilerplate. Every change is still reviewed and tested like code I typed by hand.",
  },
  {
    where: "Exploring",
    text: "Agentic workflows — with a healthy respect for evals, context limits and prompt injection. I'm learning this one in public.",
  },
];
