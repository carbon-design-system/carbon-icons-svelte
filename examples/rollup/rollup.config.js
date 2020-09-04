import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/index.js",
  output: {
    sourcemap: !production,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      dev: !production,
      css: (css) => {
        css.write("bundle.css", !production);
      },
    }),
    resolve({ browser: true, dedupe: ["svelte"] }),
    production && terser(),
  ],
};
