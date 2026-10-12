"use client";

import { useCallback, useRef, useState } from "react";
import { getKnowledge, type KnowledgeChunk } from "@/lib/knowledge/knowledge-base";
import { retrieve } from "@/lib/knowledge/retrieve";

export interface Exchange {
  id: number;
  question: string;
  /** The best-matching fact, shown as the answer. */
  answer: KnowledgeChunk | null;
  /** Other relevant facts, shown as links. */
  related: KnowledgeChunk[];
}

/**
 * The portfolio assistant: searches the site's own content in the browser.
 * No server, no API key, no cost — answers are the site's own words.
 */
export function useAsk() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const nextId = useRef(1);

  const ask = useCallback((question: string) => {
    const q = question.trim();
    if (!q) return;
    const [best, ...rest] = retrieve(getKnowledge(), q, 3);
    // Only show related facts that are genuinely close to the best match.
    const related = best ? rest.filter((r) => r.score >= best.score * 0.5).map((r) => r.chunk) : [];
    const id = nextId.current++;
    setExchanges((list) => [...list, { id, question: q, answer: best?.chunk ?? null, related }]);
  }, []);

  const reset = useCallback(() => setExchanges([]), []);

  return { exchanges, ask, reset };
}
