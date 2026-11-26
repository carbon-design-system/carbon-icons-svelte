import { svelte } from "@sveltejs/vite-plugin-svelte";
import { optimizeCss, optimizeImports } from "carbon-preprocess-svelte";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { version } from "../package.json" with { type: "json" };

let outDir = "dist";
let root = ".";

export default defineConfig({
  plugins: [
    // The Animated page is at /animated. A static host serves it from
    // animated/index.html, the same app shell as the Icons page.
    {
      name: "animated-route",
      apply: "build",
      configResolved(config) {
        root = config.root;
        outDir = path.resolve(config.root, config.build.outDir);
      },
      // The Icons page preloads its data, so it downloads alongside the
      // app's code instead of after it runs. The Animated page doesn't use it.
      async transformIndexHtml(html) {
        const generated = await readFile(path.resolve(root, "src/generated/build-info-url.ts"), "utf8");
        const url = generated.match(/BUILD_INFO_URL = "([^"]+)"/)?.[1];
        if (!url) return html;
        // Added from a script, so only the Icons page gets it, whatever
        // HTML the host serves for /animated, and at low priority, so the
        // app's code and CSS get the bandwidth first.
        const preload = `if (!location.pathname.startsWith("/animated") && !location.hash.startsWith("#animated")) document.head.append(Object.assign(document.createElement("link"), { rel: "preload", as: "fetch", crossOrigin: "anonymous", fetchPriority: "low", href: ${JSON.stringify(url)} }));`;
        return html.replace("</head>", `    <script>${preload}</script>\n  </head>`);
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
      // The Icons page's examples use the static icons built from this repo too.
      "carbon-icons-svelte/lib": fileURLToPath(new URL("../lib", import.meta.url)),
    },
  },
  define: {
    __VERSION: JSON.stringify(version),
  },
});
