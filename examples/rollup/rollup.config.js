import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import copy from "rollup-plugin-copy";

const IS_PROD = !process.env.ROLLUP_WATCH;

/**
 * Svelte has to be deduped for `bind:this` to work in the consuming project.
 * Solution: https://github.com/sveltejs/svelte/issues/2937
 */
const dedupe = (importee) =>
  importee === "svelte" || importee.startsWith("svelte/");

export default {
  input: "src/index.js",
  output: {
    sourcemap: !IS_PROD,
    format: "iife",
    name: "app",
    file: "build/bundle.js",
  },
  plugins: [
    copy({ targets: [{ src: "public/*", dest: "build" }] }),
    svelte({
      dev: !IS_PROD,
      css: (css) => {
        css.write("build/bundle.css", !IS_PROD);
      },
    }),

    // https://github.com/sveltejs/svelte/issues/2937
    resolve({ dedupe }),
    commonjs(),
    !IS_PROD && serve({ contentBase: ["build"], port: 3000 }),
    !IS_PROD && livereload({ watch: "build" }),
    IS_PROD && terser(),
  ],
};
