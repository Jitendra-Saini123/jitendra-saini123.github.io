import { describe, expect, it } from "vitest";
import { buildMailtoUrl, enquiryTopics, validateContact, type ContactDraft } from "@/lib/contact";

const valid: ContactDraft = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  topic: enquiryTopics[0],
  message: "We're building a Flutter app & need help with offline sync.",
};

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags every missing field", () => {
    const errors = validateContact({ name: " ", email: "", topic: "", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name", "topic"]);
  });

  it("rejects malformed emails and unknown topics", () => {
    expect(validateContact({ ...valid, email: "not-an-email" }).email).toBeDefined();
    expect(validateContact({ ...valid, email: "a@b" }).email).toBeDefined();
    expect(validateContact({ ...valid, topic: "Free money" }).topic).toBeDefined();
  });

  it("requires a meaningful message", () => {
    expect(validateContact({ ...valid, message: "hi" }).message).toBeDefined();
  });
});

describe("buildMailtoUrl", () => {
  it("encodes subject and body safely", () => {
    const url = buildMailtoUrl("me@example.org", valid, "Project enquiry");
    expect(url.startsWith("mailto:me@example.org?")).toBe(true);

    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe(`Project enquiry — ${valid.topic}`);
    const body = params.get("body") ?? "";
    expect(body).toContain(valid.message);
    expect(body).toContain(valid.name);
    expect(body).toContain(valid.email);
    // Spaces are percent-encoded, never "+".
    expect(url).not.toContain("+");
    expect(url).toContain("%26"); // the "&" in the message is escaped
  });
});
