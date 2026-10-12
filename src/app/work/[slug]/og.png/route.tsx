import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { ogImageSize } from "@/lib/social-image";

// Rendered once per case study at build time (see src/lib/social-image.ts).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

/** Per-project social card, generated at build time. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const name = project?.name ?? siteConfig.brand;
  const accent = project?.accent ?? "#45D9FF";

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
          backgroundImage: `radial-gradient(circle at 85% 25%, ${accent}55, transparent 45%), linear-gradient(rgba(162,172,194,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(162,172,194,0.07) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          color: "#F5F7FF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: "#A2ACC2" }}>
          <div style={{ display: "flex", color: "#9EEAFF", letterSpacing: 4 }}>CASE STUDY</div>
          <div style={{ display: "flex" }}>Jitendra Builds</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 30, color: "#A2ACC2", marginTop: 24, maxWidth: 980, lineHeight: 1.35 }}>
            {project?.category ?? ""}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#7C86A2" }}>
          <div style={{ display: "flex" }}>{siteConfig.name}</div>
          <div style={{ display: "flex" }}>{project?.status.label ?? ""}</div>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
