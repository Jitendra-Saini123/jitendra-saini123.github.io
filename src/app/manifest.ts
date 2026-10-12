import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { appleIcon } from "@/lib/social-image";

// Generated once at build time (also required for the static export).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.brand}`,
    short_name: siteConfig.brand,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050711",
    theme_color: "#050711",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: appleIcon.url, sizes: appleIcon.sizes, type: appleIcon.type },
    ],
  };
}
