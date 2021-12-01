import adapter from "@sveltejs/adapter-static";
import { optimizeImports } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [optimizeImports()],
  kit: {
    target: "#svelte",
    adapter: adapter(),
    ssr: false,
    vite: {
      server: {
        fs: {
          allow: [".."],
        },
      },
    },
  },
};

export default config;
