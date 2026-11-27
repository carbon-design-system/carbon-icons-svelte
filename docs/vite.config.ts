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
      // The Icons page preloads its data and the first group's SVG, so they
      // download alongside the app's code instead of after it runs. The
      // first group is skipped for a link to a section further down. The
      // Animated page uses neither.
      async transformIndexHtml(html) {
        const generated = await readFile(path.resolve(root, "src/generated/build-info-url.ts"), "utf8");
        const url = generated.match(/BUILD_INFO_URL = "([^"]+)"/)?.[1];
        const firstIcons = generated.match(/FIRST_ICONS_URL = "([^"]+)"/)?.[1];
        if (!url || !firstIcons) return html;
        // Added from a script, so only the Icons page gets them, whatever
        // HTML the host serves for /animated, and at low priority, so the
        // app's code and CSS get the bandwidth first.
        const preload = `if (!location.pathname.startsWith("/animated") && !location.hash.startsWith("#animated")) for (const href of location.hash ? [${JSON.stringify(url)}] : [${JSON.stringify(url)}, ${JSON.stringify(firstIcons)}]) document.head.append(Object.assign(document.createElement("link"), { rel: "preload", as: "fetch", crossOrigin: "anonymous", fetchPriority: "low", href }));`;
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
