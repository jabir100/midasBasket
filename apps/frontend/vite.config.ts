import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/*
 * Incremental static regeneration (honored by the Vercel preset, ignored by
 * other presets). Public pages are rendered once and served from the edge
 * cache, then regenerated in the background after `expiration` seconds, so
 * the API is hit at most about once a minute per page instead of per visitor.
 *
 * `allowQuery: []` keeps query strings out of the cache key. Without it every
 * distinct `?x=` value would be its own cache entry and its own render, which
 * lets anyone force unbounded regenerations against the backend.
 */
const publicPageIsr = { expiration: 60, allowQuery: [] as string[] };

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tanstackStart(),
    nitro({
      routeRules: {
        "/": { isr: publicPageIsr },
        // Exactly one segment after /products/, i.e. product detail pages.
        // The /products listing (filters live in the query string) is excluded.
        "/products/*": { isr: publicPageIsr },
      },
    }),
    tailwindcss(),
    viteReact(),
  ],
});
