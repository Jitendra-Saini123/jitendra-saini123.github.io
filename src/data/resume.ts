/**
 * Résumé content based on "Jitendra Saini - Flutter Developer Resume.pdf"
 * (October 2026), plus technologies used in Jitendra's own products (checked in their
 * repositories). Roles come from src/data/experience.ts. The phone number in
 * the PDF is intentionally not repeated on the web.
 */
export const resume = {
  summary:
    "Flutter Developer with 3.5+ years of experience shipping 6+ offline-first mobile applications for Android and iOS using Dart, Clean Architecture, BLoC and GetX. Built biometric authentication with on-device face recognition, liveness detection, NFC and fingerprint/palm matching using TFLite and ML Kit. Delivered multi-tenant, multi-flavour HRM and attendance platforms with background data sync on Drift (SQLite) and ObjectBox, and REST API integration with Firebase, OAuth2 and MFA. Shipped white-label apps for international clients across five domains.",
  skills: [
    { area: "Languages & frameworks", items: "Dart, Flutter, RESTful APIs, JSON" },
    { area: "Architecture & state", items: "Clean Architecture, BLoC, GetX, Provider, Riverpod, dependency injection (GetIt)" },
    { area: "Biometrics & on-device ML", items: "Face recognition, liveness detection (anti-spoofing), TensorFlow Lite, Google ML Kit, NFC, fingerprint/palm matching" },
    { area: "Persistence & sync", items: "Drift (SQLite), ObjectBox, Hive, WorkManager, BackgroundFetch, offline-first architecture" },
    { area: "Networking & backend", items: "Dio, REST APIs, OAuth2, MFA, Node.js/MongoDB integration, Supabase" },
    { area: "Firebase & cloud", items: "Cloud Messaging (FCM), Crashlytics, Remote Config, AWS S3, MinIO" },
    { area: "Payments", items: "Razorpay, Stripe, PayPal, Google Play Billing" },
    { area: "Web & AI", items: "Next.js, React, TypeScript, Tailwind CSS, LLM APIs with schema-validated outputs" },
    { area: "Platform & tools", items: "Android Studio, Xcode, Git, GitHub, MethodChannels, Android kiosk / lock-task mode" },
    { area: "Localisation", items: "English, Hindi, Arabic (RTL)" },
  ],
  certifications: [
    "Full-Stack Web Development Internship — CodePlanet Technologies, Jun 2022 – Dec 2022",
    "RS-CIT (Computer Concepts and IT Skills), 96% — 2021",
  ],
  languages: ["English — professional working proficiency", "Hindi — native / bilingual"],
};
