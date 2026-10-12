import type { SkillDepth, SkillGroup } from "@/types";

export const depthMeta: Record<SkillDepth, { label: string; description: string }> = {
  production: {
    label: "Production",
    description: "Used in client applications shipped to the app stores.",
  },
  shipped: {
    label: "Shipped",
    description: "Used in my own released products.",
  },
  exploring: {
    label: "Exploring",
    description: "Actively learning and experimenting with.",
  },
};

/**
 * Skills grouped by area, each with the evidence behind it.
 * No percentages: depth is described by where a skill has actually been used.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "mobile",
    title: "Mobile engineering",
    short: "Mobile",
    description: "Cross-platform apps that hold up offline, at scale and in the hands of real users.",
    skills: [
      { name: "Flutter", depth: "production", evidence: "6+ client apps on Android and iOS, plus PDFify, Civil Site Calculator and Mega Site." },
      { name: "Dart", depth: "production", evidence: "Primary language since 2023, from UI to pure-Dart game simulation." },
      { name: "Android", depth: "production", evidence: "Kiosk lock-task mode, boot auto-start and MethodChannels for two attendance kiosks." },
      { name: "iOS", depth: "production", evidence: "Client apps shipped to iOS, including FireArrest and WeWeed." },
      { name: "Clean Architecture", depth: "production", evidence: "Domain, data and presentation layers across client and personal projects." },
      { name: "BLoC · GetX · Riverpod", depth: "production", evidence: "BLoC and GetX in client work; Riverpod in my own apps; a Provider → GetX migration in production." },
      { name: "Offline-first & sync", depth: "production", evidence: "Drift, ObjectBox, Hive and conflict-aware background sync with WorkManager." },
      { name: "Localisation & RTL", depth: "production", evidence: "English, Hindi and Arabic (RTL) in client apps; English and Hindi in Civil Site Calculator." },
    ],
  },
  {
    id: "integrations",
    title: "Integrations & infrastructure",
    short: "Integrations",
    description: "The plumbing that makes apps trustworthy: auth, payments, sync, storage and observability.",
    skills: [
      { name: "REST APIs · Dio", depth: "production", evidence: "Typed REST layers with interceptors and token refresh in every client app." },
      { name: "Firebase", depth: "production", evidence: "Cloud Messaging with deep links, Crashlytics and Remote Config." },
      { name: "OAuth2 · MFA · OTP", depth: "production", evidence: "Multi-tenant auth with role-based entitlements in ClockedIn HRM; OTP/2FA in WeWeed." },
      { name: "Payments", depth: "production", evidence: "Razorpay, Stripe and PayPal in client apps; Google Play Billing in my own." },
      { name: "AWS S3 · MinIO", depth: "production", evidence: "Document uploads and biometric template sync." },
      { name: "Git & GitHub", depth: "production", evidence: "Daily workflow, branching and release builds with flavours." },
      { name: "Supabase", depth: "shipped", evidence: "Postgres, Auth and Row Level Security in Viral Hunter." },
      { name: "AdMob", depth: "shipped", evidence: "Frequency-capped ads in PDFify and Mega Site." },
    ],
  },
  {
    id: "ai",
    title: "AI & intelligent applications",
    short: "AI",
    description: "Using models where they add real value — on-device, in the cloud and in how I build.",
    skills: [
      { name: "On-device ML", depth: "production", evidence: "Face recognition and liveness detection with ML Kit and TensorFlow Lite for attendance." },
      { name: "LLM integration", depth: "shipped", evidence: "Schema-validated (Zod) structured outputs with usage limits in Viral Hunter." },
      { name: "Gemini API", depth: "shipped", evidence: "Optional smart input in Civil Site Calculator, using the user's own securely stored key." },
      { name: "AI-assisted development", depth: "shipped", evidence: "Part of my daily workflow — with review and tests, like any other code." },
      { name: "AI agents", depth: "exploring", evidence: "Studying what makes agents reliable: evals, context limits and prompt injection." },
    ],
  },
  {
    id: "web",
    title: "Web technologies",
    short: "Web",
    description: "Full-stack TypeScript for products that live in the browser.",
    skills: [
      { name: "Next.js", depth: "shipped", evidence: "App Router, route handlers and cron jobs in Viral Hunter — and this site." },
      { name: "React", depth: "shipped", evidence: "Viral Hunter, this portfolio and Remotion-based product videos." },
      { name: "TypeScript", depth: "shipped", evidence: "Strict mode across my web projects." },
      { name: "Tailwind CSS", depth: "shipped", evidence: "Design systems for Viral Hunter and this site." },
      { name: "Vitest", depth: "shipped", evidence: "Unit tests for scoring, billing and security logic in Viral Hunter." },
      { name: "Three.js · R3F", depth: "exploring", evidence: "The procedural 3D scene at the top of this page." },
    ],
  },
];
