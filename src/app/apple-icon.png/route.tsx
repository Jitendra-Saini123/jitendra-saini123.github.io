import { ImageResponse } from "next/og";

// Rendered once at build time into a real /apple-icon.png (see src/lib/social-image.ts).
export const dynamic = "force-static";

const size = { width: 180, height: 180 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050711",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <path d="M16 1.8 28.3 8.9v14.2L16 30.2 3.7 23.1V8.9L16 1.8Z" stroke="#45D9FF" strokeWidth="1.6" />
          <path d="M9.2 11.6h13.6" stroke="#F5F7FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
          <path d="M8.2 16h15.6" stroke="#45D9FF" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9.2 20.4h13.6" stroke="#F5F7FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>
    ),
    size,
  );
}
