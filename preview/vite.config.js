import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  optimizeDeps: {
    exclude: ["carbon-components-svelte"],
  },
  plugins: [sveltekit()],
};

export default config;
