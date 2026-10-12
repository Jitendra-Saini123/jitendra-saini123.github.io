const PLACEHOLDER_PATTERN = /REPLACE|example\.(com|org)|your-?domain|todo/i;

/**
 * True when a URL is safe to render as a working link: http(s), mailto or an
 * in-page/relative path, and not an obvious placeholder.
 */
export function isUsableUrl(href: string | undefined | null): href is string {
  if (!href) return false;
  const value = href.trim();
  if (!value || PLACEHOLDER_PATTERN.test(value)) return false;
  if (value.startsWith("#") || value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Attributes for links that leave the site. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
