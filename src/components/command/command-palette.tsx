"use client";

import { type KeyboardEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Command as CommandIcon, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { buildCommands } from "@/config/commands";
import { type Command, filterCommands } from "@/lib/command";
import { requestRebuild } from "@/components/three/hero-signals";
import { requestWave } from "@/components/three/avatar/avatar-signals";
import { cn } from "@/lib/cn";
import { looksLikeQuestion } from "@/lib/knowledge/retrieve";
import { AskPanel } from "./ask-panel";
import { useAsk } from "./use-ask";

import { OPEN_PALETTE_EVENT } from "./palette-events";

/** Scrolls to a section on the home page, navigating there first if needed. */
function goToSection(router: ReturnType<typeof useRouter>, hash: string) {
  if (window.location.pathname === "/") {
    const el = document.getElementById(hash.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", hash === "#top" ? "/" : hash);
      return;
    }
  }
  router.push(`/${hash}`);
}

/**
 * ⌘K / Ctrl+K command palette. A native <dialog> with the combobox +
 * listbox pattern: type to filter, ↑ ↓ to move, Enter to run, Esc to close.
 */
export function CommandPalette({ openOnMount = false }: { openOnMount?: boolean }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const baseId = useId();

  const [mode, setMode] = useState<"search" | "ask">("search");
  const { exchanges, ask, reset } = useAsk();

  const commands = useMemo(() => buildCommands(), []);
  const results = useMemo(() => {
    const matches = filterCommands(commands, query);
    const q = query.trim();
    if (!q || (!looksLikeQuestion(q) && matches.length > 0)) return matches;
    const askCommand: Command = {
      id: "ask-query",
      label: `Ask: “${q}”`,
      group: "Ask",
      hint: "Instant answer from this site's content",
      action: { type: "ask", question: q },
    };
    return [askCommand, ...matches.filter((c) => c.action.type !== "ask")];
  }, [commands, query]);
  const groupStarts = useMemo(() => results.map((c, i) => i === 0 || results[i - 1]!.group !== c.group), [results]);

  const open = useCallback(() => {
    const el = dialog.current;
    if (!el || el.open) return;
    setQuery("");
    setActive(0);
    setMode("search");
    reset();
    el.showModal();
    requestAnimationFrame(() => input.current?.focus());
  }, [reset]);

  const close = useCallback(() => dialog.current?.close(), []);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, [open, close]);

  // Loaded lazily by the first ⌘K / click, so open straight away.
  useEffect(() => {
    if (!openOnMount) return;
    const id = requestAnimationFrame(() => open());
    return () => cancelAnimationFrame(id);
  }, [openOnMount, open]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  // Keep the highlighted option visible while arrowing through the list.
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const startAsk = (question: string) => {
    setMode("ask");
    setQuery("");
    ask(question);
    requestAnimationFrame(() => input.current?.focus());
  };

  const backToSearch = () => {
    setMode("search");
    setActive(0);
    requestAnimationFrame(() => input.current?.focus());
  };

  const run = async (command: Command) => {
    const action = command.action;
    if (action.type === "ask") {
      startAsk(action.question);
      return;
    }
    close();
    switch (action.type) {
      case "navigate":
        if (action.href.startsWith("/#")) goToSection(router, action.href.slice(1));
        else router.push(action.href);
        break;
      case "external":
        if (action.href.startsWith("mailto:")) window.location.href = action.href;
        else window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "download": {
        const a = document.createElement("a");
        a.href = action.href;
        a.download = "";
        a.click();
        break;
      }
      case "copy":
        try {
          await navigator.clipboard.writeText(action.text);
          setToast(action.message);
        } catch {
          setToast("Couldn't copy — please copy it manually");
        }
        break;
      case "wave":
        requestWave();
        goToSection(router, "#about");
        break;
      case "rebuild":
        requestRebuild();
        goToSection(router, "#top");
        break;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (mode === "ask") {
      if (event.key === "Enter" && query.trim()) {
        event.preventDefault();
        startAsk(query);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Home") {
      setActive(0);
    } else if (event.key === "End") {
      setActive(Math.max(results.length - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = results[active];
      if (command) void run(command);
    }
  };

  const listboxId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-option-${i}`;

  return (
    <>
      <dialog
        ref={dialog}
        aria-label="Command menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onCancel={(event) => {
          // In an answer, Esc steps back to search; a second Esc closes.
          if (mode === "ask") {
            event.preventDefault();
            backToSearch();
          }
        }}
        className="command-dialog m-auto mt-[12vh] w-[min(100%-1.5rem,38rem)] max-w-none overflow-hidden rounded-2xl border border-line-strong bg-ink-900/95 p-0 text-fg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(69_217_255/0.08)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          {mode === "ask" ? (
            <Sparkles aria-hidden size={18} className="shrink-0 text-cyan" />
          ) : (
            <Search aria-hidden size={18} className="shrink-0 text-subtle" />
          )}
          <input
            ref={input}
            type="text"
            role={mode === "search" ? "combobox" : undefined}
            aria-expanded={mode === "search" ? "true" : undefined}
            aria-controls={mode === "search" ? listboxId : undefined}
            aria-activedescendant={mode === "search" && results[active] ? optionId(active) : undefined}
            aria-autocomplete={mode === "search" ? "list" : undefined}
            aria-label={mode === "search" ? "Search or ask a question" : "Ask a follow-up question"}
            placeholder={mode === "search" ? "Search, or ask anything about my work…" : "Ask a follow-up…"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 w-full bg-transparent text-[0.98rem] text-fg placeholder:text-subtle focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden shrink-0 rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-subtle sm:block">ESC</kbd>
        </div>

        {mode === "ask" ? (
          <AskPanel exchanges={exchanges} onBack={backToSearch} onNavigate={close} />
        ) : (
        <ul ref={list} id={listboxId} role="listbox" aria-label="Commands" className="max-h-[min(58vh,26rem)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-10 text-center text-sm text-subtle">No matches for “{query}”.</li>}
          {results.map((command, i) => {
            const header = groupStarts[i] ? command.group : null;
            const selected = i === active;
            return (
              <li key={command.id} role="presentation">
                {header && (
                  <p role="presentation" className="px-3 pb-1.5 pt-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-subtle">
                    {header}
                  </p>
                )}
                <div
                  id={optionId(i)}
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  onPointerMove={() => setActive(i)}
                  onClick={() => void run(command)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    selected ? "bg-cyan/[0.09] text-fg" : "text-muted",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{command.label}</span>
                    {command.hint && <span className="block truncate text-xs text-subtle">{command.hint}</span>}
                  </span>
                  {command.action.type === "ask" && <Sparkles aria-hidden size={14} className="shrink-0 text-cyan/70" />}
                  {command.action.type === "external" && <ArrowUpRight aria-hidden size={14} className="shrink-0 text-subtle" />}
                  {selected && <CornerDownLeft aria-hidden size={14} className="shrink-0 text-cyan" />}
                </div>
              </li>
            );
          })}
        </ul>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-subtle">
          <span className="flex items-center gap-1.5">
            <CommandIcon aria-hidden size={12} /> Jitendra Builds
          </span>
          <span className="hidden gap-3 sm:flex">
            {mode === "search" ? (
              <>
                <span>↑↓ move</span>
                <span>↵ open</span>
              </>
            ) : (
              <>
                <span>↵ ask</span>
                <span>esc back</span>
              </>
            )}
          </span>
        </div>
      </dialog>

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        {toast && (
          <p className="hero-rise rounded-full border border-cyan/30 bg-ink-900/95 px-4 py-2 text-sm text-fg shadow-xl backdrop-blur" style={{ ["--d" as string]: 0 }}>
            {toast}
          </p>
        )}
      </div>
    </>
  );
}
