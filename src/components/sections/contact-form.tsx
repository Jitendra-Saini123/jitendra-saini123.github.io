"use client";

import { type FormEvent, useId, useRef, useState } from "react";
import { ArrowRight, Info, Mail } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-link";
import {
  buildMailtoUrl,
  type ContactDraft,
  type ContactErrors,
  enquiryTopics,
  MESSAGE_MAX_LENGTH,
  validateContact,
} from "@/lib/contact";
import { cn } from "@/lib/cn";

const empty: ContactDraft = { name: "", email: "", topic: "", message: "" };

const fieldClass =
  "w-full rounded-xl border bg-ink-950/70 px-4 py-3 text-[0.95rem] text-fg placeholder:text-subtle transition-colors duration-200 focus:border-cyan/70 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-cyan/25";

/**
 * There is no backend: the form validates the message, then opens the
 * visitor's own email app with everything prefilled. Nothing is stored or sent
 * by the site, and the success state says exactly that.
 */
export function ContactForm({ email, subject }: { email: string; subject: string }) {
  const id = useId();
  const [draft, setDraft] = useState<ContactDraft>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "opened">("idle");
  const form = useRef<HTMLFormElement>(null);

  const update = (field: keyof ContactDraft) => (value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(draft);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof ContactDraft)[])[0];
    if (firstInvalid) {
      form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      setStatus("idle");
      return;
    }
    window.location.href = buildMailtoUrl(email, draft, subject);
    setStatus("opened");
  };

  const describedBy = (field: keyof ContactDraft) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <form ref={form} noValidate onSubmit={onSubmit} aria-describedby={`${id}-privacy`} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-medium">
            Your name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={draft.name}
            onChange={(e) => update("name")(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={cn(fieldClass, errors.name ? "border-red-400/70" : "border-line-strong")}
            placeholder="Ada Lovelace"
          />
          {errors.name && (
            <p id={`${id}-name-error`} className="mt-1.5 text-xs text-red-300">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={draft.email}
            onChange={(e) => update("email")(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={cn(fieldClass, errors.email ? "border-red-400/70" : "border-line-strong")}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p id={`${id}-email-error`} className="mt-1.5 text-xs text-red-300">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <fieldset aria-describedby={describedBy("topic")}>
        <legend className="mb-2 block text-sm font-medium">I&rsquo;m reaching out about</legend>
        <div className="flex flex-wrap gap-2">
          {enquiryTopics.map((topic) => {
            const selected = draft.topic === topic;
            return (
              <label
                key={topic}
                className={cn(
                  "cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan/60",
                  selected ? "border-cyan/60 bg-cyan/[0.08] text-fg" : "border-line-strong text-muted hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name="topic"
                  value={topic}
                  checked={selected}
                  onChange={(e) => update("topic")(e.target.value)}
                  className="sr-only"
                />
                {topic}
              </label>
            );
          })}
        </div>
        {errors.topic && (
          <p id={`${id}-topic-error`} className="mt-1.5 text-xs text-red-300">
            {errors.topic}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor={`${id}-message`} className="mb-2 block text-sm font-medium">
          What are you working on?
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          value={draft.message}
          onChange={(e) => update("message")(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={cn(fieldClass, "resize-y", errors.message ? "border-red-400/70" : "border-line-strong")}
          placeholder="A little context: the product, where it's at, and what you need help with."
        />
        {errors.message && (
          <p id={`${id}-message-error`} className="mt-1.5 text-xs text-red-300">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className={buttonClasses("primary", "lg", "shrink-0 whitespace-nowrap")}>
          <Mail aria-hidden size={17} />
          Compose email
          <ArrowRight aria-hidden size={16} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </button>
        <p id={`${id}-privacy`} className="flex max-w-xs gap-2 text-xs leading-relaxed text-subtle">
          <Info aria-hidden size={14} className="mt-0.5 shrink-0" />
          Nothing is stored or sent by this site — it opens your own email app with the message ready to review and send.
        </p>
      </div>

      <div role="status" aria-live="polite">
        {status === "opened" && (
          <p className="rounded-xl border border-cyan/30 bg-cyan/[0.06] p-4 text-sm leading-relaxed text-fg/90">
            Your email app should now be open with the message ready — just press send. If nothing happened, email me directly at{" "}
            <a href={`mailto:${email}`} className="text-cyan underline underline-offset-4">
              {email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
