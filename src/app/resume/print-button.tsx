"use client";

import { Printer } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-link";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses("primary", "md", "h-10")}>
      <Printer aria-hidden size={15} /> Print or save as PDF
    </button>
  );
}
