export type SocialId = "email" | "github" | "linkedin" | "telegram" | "youtube";

export interface SocialLink {
  id: SocialId;
  label: string;
  /** Visible handle, e.g. "@jitendra161". */
  handle: string;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectPlatform = "mobile" | "web" | "game";

export type ProjectFilter = "all" | ProjectPlatform;

/** featured = large editorial rows, more = secondary cards, client = professional work. */
export type ProjectTier = "featured" | "more" | "client";

export type ProjectStatusKind = "live" | "early-access" | "in-development" | "source-product" | "client";

export interface ProjectStatus {
  kind: ProjectStatusKind;
  label: string;
  note?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "store" | "website" | "source" | "product" | "video";
}

/**
 * `screenshot` — captured from the real product.
 * `promo` — marketing artwork; never presented as real UI.
 */
export type MediaKind = "screenshot" | "promo";

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: MediaKind;
  caption?: string;
}

export interface ProjectVideo {
  src: string;
  poster: string;
  width: number;
  height: number;
  caption: string;
  hasAudio: boolean;
}

export interface CaseStudy {
  overview: string;
  problem: string;
  role: string;
  approach: string[];
  decisions: { title: string; body: string }[];
  /** Optional split between what is shipped, what is experimental and what is planned. */
  capabilities?: {
    implemented: string[];
    experimental?: string[];
    planned?: string[];
  };
  statusDetail: string;
}

export type ProjectVisualVariant = "phone-fan" | "phone-stack" | "browser" | "banner";

/** A figure counted directly from the project's source code. */
export interface ProjectMetric {
  value: string;
  label: string;
}

/** A node in a case study's architecture diagram, placed on a small grid. */
export interface ArchitectureNode {
  id: string;
  label: string;
  detail?: string;
  col: number;
  row: number;
  /** Highlights the node that holds the project's core logic. */
  core?: boolean;
}

export interface ProjectArchitecture {
  caption: string;
  columns: number;
  rows: number;
  nodes: ArchitectureNode[];
  edges: [from: string, to: string][];
}

export interface Project {
  slug: string;
  name: string;
  tier: ProjectTier;
  category: string;
  platforms: ProjectPlatform[];
  status: ProjectStatus;
  /** One or two sentences. Shown everywhere the project appears. */
  summary: string;
  highlights: string[];
  stack: string[];
  /** Brand colour of the product, used for glows around its imagery. */
  accent: string;
  year?: string;
  publisher?: string;
  /** Last public release date (ISO), e.g. from the store listing. */
  updated?: string;
  icon?: ProjectImage;
  visual: {
    variant: ProjectVisualVariant;
    images: ProjectImage[];
    /** Short label rendered on the visual, e.g. a level progression. */
    label?: string;
  };
  gallery: ProjectImage[];
  video?: ProjectVideo;
  links: ProjectLink[];
  metrics?: ProjectMetric[];
  architecture?: ProjectArchitecture;
  caseStudy?: CaseStudy;
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface ExperienceProduct {
  name: string;
  description: string;
  points: string[];
  href?: string;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  kind: "full-time" | "independent" | "internship" | "education";
  summary?: string;
  products?: ExperienceProduct[];
  points?: string[];
  stack?: string[];
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

/**
 * production — used in client applications shipped to the app stores.
 * shipped    — used in my own released products.
 * exploring  — actively learning and experimenting with.
 */
export type SkillDepth = "production" | "shipped" | "exploring";

export interface Skill {
  name: string;
  depth: SkillDepth;
  evidence: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  short: string;
  description: string;
  skills: Skill[];
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export type ContentCategory = "Building in public" | "AI engineering" | "Product demo" | "Tutorial" | "Article";

export interface ContentEntry {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  category: ContentCategory;
  format: "video" | "short" | "article";
  language?: string;
}
