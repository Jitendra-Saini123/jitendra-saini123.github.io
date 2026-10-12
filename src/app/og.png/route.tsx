import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { ogImageSize } from "@/lib/social-image";

// Rendered once at build time into a real /og.png (see src/lib/social-image.ts).
export const dynamic = "force-static";

/** Social preview card, generated at build time — no external assets needed. */
export function GET() {
  const { hero } = siteConfig;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#050711",
          backgroundImage:
            "radial-gradient(circle at 82% 30%, rgba(69,217,255,0.28), transparent 42%), radial-gradient(circle at 95% 85%, rgba(139,112,255,0.26), transparent 45%), linear-gradient(rgba(162,172,194,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(162,172,194,0.07) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 56px 56px, 56px 56px",
          color: "#F5F7FF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path d="M16 1.8 28.3 8.9v14.2L16 30.2 3.7 23.1V8.9L16 1.8Z" stroke="#45D9FF" strokeWidth="1.6" />
            <path d="M9.2 11.6h13.6" stroke="#F5F7FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
            <path d="M8.2 16h15.6" stroke="#45D9FF" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M9.2 20.4h13.6" stroke="#F5F7FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          </svg>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            Jitendra <span style={{ color: "#A2ACC2", fontWeight: 400, marginLeft: 10 }}>Builds</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#9EEAFF", letterSpacing: 1 }}>{siteConfig.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, marginTop: 18, maxWidth: 940 }}>
            {`${hero.headlineLead} ${hero.headlineAccent}`}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#A2ACC2" }}>
          <div style={{ display: "flex" }}>{hero.descriptor.join("  ·  ")}</div>
          <div style={{ display: "flex", color: "#7C86A2" }}>
            {siteConfig.location.city}, {siteConfig.location.country}
          </div>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
