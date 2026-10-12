"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OPEN_PALETTE_EVENT } from "./palette-events";

const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), { ssr: false });

/**
 * Keeps the palette (and its command data) out of the initial bundle: it is
 * fetched on the first ⌘K / Ctrl+K or trigger click, then opened.
 */
export function CommandPaletteLoader() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setLoad(true);
      }
    };
    const onOpen = () => setLoad(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [load]);

  return load ? <CommandPalette openOnMount /> : null;
}
