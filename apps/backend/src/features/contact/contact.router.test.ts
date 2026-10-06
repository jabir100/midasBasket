import request from "supertest";
import { describe, expect, it } from "vitest";

process.env.NODE_ENV = "test";
process.env.API_BASE_PATH = "/api/v1";
process.env.CLIENT_ORIGINS = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://localhost:27017/midas-basket-test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-value-with-32-chars";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-value-with-32-chars";
process.env.COOKIE_DOMAIN = "localhost";

const { createApp } = await import("../../app.js");

/*
 * These cases never reach MongoDB. The submission rate limiter is shared
 * across the file (5 per window), so the order of the tests below matters.
 */
describe("contact router", () => {
  const app = createApp();

  it("rejects an invalid contact form submission", async () => {
    const response = await request(app)
      .post("/api/v1/contact/messages")
      .send({ name: "A", email: "bad", subject: "x", message: "short" });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "VALIDATION_ERROR" },
    });
  });

  it("accepts honeypot submissions without storing them", async () => {
    const response = await request(app).post("/api/v1/contact/messages").send({
      name: "Spam Bot",
      email: "bot@example.com",
      subject: "Cheap deals",
      message: "Buy followers now, limited offer!",
      website: "http://spam.example",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: { received: true },
    });
  });

  it("rate limits repeated submissions", async () => {
    const statuses: number[] = [];

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = await request(app)
        .post("/api/v1/contact/messages")
        .send({});
      statuses.push(response.status);
    }

    expect(statuses.at(-1)).toBe(429);
  });

  it("requires an admin session for the inbox", async () => {
    const response = await request(app).get("/api/v1/contact/admin/messages");

    expect(response.status).toBe(401);
  });
});
