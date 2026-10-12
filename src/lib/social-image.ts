import { siteConfig } from "@/config/site";

/**
 * Social cards and the touch icon are rendered at build time by route
 * handlers whose paths end in `.png` (src/app/og.png, src/app/apple-icon.png,
 * src/app/work/[slug]/og.png). The extension matters: static hosts such as
 * GitHub Pages pick the content type from it, and crawlers expect image/png.
 */
export const ogImageSize = { width: 1200, height: 630 };

export const defaultOgImage = {
  url: "/og.png",
  ...ogImageSize,
  type: "image/png",
  alt: `${siteConfig.name} — Flutter Developer, AI Builder & Indie Maker`,
};

export function caseStudyOgImage(slug: string, name: string) {
  return {
    url: `/work/${slug}/og.png`,
    ...ogImageSize,
    type: "image/png",
    alt: `${name} — case study by ${siteConfig.name}`,
  };
}

export const appleIcon = { url: "/apple-icon.png", sizes: "180x180", type: "image/png" };
