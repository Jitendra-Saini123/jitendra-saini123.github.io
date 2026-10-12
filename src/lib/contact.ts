export const enquiryTopics = [
  "A mobile app project",
  "An AI-powered product",
  "A full-time or contract role",
  "Something else",
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number];

export interface ContactDraft {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactDraft, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MESSAGE_MIN_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 4000;

export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {};
  const name = draft.name.trim();
  const email = draft.email.trim();
  const message = draft.message.trim();

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > 120) errors.name = "That name is a little long — 120 characters at most.";

  if (!email) errors.email = "Please add an email address so I can reply.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "That email address doesn't look quite right.";

  if (!enquiryTopics.includes(draft.topic as EnquiryTopic)) errors.topic = "Please choose what you're reaching out about.";

  if (message.length < MESSAGE_MIN_LENGTH)
    errors.message = `A little more detail helps — at least ${MESSAGE_MIN_LENGTH} characters.`;
  else if (message.length > MESSAGE_MAX_LENGTH)
    errors.message = `Please keep it under ${MESSAGE_MAX_LENGTH} characters, or email me directly.`;

  return errors;
}

/**
 * Builds a mailto: URL that opens the visitor's own email client with the
 * message prefilled. Nothing is sent or stored by the website.
 */
export function buildMailtoUrl(to: string, draft: ContactDraft, subjectPrefix: string): string {
  const subject = `${subjectPrefix} — ${draft.topic}`;
  const body = [
    draft.message.trim(),
    "",
    "—",
    `${draft.name.trim()}`,
    `${draft.email.trim()}`,
  ].join("\n");

  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which some mail clients show literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}
