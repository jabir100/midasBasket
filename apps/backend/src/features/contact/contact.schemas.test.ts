import { describe, expect, it } from "vitest";

import {
  contactDetailsSchema,
  contactMessageCreateSchema,
  socialLinkSchema,
} from "./contact.schemas.js";

describe("socialLinkSchema", () => {
  it("accepts an https profile link", () => {
    const result = socialLinkSchema.parse({
      platform: "facebook",
      url: "https://facebook.com/midasbasket",
    });

    expect(result).toMatchObject({ sortOrder: 0, isActive: true });
  });

  it("rejects non-http links so they cannot become script hrefs", () => {
    expect(
      socialLinkSchema.safeParse({
        platform: "website",
        url: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown platforms", () => {
    expect(
      socialLinkSchema.safeParse({
        platform: "myspace",
        url: "https://myspace.com/x",
      }).success,
    ).toBe(false);
  });
});

describe("contactDetailsSchema", () => {
  it("allows clearing optional channels with empty strings", () => {
    expect(
      contactDetailsSchema.parse({ phone: "", whatsapp: " ", email: "" }),
    ).toEqual({
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      businessHours: "",
    });
  });

  it("rejects malformed phone numbers and emails", () => {
    expect(contactDetailsSchema.safeParse({ phone: "call me" }).success).toBe(
      false,
    );
    expect(contactDetailsSchema.safeParse({ email: "nope" }).success).toBe(
      false,
    );
  });
});

describe("contactMessageCreateSchema", () => {
  const valid = {
    name: "Rahim Uddin",
    email: "Rahim@Example.com",
    subject: "Bulk order",
    message: "Do you offer discounts on bulk orders?",
  };

  it("normalises the sender email", () => {
    expect(contactMessageCreateSchema.parse(valid).email).toBe(
      "rahim@example.com",
    );
  });

  it("requires a meaningful message", () => {
    expect(
      contactMessageCreateSchema.safeParse({ ...valid, message: "hi" }).success,
    ).toBe(false);
  });
});
