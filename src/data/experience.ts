import type { ExperienceEntry } from "@/types";

/**
 * Experience, taken from the résumé supplied in October 2026.
 *
 * VERIFY: the résumé lists Sublimity Softwares as "Feb 2023 – Present", while the
 * 3 Oct 2026 "Building in Public" video says you've moved from client work to
 * your own products. Update `end` below if that role has ended.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "sublimity",
    organization: "Sublimity Softwares Private Limited",
    role: "Flutter Developer",
    start: "Feb 2023",
    end: "Present",
    location: "Jaipur, India",
    kind: "full-time",
    summary:
      "Delivered 6+ production Flutter applications on Android and iOS for international clients across five domains — fire-safety inspection, HR and workforce management, food delivery, real estate and community platforms — using Clean Architecture with BLoC and GetX.",
    products: [
      {
        name: "FireArrest",
        description: "Offline-first fire inspection app",
        href: "https://play.google.com/store/apps/details?id=com.firearrest",
        points: [
          "Rebuilt the app from scratch and migrated operatives from two legacy native apps (Android and iOS) with zero data loss, using conflict-aware background sync (WorkManager, BackgroundFetch), Drift/SQLite and Dio-based REST APIs.",
          "Shipped four types of pin-level inspection evidence — photos, QR codes, dynamic forms and digital signatures — so inspectors complete full reports without connectivity.",
        ],
      },
      {
        name: "ClockedIn HRM / Zaad HR",
        description: "Multi-tenant HR and time-management platform",
        href: "https://play.google.com/store/apps/details?id=com.clockedin.one",
        points: [
          "Shipped two branded flavours from one Flutter codebase, gating 50+ screens across 30+ feature modules with OAuth2, MFA and role-based entitlements (GetX, Dio).",
          "Implemented three clock-in methods — face recognition, NFC and PIN — with GPS validation using ML Kit and TFLite, backed by an ObjectBox offline punch queue and background sync, plus roster, leave/WFH, timesheet, payslip and document-upload workflows (MinIO/S3).",
        ],
      },
      {
        name: "Attendance kiosks",
        description: "Two production Android kiosks",
        points: [
          "Designed and built facial and palm-biometric attendance kiosks from scratch, with native kiosk lock-down, boot auto-start, NFC fob and PIN authentication, IMEI-based device provisioning and S3 biometric template sync.",
        ],
      },
      {
        name: "WeWeed",
        description: "Hybrid community app",
        points: [
          "Wrapped a production PWA in a native Flutter shell with OTP/2FA authentication, session bridging (token refresh, remember-me, cookie injection), Stripe and PayPal payments, and FCM push notifications with deep links.",
        ],
      },
      {
        name: "PosWave",
        description: "Restaurant ordering app",
        points: ["Built the customer-facing ordering flows — menu browsing, cart and order placement — with REST API integration and account authentication."],
      },
      {
        name: "1 Reception & PropertyApp",
        description: "Deals and real-estate apps",
        points: [
          "Integrated Razorpay payments and advanced search and filtering, and migrated state management from Provider to GetX while keeping production stable.",
        ],
      },
    ],
    points: [
      "Localised applications into English, Hindi and Arabic (RTL), and added Firebase Crashlytics, Remote Config and DEV/PROD build flavours.",
    ],
    stack: ["Flutter", "Dart", "BLoC", "GetX", "Clean Architecture", "Drift", "ObjectBox", "Dio", "Firebase", "ML Kit", "TFLite", "NFC", "AWS S3"],
  },
  {
    id: "independent",
    organization: "Jitendra Builds · J-Tech Utilities",
    role: "Independent product developer",
    start: "2026",
    end: "Present",
    kind: "independent",
    summary: "Designing, building and shipping my own products end to end — and sharing the process on YouTube.",
    points: [
      "Published PDFify and Civil Site Calculator on Google Play under J-Tech Utilities.",
      "Launched Viral Hunter, a Next.js and Supabase web app with LLM-powered content analysis.",
      "Developing Mega Site: Civil Tycoon, an idle construction game.",
      "Packaged TubeNative as a licensed Flutter source-code product through NativeStack.",
    ],
    stack: ["Flutter", "Riverpod", "Next.js", "TypeScript", "Supabase", "LLM APIs"],
  },
  {
    id: "codeplanet",
    organization: "CodePlanet Technologies",
    role: "Full-Stack Web Development Intern",
    start: "Jun 2022",
    end: "Dec 2022",
    kind: "internship",
  },
  {
    id: "education",
    organization: "Vivekananda Institute of Technology (East), Jaipur",
    role: "B.Tech. in Electrical Engineering",
    start: "2014",
    end: "2018",
    kind: "education",
  },
];
