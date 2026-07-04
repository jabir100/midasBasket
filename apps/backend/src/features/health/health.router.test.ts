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

type HealthResponseBody = {
  data: {
    uptimeSeconds: unknown;
    timestamp: unknown;
  };
  requestId: unknown;
};

describe("GET /api/v1/health", () => {
  it("returns the health envelope with API noindex headers", async () => {
    const response = await request(createApp()).get("/api/v1/health");
    const body = response.body as HealthResponseBody;

    expect(response.status).toBe(200);
    expect(response.headers["x-robots-tag"]).toBe("noindex, nofollow");
    expect(response.body).toMatchObject({
      success: true,
      data: {
        status: "ok",
        environment: "test",
      },
    });
    expect(body.data.uptimeSeconds).toEqual(expect.any(Number));
    expect(body.data.timestamp).toEqual(expect.any(String));
    expect(body.requestId).toEqual(expect.any(String));
  });
});
