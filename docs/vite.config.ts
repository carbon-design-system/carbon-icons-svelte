import { svelte } from "@sveltejs/vite-plugin-svelte";
import { optimizeCss, optimizeImports } from "carbon-preprocess-svelte";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { version } from "../package.json" with { type: "json" };

let outDir = "dist";

export default defineConfig({
  plugins: [
    // The Animated page is at /animated. A static host serves it from
    // animated/index.html, the same app shell as the Icons page.
    {
      name: "animated-route",
      apply: "build",
      configResolved(config) {
        outDir = path.resolve(config.root, config.build.outDir);
      },
      async closeBundle() {
        await mkdir(path.join(outDir, "animated"), { recursive: true });
        await copyFile(path.join(outDir, "index.html"), path.join(outDir, "animated", "index.html"));
      },
    },
    svelte({ preprocess: [optimizeImports()] }),
    optimizeCss({ experimental: { strict: true } }),
  ],
  resolve: {
    // The docs use the animated icons built from this repo, imported the way an app would.
    alias: {
      "carbon-icons-svelte/animated": fileURLToPath(new URL("../lib/animated/index.js", import.meta.url)),
    },
  },
  define: {
    __VERSION: JSON.stringify(version),
  },
});
