import { describe, expect, it } from "vitest";
import { isExternalUrl, isUsableUrl } from "@/lib/links";

describe("isUsableUrl", () => {
  it("accepts real http(s), mailto and in-page links", () => {
    expect(isUsableUrl("https://github.com/Jitendra-Saini123")).toBe(true);
    expect(isUsableUrl("mailto:someone@domain.dev")).toBe(true);
    expect(isUsableUrl("#work")).toBe(true);
    expect(isUsableUrl("/resume.pdf")).toBe(true);
  });

  it("rejects placeholders, empty values and unsafe protocols", () => {
    expect(isUsableUrl(undefined)).toBe(false);
    expect(isUsableUrl("")).toBe(false);
    expect(isUsableUrl("https://play.google.com/store/apps/details?id=REPLACE_WITH_VERIFIED_PDFIFY_PACKAGE")).toBe(false);
    expect(isUsableUrl("https://example.com")).toBe(false);
    expect(isUsableUrl("javascript:alert(1)")).toBe(false);
    expect(isUsableUrl("not a url")).toBe(false);
  });
});

describe("isExternalUrl", () => {
  it("detects absolute web URLs only", () => {
    expect(isExternalUrl("https://viralhunter.in")).toBe(true);
    expect(isExternalUrl("mailto:a@b.co")).toBe(false);
    expect(isExternalUrl("#contact")).toBe(false);
  });
});
