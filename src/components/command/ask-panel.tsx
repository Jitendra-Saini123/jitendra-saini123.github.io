"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { KnowledgeChunk } from "@/lib/knowledge/knowledge-base";
import type { Exchange } from "./use-ask";

interface AskPanelProps {
  exchanges: Exchange[];
  onBack: () => void;
  onNavigate: () => void;
}

/** Drops the "Name (Category). " prefix that generated facts start with. */
const withoutLead = (chunk: KnowledgeChunk) => chunk.text.replace(/^[^(.]{2,60}\([^)]*\)\.\s*/, "");

export function AskPanel({ exchanges, onBack, onNavigate }: AskPanelProps) {
  const latest = useRef<HTMLElement>(null);

  // Bring the newest question to the top of the panel.
  useEffect(() => {
    latest.current?.scrollIntoView({ block: "start" });
  }, [exchanges.length]);

  return (
    <div className="max-h-[min(62vh,30rem)] overflow-y-auto p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft aria-hidden size={13} /> Back to search
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-subtle">
          <Search aria-hidden size={11} className="text-cyan" />
          Answers from this site
        </span>
      </div>

      <div className="space-y-7" aria-live="polite">
        {exchanges.map((exchange, i) => (
          <section
            key={exchange.id}
            ref={i === exchanges.length - 1 ? latest : undefined}
            aria-label={`Answer to: ${exchange.question}`}
            className="scroll-mt-4"
          >
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-cyan/[0.1] px-3.5 py-2 text-sm text-fg">{exchange.question}</p>

            {exchange.answer ? (
              <div className="mt-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cyan-soft">{exchange.answer.title}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-fg/90">{withoutLead(exchange.answer)}</p>
                <Link
                  href={exchange.answer.href}
                  onClick={onNavigate}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-cyan transition-colors hover:text-cyan-soft"
                >
                  Read more <ArrowUpRight aria-hidden size={13} />
                </Link>

                {exchange.related.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-subtle">Related</p>
                    {exchange.related.map((chunk) => (
                      <Link
                        key={chunk.id}
                        href={chunk.href}
                        onClick={onNavigate}
                        className="group flex items-start gap-3 rounded-xl border border-line px-3 py-2.5 transition-colors hover:border-cyan/40 hover:bg-cyan/[0.04]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-fg">{chunk.title}</span>
                          <span className="line-clamp-2 text-xs leading-relaxed text-subtle">{withoutLead(chunk)}</span>
                        </span>
                        <ArrowUpRight aria-hidden size={13} className="mt-1 shrink-0 text-subtle transition-colors group-hover:text-fg" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3 text-sm text-muted">
                <p>I couldn&rsquo;t find that on the site. The quickest answer is an email:</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-cyan transition-colors hover:text-cyan-soft"
                >
                  <Mail aria-hidden size={14} /> {siteConfig.contact.email}
                </a>
              </div>
            )}
          </section>
        ))}
      </div>

      <p className="mt-6 text-[0.7rem] leading-relaxed text-subtle">
        Answers are taken directly from this site&rsquo;s content and run entirely in your browser.
      </p>
    </div>
  );
}
