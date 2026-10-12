import { siteConfig } from "@/config/site";
import { isUsableUrl } from "@/lib/links";

/**
 * Structured data limited to facts that are true and public: who Jitendra is,
 * where Jitendra is based, and the verified public profiles.
 */
export function JsonLd() {
  const sameAs = siteConfig.socials.map((s) => s.href).filter((href) => isUsableUrl(href));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        alternateName: siteConfig.brand,
        url: siteConfig.url,
        jobTitle: "Flutter Developer",
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location.city,
          addressCountry: "IN",
        },
        knowsAbout: ["Flutter", "Dart", "Android", "iOS", "Mobile application architecture", "Next.js", "TypeScript", "LLM integration"],
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.brand,
        publisher: { "@id": `${siteConfig.url}/#person` },
        inLanguage: "en",
      },
    ],
  };

  // JSON.stringify output is safe here: all values are static config. "<" is
  // escaped anyway so the payload can never close the script tag.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
