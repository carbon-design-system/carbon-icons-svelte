import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { optimizeCss, optimizeImports } from "carbon-preprocess-svelte";
import { version } from "../package.json" assert { type: "json" };

export default defineConfig({
  integrations: [
    svelte({
      preprocess: [optimizeImports()],
    }),
  ],
  vite: {
    plugins: [optimizeCss()],
    define: {
      __VERSION: JSON.stringify(version),
    },
  },
});
