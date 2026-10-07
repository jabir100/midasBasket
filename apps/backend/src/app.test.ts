import request from "supertest";
import { describe, expect, it } from "vitest";

process.env.NODE_ENV = "test";
process.env.API_BASE_PATH = "/api/v1";
process.env.CLIENT_ORIGINS = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://localhost:27017/midas-basket-test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-value-with-32-chars";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-value-with-32-chars";
process.env.COOKIE_DOMAIN = "localhost";

const { createApp } = await import("./app.js");

const origin = "http://localhost:3000";

describe("connection gate", () => {
  it("returns a CORS-readable 503 when dependencies are unavailable", async () => {
    const app = createApp({
      ensureConnections: () => Promise.reject(new Error("db down")),
    });

    const response = await request(app)
      .get("/api/v1/health")
      .set("Origin", origin);

    expect(response.status).toBe(503);
    expect(response.headers["access-control-allow-origin"]).toBe(origin);
    expect(response.headers["retry-after"]).toBe("2");
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "SERVICE_UNAVAILABLE" },
    });
  });

  it("serves the request once dependencies recover", async () => {
    let attempts = 0;
    const app = createApp({
      ensureConnections: () => {
        attempts += 1;
        return attempts === 1
          ? Promise.reject(new Error("cold start"))
          : Promise.resolve();
      },
    });

    expect((await request(app).get("/api/v1/health")).status).toBe(503);
    expect((await request(app).get("/api/v1/health")).status).toBe(200);
  });

  it("answers CORS preflights without waiting on dependencies", async () => {
    const app = createApp({
      ensureConnections: () => Promise.reject(new Error("db down")),
    });

    const response = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", origin)
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-max-age"]).toBe("600");
  });
});
