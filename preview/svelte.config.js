import adapter from "@sveltejs/adapter-static";
import { optimizeImports } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    immutable: true,
  },
  preprocess: [optimizeImports()],
  kit: {
    adapter: adapter(),
  },
};

export default config;
