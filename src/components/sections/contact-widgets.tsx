"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Live local time for the given time zone. Rendered after mount to avoid hydration mismatches. */
export function LocalTime({ timeZone, city }: { timeZone: string; city: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span>
      {time ? (
        <>
          It&rsquo;s <span className="text-fg">{time}</span> in {city}
        </>
      ) : (
        <>Local time in {city}</>
      )}
    </span>
  );
}

/** Copies the email address, with an accessible confirmation. */
export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const id = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(id);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition-colors hover:border-cyan/60 hover:text-fg"
      >
        {state === "copied" ? <Check size={15} aria-hidden className="text-signal-green" /> : <Copy size={15} aria-hidden />}
        <span className="sr-only">Copy email address</span>
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Email address copied" : state === "failed" ? "Couldn't copy — please select the address manually" : ""}
      </span>
    </>
  );
}
