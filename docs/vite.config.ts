import { svelte } from "@sveltejs/vite-plugin-svelte";
import { optimizeCss, optimizeImports } from "carbon-preprocess-svelte";
import { defineConfig } from "vite";
import { version } from "../package.json" with { type: "json" };

export default defineConfig({
  plugins: [
    svelte({ preprocess: [optimizeImports()] }),
    optimizeCss({ experimental: { strict: true } }),
  ],
  define: {
    __VERSION: JSON.stringify(version),
  },
});
