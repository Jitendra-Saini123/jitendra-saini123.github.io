import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

// The site is static apart from Next.js internals: no third-party scripts,
// no analytics, no form endpoint. Keep the policy as tight as that allows.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self' mailto:",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "media-src 'self'",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // wasm-unsafe-eval: the meshopt decoder used for the 3D avatar is WebAssembly.
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isProduction ? "" : " 'unsafe-eval'"}`,
  // blob: lets GLTFLoader decode the avatar's embedded textures.
  `connect-src 'self' blob:${isProduction ? "" : " ws: wss:"}`,
  "worker-src 'self' blob:",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

/**
 * STATIC_EXPORT=1 builds a plain static site into `out/` for hosts without a
 * Node server, such as GitHub Pages. Static hosts can't run the image
 * optimizer or send custom headers, so those are switched off in that mode
 * (images are already pre-optimized WebP).
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Every page is a folder with index.html, which is what static hosts serve
  // best; canonical URLs, links and the sitemap all use the trailing slash.
  trailingSlash: true,
  ...(staticExport ? { output: "export" as const } : {}),
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
