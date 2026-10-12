import type { ContentEntry } from "@/types";

/**
 * Videos from the Jitendra Builds YouTube channel (checked via the public RSS
 * feed on 9 Oct 2026). Add new entries at the top; thumbnails come straight
 * from YouTube, so no API key is needed.
 */

// Landscape videos use the 16:9 "maxresdefault"; Shorts use the vertical "oar2" frame.
const thumb = (id: string, variant: "maxresdefault" | "oar2" = "maxresdefault") => `https://i.ytimg.com/vi/${id}/${variant}.jpg`;

export const contentIntro = {
  channelName: "Jitendra Builds",
  description:
    "Building in public: what I'm shipping, what breaks, and what I learn about Flutter, AI products and agentic workflows — in English and Hindi.",
};

export const contentEntries: ContentEntry[] = [
  {
    id: "ZstZJNK6j4g",
    title: "40% AI Agents होंगे बंद? Gartner का अनुमान और असली वजहें",
    description:
      "Why so many agentic AI projects stall between demo and production — compounding errors, context rot, prompt injection, messy real-world data and missing evals — and what to do about it.",
    url: "https://www.youtube.com/watch?v=ZstZJNK6j4g",
    thumbnail: thumb("ZstZJNK6j4g"),
    publishedAt: "2026-10-09",
    category: "AI engineering",
    format: "video",
    language: "Hindi",
  },
  {
    id: "MQHMysikevY",
    title: "YouTube Without Ads Actually Exists?! 🤯",
    description:
      "A quick look at TubeNative — a lightweight Material 3 Android client with background audio, picture-in-picture and offline downloads, built in Flutter.",
    url: "https://www.youtube.com/shorts/MQHMysikevY",
    thumbnail: thumb("MQHMysikevY", "oar2"),
    publishedAt: "2026-10-05",
    category: "Product demo",
    format: "short",
  },
  {
    id: "gvldV1Fdu6k",
    title: "I Quit Client Work to Build My Own AI SaaS | Building in Public",
    description: "After 3.5 years of building apps for clients, I'm building my own AI SaaS — Viral Hunter — in public.",
    url: "https://www.youtube.com/shorts/gvldV1Fdu6k",
    thumbnail: thumb("gvldV1Fdu6k", "oar2"),
    publishedAt: "2026-10-03",
    category: "Building in public",
    format: "short",
  },
];
