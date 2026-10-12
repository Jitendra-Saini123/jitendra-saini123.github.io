"use client";

import { Sparkles } from "lucide-react";
import { openCommandPalette } from "./palette-events";

/** Opens the ⌘K palette, where any question gets an answer from the site's content. */
export function AskButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-haspopup="dialog"
      className={
        className ??
        "group inline-flex items-center gap-2 rounded-full py-2 text-sm text-muted transition-colors hover:text-fg"
      }
    >
      <Sparkles aria-hidden size={15} className="text-cyan transition-transform duration-500 group-hover:rotate-12" />
      <span className="underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-cyan">
        Quick question? Ask my portfolio
      </span>
    </button>
  );
}
