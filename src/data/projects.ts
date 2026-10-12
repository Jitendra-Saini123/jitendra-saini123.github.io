import type { Project, ProjectImage } from "@/types";

/**
 * Project data.
 *
 * Sources: the project repositories in ~/StudioProjects, the public Google Play
 * listings and viralhunter.in (all checked 9 Oct 2026). No user counts, revenue
 * or ratings are shown on purpose — add them only once you're happy to stand
 * behind them publicly.
 *
 * Image `kind` matters: "screenshot" means captured from the real product,
 * "promo" means marketing artwork and is labelled as such in the UI.
 */

const P = "/images/projects";

function shot(src: string, alt: string, width: number, height: number, caption?: string): ProjectImage {
  return { src, alt, width, height, kind: "screenshot", caption };
}

function promo(src: string, alt: string, width: number, height: number, caption?: string): ProjectImage {
  return { src, alt, width, height, kind: "promo", caption };
}

/* ---------------------------------- PDFify --------------------------------- */

const pdfifyFrames = {
  hero: promo(`${P}/pdfify/promo-frame-50.webp`, "PDFify promo frame: turn any photos into crisp PDFs", 540, 960),
  features: promo(`${P}/pdfify/promo-frame-200.webp`, "PDFify promo frame listing drag-and-drop reorder, AES-256 encryption and the PDF hub", 540, 960),
  offline: promo(`${P}/pdfify/promo-frame-540.webp`, "PDFify promo frame: 100% offline, zero cloud", 540, 960),
  noWatermark: promo(`${P}/pdfify/promo-frame-690.webp`, "PDFify promo frame: zero watermarks, unlimited conversions, no subscriptions", 540, 960),
};

const pdfify: Project = {
  slug: "pdfify",
  name: "PDFify",
  tier: "featured",
  category: "Mobile app · Productivity",
  platforms: ["mobile"],
  status: { kind: "live", label: "Live on Google Play" },
  summary:
    "A Flutter-based Android app for practical PDF workflows — scan, convert, sign, compress and password-protect documents without uploading them anywhere.",
  highlights: [
    "Every conversion and encryption runs on-device — no account, no cloud uploads",
    "Memory-safe batch conversion, processed in background isolates",
    "AES-256 password protection, compression and signatures",
  ],
  stack: ["Flutter", "Dart", "Riverpod", "GoRouter", "Hive", "Syncfusion PDF", "ML Kit", "AdMob", "Play Billing"],
  accent: "#FF4D6D",
  year: "2026",
  publisher: "J-Tech Utilities",
  updated: "2026-09-29",
  icon: promo(`${P}/pdfify/icon.webp`, "PDFify app icon", 256, 256),
  visual: {
    variant: "phone-stack",
    images: [pdfifyFrames.hero, pdfifyFrames.features, pdfifyFrames.offline],
    label: "Frames from the launch video",
  },
  gallery: [pdfifyFrames.hero, pdfifyFrames.features, pdfifyFrames.offline, pdfifyFrames.noWatermark],
  video: {
    src: "/media/pdfify-showcase.mp4",
    poster: `${P}/pdfify/showcase-poster.webp`,
    width: 540,
    height: 960,
    caption: "30-second launch video, composed in React with Remotion.",
    hasAudio: true,
  },
  links: [
    { label: "Get it on Google Play", href: "https://play.google.com/store/apps/details?id=com.jitendra.pdfify", kind: "store" },
  ],
  metrics: [
    { value: "8", label: "screens routed with GoRouter" },
    { value: "9", label: "feature modules" },
    { value: "AES-256", label: "PDF password encryption" },
    { value: "0", label: "document uploads — everything runs on-device" },
  ],
  architecture: {
    caption: "From photo to protected PDF without leaving the phone. Heavy work runs in background isolates so the UI stays responsive.",
    columns: 4,
    rows: 2,
    nodes: [
      { id: "capture", label: "Capture", detail: "Gallery picker · ML Kit scanner", col: 0, row: 0 },
      { id: "arrange", label: "Arrange & edit", detail: "Immutable page list · crop, rotate", col: 1, row: 0 },
      { id: "isolate", label: "Background isolate", detail: "Decode → downsample → compress", col: 2, row: 0, core: true },
      { id: "pdf", label: "PDF engine", detail: "pdf + printing", col: 3, row: 0 },
      { id: "encrypt", label: "AES-256", detail: "Syncfusion, in an isolate", col: 3, row: 1 },
      { id: "share", label: "Save · share · print", detail: "share_plus · printing", col: 2, row: 1 },
      { id: "library", label: "PDF library", detail: "Hive history + device index", col: 1, row: 1 },
    ],
    edges: [
      ["capture", "arrange"],
      ["arrange", "isolate"],
      ["isolate", "pdf"],
      ["pdf", "encrypt"],
      ["pdf", "share"],
      ["encrypt", "share"],
      ["share", "library"],
    ],
  },
  caseStudy: {
    overview:
      "PDFify turns photos and scans into clean PDFs and handles the follow-up tasks people actually need: reordering and cropping pages, adding a signature, compressing large files and locking confidential documents with a password.",
    problem:
      "Many document apps upload files to a server, stamp watermarks on the output or put basic conversion behind a subscription. For receipts, IDs and contracts, people need a tool that is fast, predictable and private.",
    role:
      "Solo developer — product scope, UI, architecture, implementation, monetization and the Google Play release, published under my developer name J-Tech Utilities. I also produced the launch video in React with Remotion.",
    approach: [
      "Feature-first Flutter architecture with Riverpod for state and GoRouter for navigation.",
      "PDF generation with the pdf and printing packages; AES-256 encryption through Syncfusion's PDF library.",
      "Camera scanning with Google ML Kit's document scanner for edge detection and perspective correction.",
      "Local history in Hive, plus a scanner that indexes PDFs already on the device so the app works as an everyday PDF hub.",
    ],
    decisions: [
      {
        title: "Memory-safe conversion",
        body: "Images are decoded, downsampled to a capped size, compressed and embedded one at a time in a background isolate, so large batches of high-resolution photos don't freeze the UI or exhaust memory on low-end phones.",
      },
      {
        title: "Page order you can trust",
        body: "The page list is immutable and only ever replaced through Riverpod state updates — removing a whole class of reordering bugs that are common in this category.",
      },
      {
        title: "Respectful monetization",
        body: "Unlimited conversions without watermarks on the free tier and a one-time Pro unlock instead of a subscription. Interstitial ads never appear on a first conversion and are frequency-capped after that.",
      },
    ],
    statusDetail: "Published on Google Play for Android and actively maintained; the latest update shipped in September 2026.",
  },
};

/* ------------------------------- Mega Site ---------------------------------- */

const megaShots = {
  early: shot(`${P}/mega-site/early-game.webp`, "Mega Site early game at site level 15: Apex Spire Citadel phase 4 of 10 and the supply chain pipeline", 600, 1761, "Early game — the first supply chain (Lv. 15)"),
  mid: shot(`${P}/mega-site/mid-game.webp`, "Mega Site mid game at level 48: contracts for limestone, coal coke, iron ore, cement and steel", 600, 1788, "Mid game — contracts and refineries (Lv. 48)"),
  end: shot(`${P}/mega-site/endgame.webp`, "Mega Site endgame at level 95: blueprint of the Apex Spire Citadel at phase 25 of 30", 600, 1652, "Endgame — the Apex Spire Citadel (Lv. 95)"),
  prestige: shot(`${P}/mega-site/prestige.webp`, "Mega Site corporate buyout prestige screen at level 100", 600, 1433, "Prestige — the corporate buyout (Lv. 100)"),
  daily: shot(`${P}/mega-site/daily-bonus.webp`, "Mega Site daily login bonus with a seven-day streak", 600, 1360, "Daily login streak"),
  store: shot(`${P}/mega-site/store.webp`, "Mega Site Megacorp store with one-time purchases", 600, 1360, "Megacorp store (one-time purchases)"),
};

const megaSite: Project = {
  slug: "mega-site",
  name: "Mega Site: Civil Tycoon",
  tier: "featured",
  category: "Indie game · Android",
  platforms: ["game", "mobile"],
  status: {
    kind: "in-development",
    label: "In development",
    note: "Not yet publicly listed on Google Play",
  },
  summary:
    "An idle construction simulation centred on industrial production, resource management and large-scale construction — from the first limestone quarry to a 1,400-metre megaproject.",
  highlights: [
    "Nested supply chains: raw materials feed refineries that feed construction",
    "Offline earnings, daily streaks and a prestige loop",
    "Game economy in pure, tested Dart use cases — separate from the UI",
  ],
  stack: ["Flutter", "Dart", "BLoC", "Drift (SQLite)", "GetIt", "AdMob", "Local notifications"],
  accent: "#F5B400",
  year: "2026",
  icon: promo(`${P}/mega-site/icon.webp`, "Mega Site app icon", 256, 256),
  visual: {
    variant: "phone-fan",
    // Order: [front-centre, left, right] — reads left to right as a progression.
    images: [megaShots.mid, megaShots.early, megaShots.end],
    label: "Lv. 15 → Lv. 48 → Lv. 95",
  },
  gallery: [megaShots.early, megaShots.mid, megaShots.end, megaShots.prestige, megaShots.daily, megaShots.store],
  links: [],
  metrics: [
    { value: "5", label: "domain use cases — tick, upgrade resource, upgrade site, offline earnings, prestige" },
    { value: "5", label: "resources in the supply chain" },
    { value: "8", label: "test files covering the engine, persistence and BLoC" },
  ],
  architecture: {
    caption: "The economy is pure Dart, independent of the UI — which is what makes it testable.",
    columns: 4,
    rows: 2,
    nodes: [
      { id: "ui", label: "Flutter UI", detail: "Game screen · dialogs", col: 0, row: 0 },
      { id: "bloc", label: "GameBloc", detail: "Events · game loop", col: 1, row: 0 },
      { id: "domain", label: "Domain use cases", detail: "Tick · upgrade · offline earnings · prestige", col: 2, row: 0, core: true },
      { id: "repo", label: "Repository", detail: "Game state", col: 3, row: 0 },
      { id: "services", label: "Services", detail: "Audio · notifications · ads · review", col: 1, row: 1 },
      { id: "drift", label: "Drift (SQLite)", detail: "Save coordinator", col: 3, row: 1 },
    ],
    edges: [
      ["ui", "bloc"],
      ["bloc", "domain"],
      ["domain", "repo"],
      ["repo", "drift"],
      ["bloc", "services"],
    ],
  },
  caseStudy: {
    overview:
      "Mega Site is an idle/incremental game about running a construction megaproject. Limestone, coal coke and iron ore feed a cement kiln and a blast furnace; their output pays for new site levels, a workforce and, eventually, the Apex Spire Citadel — before a corporate buyout resets the run with a permanent boost.",
    problem:
      "Idle games live or die on pacing. The design challenge was to make a supply-chain economy readable on a phone screen and keep progression satisfying from the first minute to the endgame prestige.",
    role: "Solo developer and designer — game economy, systems, UI and art direction, monetization and release preparation.",
    approach: [
      "Clean architecture: ticking resources, upgrades, offline earnings and prestige are pure Dart use cases, independent of Flutter widgets.",
      "BLoC drives the game loop and UI state; GetIt handles dependency injection.",
      "Game state persisted in SQLite with Drift through a save coordinator.",
      "Retention features built in: local notifications, audio feedback, daily rewards and an in-app review prompt.",
    ],
    decisions: [
      {
        title: "Simulation separate from rendering",
        body: "Because the economy lives in testable use cases, balancing changes and offline-earnings maths are covered by unit tests instead of play-testing alone.",
      },
      {
        title: "A visual language for the fantasy",
        body: "SCADA-style telemetry feeds, blueprint viewports and phase-based construction make abstract numbers feel like a site coming to life.",
      },
    ],
    statusDetail:
      "In active development and testing. Screenshots are from development builds; the Google Play link will appear here once the listing is public.",
  },
};

/* ------------------------------ Viral Hunter -------------------------------- */

const viralHunter: Project = {
  slug: "viral-hunter",
  name: "Viral Hunter",
  tier: "featured",
  category: "Web app · AI · Creator tools",
  platforms: ["web"],
  status: {
    kind: "early-access",
    label: "Live · early stage",
    note: "Free and Pro plans",
  },
  summary:
    "A web product for discovering short-form content that is gaining momentum, understanding why it works, and turning those patterns into ideas worth posting.",
  highlights: [
    "Viral Score from view velocity, acceleration and reach relative to followers",
    "LLM analysis validated against Zod schemas, with per-user usage limits",
    "Row Level Security on user-facing tables; scraping runs server-side only",
  ],
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Apify", "OpenAI SDK", "Zod", "Razorpay", "Vitest", "Vercel"],
  accent: "#FF6A2B",
  year: "2026",
  icon: promo(`${P}/viral-hunter/icon.webp`, "Viral Hunter logo", 256, 256),
  visual: {
    variant: "browser",
    images: [
      shot(`${P}/viral-hunter/landing-live.webp`, "The live Viral Hunter landing page: Know what's going viral before everyone else", 1440, 900, "viralhunter.in — captured October 2026"),
    ],
    label: "viralhunter.in",
  },
  gallery: [
    shot(`${P}/viral-hunter/landing-live.webp`, "The live Viral Hunter landing page", 1440, 900, "Live landing page — captured October 2026"),
    promo(`${P}/viral-hunter/promo-banner.webp`, "Viral Hunter promotional banner: the AI reel radar", 1376, 768, "Promotional artwork"),
    promo(`${P}/viral-hunter/promo-metrics.webp`, "Abstract promotional artwork of engagement metrics around a flame logo", 1376, 768, "Promotional artwork — not product UI"),
  ],
  links: [{ label: "Visit viralhunter.in", href: "https://viralhunter.in", kind: "website" }],
  metrics: [
    { value: "12", label: "SQL migrations, with Row Level Security from the first" },
    { value: "20", label: "API route handlers" },
    { value: "17", label: "test files (Vitest)" },
    { value: "3", label: "swappable provider interfaces — data, AI, billing" },
  ],
  architecture: {
    caption: "Scheduled ingestion feeds a scoring engine; only high-signal reels reach the LLM, which keeps AI costs proportional to value.",
    columns: 4,
    rows: 2,
    nodes: [
      { id: "cron", label: "Vercel Cron", detail: "Secret-protected trigger", col: 0, row: 0 },
      { id: "apify", label: "Apify fallback chain", detail: "Server-side scraping", col: 1, row: 0 },
      { id: "db", label: "Supabase Postgres", detail: "Reels · metric snapshots · RLS", col: 2, row: 0 },
      { id: "engine", label: "Virality engine", detail: "Velocity · acceleration · Viral Score", col: 3, row: 0, core: true },
      { id: "gate", label: "Auto-analyze gate", detail: "Score & tier thresholds", col: 3, row: 1 },
      { id: "llm", label: "LLM analysis", detail: "Zod-validated structured output", col: 2, row: 1 },
      { id: "ideas", label: "Analysis & ideas", detail: "Cached once per reel", col: 1, row: 1 },
      { id: "app", label: "Next.js app", detail: "Dashboard · trends · ideas", col: 0, row: 1 },
    ],
    edges: [
      ["cron", "apify"],
      ["apify", "db"],
      ["db", "engine"],
      ["engine", "gate"],
      ["gate", "llm"],
      ["llm", "ideas"],
      ["ideas", "app"],
    ],
  },
  caseStudy: {
    overview:
      "Viral Hunter tracks public Instagram Reels over time, ranks them with a Viral Score and uses an LLM to break down hooks, formats and retention triggers. Creators can save reels to a swipe file and generate their own version — script, shot list and caption ideas.",
    problem:
      "Creators spend hours scrolling for inspiration and usually find trends after they've peaked. Copying a reel also doesn't explain why it worked, so the lesson doesn't transfer.",
    role:
      "Solo founder-developer — product, architecture, data pipeline, AI prompts and schemas, UI, billing and deployment. I'm documenting the build in public on YouTube.",
    approach: [
      "Scheduled ingestion: a Vercel cron job triggers a server-side Apify pipeline with a provider fallback chain.",
      "Metric snapshots stored in Supabase Postgres; velocity, acceleration and the Viral Score are computed from successive snapshots.",
      "High-signal reels are auto-analysed behind score and tier gates to keep AI costs predictable, with one cached analysis per reel.",
      "Provider interfaces for data, AI and billing, so a vendor can be swapped without rewriting product logic.",
    ],
    decisions: [
      {
        title: "Structured, not free-form, AI",
        body: "Model responses are validated against Zod schemas before they reach the UI, so the app only renders well-formed analysis.",
      },
      {
        title: "Cost-aware by design",
        body: "Monthly per-user usage counters, de-duplication of in-flight analysis requests and AI usage logs keep spend proportional to value.",
      },
      {
        title: "Security from the first migration",
        body: "Row Level Security on user-facing tables, locked-down privileged database functions, a secret-protected cron endpoint and atomic job locking to prevent overlapping scrapes.",
      },
    ],
    capabilities: {
      implemented: [
        "Breakout feed ranked by Viral Score",
        "AI reel analysis (hook, format, retention triggers)",
        "“Create my version” script and idea generation",
        "Saved reels and an ideas library",
        "Email and Google sign-in",
        "Free plan with monthly limits",
        "Paid Pro plan via Razorpay subscriptions",
      ],
    },
    statusDetail:
      "Live at viralhunter.in with free sign-up and a paid Pro plan. It's an early-stage product — I don't publish user or revenue numbers until there's something meaningful to report.",
  },
};

/* --------------------------- Civil Site Calculator -------------------------- */

const civilSiteCalculator: Project = {
  slug: "civil-site-calculator",
  name: "Civil Site Calculator",
  tier: "more",
  category: "Mobile app · Construction utility",
  platforms: ["mobile"],
  status: { kind: "live", label: "Live on Google Play" },
  summary:
    "Offline calculators for Indian site engineers and contractors — concrete, steel, brickwork, plaster, tiling and BOQ estimates, in English and Hindi.",
  highlights: [
    "Works fully offline with on-device SQLite (Drift)",
    "Branded PDF and Excel export for estimates",
    "Optional Gemini-powered smart input using the user's own key",
  ],
  stack: ["Flutter", "Riverpod", "GoRouter", "Drift", "PDF & Excel export", "Gemini API", "Secure storage", "EN / HI"],
  accent: "#F26B1D",
  year: "2026",
  publisher: "J-Tech Utilities",
  updated: "2026-10-03",
  icon: promo(`${P}/civil-site-calculator/icon.webp`, "Civil Site Calculator app icon", 256, 256),
  visual: {
    variant: "banner",
    images: [promo(`${P}/civil-site-calculator/feature-graphic.webp`, "Civil Site Calculator feature graphic: offline site calculators for India", 1200, 800)],
  },
  gallery: [promo(`${P}/civil-site-calculator/feature-graphic.webp`, "Civil Site Calculator feature graphic", 1200, 800, "Store feature graphic")],
  links: [
    { label: "Get it on Google Play", href: "https://play.google.com/store/apps/details?id=com.civilsitecalc.app", kind: "store" },
  ],
  metrics: [
    { value: "11", label: "calculators, from concrete mix to residential BOQ" },
    { value: "2", label: "languages — English and Hindi" },
    { value: "13", label: "test files" },
  ],
  architecture: {
    caption: "Everything works offline; the optional AI assistant is the only path that leaves the device, using the user's own key.",
    columns: 4,
    rows: 2,
    nodes: [
      { id: "calc", label: "Calculators", detail: "Concrete · steel · brick · BOQ…", col: 0, row: 0 },
      { id: "state", label: "Riverpod", detail: "Inputs · results · settings", col: 1, row: 0 },
      { id: "drift", label: "Drift (SQLite)", detail: "Projects · history · rates", col: 2, row: 0, core: true },
      { id: "export", label: "Export", detail: "Branded PDF · Excel · share", col: 3, row: 0 },
      { id: "assistant", label: "Smart input", detail: "Optional AI assistant", col: 0, row: 1 },
      { id: "gemini", label: "Gemini API", detail: "User-supplied key", col: 1, row: 1 },
      { id: "secure", label: "Secure storage", detail: "Key never in the bundle", col: 2, row: 1 },
    ],
    edges: [
      ["calc", "state"],
      ["state", "drift"],
      ["drift", "export"],
      ["assistant", "calc"],
      ["assistant", "gemini"],
      ["secure", "gemini"],
    ],
  },
  caseStudy: {
    overview:
      "A toolkit of construction calculators — concrete mix, rebar weight, brickwork, plaster, tiling, excavation, RCC slab steel, electrical load and residential BOQ — with saved projects and shareable estimates.",
    problem:
      "Site estimates are often worked out by hand or on generic calculators, on sites with patchy connectivity, and then need to be shared as a professional document.",
    role: "Solo developer — calculators, data model, localisation, export formats, AI integration and Play release under J-Tech Utilities.",
    approach: [
      "Flutter with Riverpod and GoRouter; calculations, projects and history stored locally in SQLite via Drift.",
      "PDF and Excel export with branded output, shared through the system share sheet.",
      "English and Hindi UI with Noto Sans Devanagari so exported documents render correctly.",
    ],
    decisions: [
      {
        title: "No secrets in the app bundle",
        body: "AI is opt-in: users add their own Gemini API key, which is kept in platform secure storage and never shipped with the app.",
      },
      {
        title: "Offline is the default",
        body: "Every calculator works without a network; only the optional AI assistant ever leaves the device.",
      },
    ],
    statusDetail: "Published on Google Play for Android; the latest update shipped in October 2026.",
  },
};

/* -------------------------------- TubeNative -------------------------------- */

const tubeShots = {
  search: shot(`${P}/tubenative/search.webp`, "TubeNative search results with video and channel filters", 600, 1333, "Search with type filters"),
  quality: shot(`${P}/tubenative/quality.webp`, "TubeNative quality sheet with resolutions and audio-only mode", 600, 1333, "Quality selection and audio-only mode"),
  downloads: shot(`${P}/tubenative/downloads.webp`, "TubeNative library showing an offline download", 600, 1333, "Offline downloads library"),
  settings: shot(`${P}/tubenative/settings.webp`, "TubeNative settings for theme, background playback, resume position, speed and quality", 600, 1333, "Playback settings"),
};

const tubeNative: Project = {
  slug: "tubenative",
  name: "TubeNative",
  tier: "more",
  category: "Mobile app · Media · Source-code product",
  platforms: ["mobile"],
  status: { kind: "source-product", label: "Sold as source code" },
  summary:
    "A Material 3 Flutter media client for Android with offline downloads, picture-in-picture and background audio — packaged and licensed to developers as a complete source-code product.",
  highlights: [
    "media_kit player with quality selection, audio-only mode and PiP",
    "Offline downloads, history and favourites",
    "Ships with tests, documentation and a release checklist",
  ],
  stack: ["Flutter", "Dart", "Riverpod", "GoRouter", "Hive", "media_kit", "Material 3"],
  accent: "#7C83FF",
  year: "2026",
  icon: promo(`${P}/tubenative/icon.webp`, "TubeNative logo", 256, 256),
  visual: {
    variant: "banner",
    images: [promo(`${P}/tubenative/banner.webp`, "TubeNative banner: production Flutter Android media client", 1280, 720)],
  },
  gallery: [
    promo(`${P}/tubenative/banner.webp`, "TubeNative banner", 1280, 720, "Product banner"),
    tubeShots.search,
    tubeShots.quality,
    tubeShots.downloads,
    tubeShots.settings,
  ],
  links: [{ label: "Product page", href: "https://jitendra-saini123.github.io/nativestack/", kind: "product" }],
  caseStudy: {
    overview:
      "TubeNative is an unofficial Android client for YouTube content built entirely in Flutter — search, playback with quality and speed controls, audio-only mode, picture-in-picture, background audio and offline downloads. It is not affiliated with YouTube or Google.",
    problem:
      "Developers who want to learn production media-app patterns in Flutter rarely get to see a complete, structured codebase — player state, downloads, persistence and platform integration working together.",
    role: "Solo developer — app architecture and implementation, plus packaging it as a product: documentation, licence, disclaimer, tests and a release checklist.",
    approach: [
      "Riverpod for state, GoRouter for navigation and Hive for history, favourites and download metadata.",
      "media_kit for playback, with background audio and Android picture-in-picture.",
      "Material 3 theming with persistent playback preferences (speed, quality, resume position).",
    ],
    decisions: [
      {
        title: "A codebase as the product",
        body: "Selling source code means the structure, naming and docs are the user experience. It's distributed as a one-time licence through my NativeStack storefront.",
      },
    ],
    statusDetail: "Available as a one-time source-code licence via NativeStack. Screenshots show third-party video thumbnails for illustration only.",
  },
};

/* ------------------------------ Client work ------------------------------- */
/* Built as a Flutter Developer at Sublimity Softwares. Only public store
   listings and résumé facts are shown — no client screenshots or internals. */

const fireArrest: Project = {
  slug: "firearrest",
  name: "FireArrest",
  tier: "client",
  category: "Client work · Fire-safety inspection",
  platforms: ["mobile"],
  status: { kind: "client", label: "Shipped for a client" },
  summary:
    "An offline-first inspection app for fire-protection professionals. I rebuilt it from scratch in Flutter and migrated inspectors from two legacy native apps with zero data loss.",
  highlights: [
    "Conflict-aware background sync with WorkManager and BackgroundFetch",
    "Photos, QR codes, dynamic forms and signatures captured offline at pin level",
    "Separate download and upload sync pipelines over a Dio-based REST layer",
  ],
  stack: ["Flutter", "Drift (SQLite)", "WorkManager", "BackgroundFetch", "Dio", "Clean Architecture"],
  accent: "#45D9FF",
  visual: { variant: "banner", images: [] },
  gallery: [],
  links: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.firearrest", kind: "store" }],
};

const clockedIn: Project = {
  slug: "clockedin-hrm",
  name: "ClockedIn HRM",
  tier: "client",
  category: "Client work · HR & attendance",
  platforms: ["mobile"],
  status: { kind: "client", label: "Shipped for a client" },
  summary:
    "A multi-tenant HR and attendance platform shipped as two branded flavours from one Flutter codebase, with face, NFC and PIN clock-in.",
  highlights: [
    "50+ screens across 30+ modules behind OAuth2, MFA and role-based entitlements",
    "Face recognition, NFC and PIN clock-in with GPS validation and an offline punch queue",
    "Two Android attendance kiosks (facial and palm biometrics) with native lock-down",
  ],
  stack: ["Flutter", "GetX", "Dio", "ObjectBox", "ML Kit", "TensorFlow Lite", "NFC", "MinIO / S3"],
  accent: "#8B70FF",
  visual: { variant: "banner", images: [] },
  gallery: [],
  links: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.clockedin.one", kind: "store" }],
};

export const projects: Project[] = [pdfify, megaSite, viralHunter, civilSiteCalculator, tubeNative, fireArrest, clockedIn];
