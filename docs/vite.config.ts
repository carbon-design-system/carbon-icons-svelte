import { svelte } from "@sveltejs/vite-plugin-svelte";
import { optimizeCss, optimizeImports } from "carbon-preprocess-svelte";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { version } from "../package.json" with { type: "json" };

export default defineConfig({
  plugins: [
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
