/**
 * Plays every animated icon in a real browser, frame by frame, and checks
 * what unit tests can't:
 *
 * - Nothing leaves the 32×32 canvas, except deliberate exits. Points are
 *   sampled along every path, since bounding boxes overstate rotations.
 * - Parts inside a `<clipPath>` wrapper may pass through the clip in
 *   expressive mode, but not in productive mode, where getting clipped
 *   means getting cut off. A clip that splits a part at rest, like
 *   `View`'s, is measured from where the part sits at rest.
 * - Productive motion ends within 400ms, expressive within 700ms.
 * - Icons that loop repeat forever, with a cycle of 700ms at most.
 *
 * Run `bun run prepack` first so `lib/animated/` exists. Uses an installed
 * Chrome by default; pass `--browser firefox` or `--browser webkit` to use
 * Playwright's builds (`bunx playwright-core install firefox webkit`).
 */

import { mkdir, readdir, rm } from "node:fs/promises";
import { chromium, firefox, webkit } from "playwright-core";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";
import { DURATION } from "../src/animated/shared.js";

/** Icons whose motion leaves the canvas on purpose, through the viewBox edge. */
const EXITS = new Set(["Send/expressive"]);

/** How far a part may stray past the canvas, in user units, before it counts. */
const TOLERANCE = 0.5;

const LIMITS = { productive: parseInt(DURATION.slow01), expressive: parseInt(DURATION.slow02) };

const flag = process.argv.indexOf("--browser");
const browserName = flag === -1 ? "chrome" : process.argv[flag + 1];
const launch = {
  chrome: () => chromium.launch({ channel: "chrome" }),
  firefox: () => firefox.launch(),
  webkit: () => webkit.launch(),
}[browserName ?? ""];

if (!launch) throw new Error(`Unknown browser: ${browserName}`);

// Compile each component for the server next to a copy of its runtime, so
// its `./animate.js` import resolves, then render both modes as if playing.
const lib = "lib/animated";
const out = "node_modules/.cache/check-animated-motion";
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await Bun.write(`${out}/animate.js`, Bun.file(`${lib}/animate.js`));

const names = (await readdir(lib)).filter((file) => file.endsWith(".svelte")).map((file) => file.slice(0, -7));
const heads = new Set<string>();
let body = "";

for (const name of names) {
  const source = await Bun.file(`${lib}/${name}.svelte`).text();
  const { js } = compile(source, { filename: `${name}.svelte`, generate: "server", css: "injected" });
  await Bun.write(`${out}/${name}.js`, js.code);
  const { default: Icon } = await import(`${process.cwd()}/${out}/${name}.js`);

  const states = source.includes('data-playing="loop"') ? ["motion", "loop"] : ["motion"];
  for (const motion of ["productive", "expressive"]) {
    for (const state of states) {
      const key = `${name}/${motion}${state === "loop" ? "/loop" : ""}`;
      const result = render(Icon, { props: { size: 32, motion, "data-playing": state, "data-key": key } });
      heads.add(result.head);
      body += result.body;
    }
  }
}

const browser = await launch();
const page = await browser.newPage();
await page.setContent(`<!doctype html><html><head>${[...heads].join("")}</head><body>${body}</body></html>`);

const results = await page.evaluate(
  ({ limits, step }) => {
    const svgs = [...document.querySelectorAll<SVGSVGElement>("svg[data-key]")];
    const animations = svgs.flatMap((svg) => svg.getAnimations({ subtree: true }));
    animations.forEach((animation) => animation.pause());

    const report: Record<string, { overflow: number; end: number; cycle: number; forever: boolean }> = {};
    for (const svg of svgs) {
      const timings = svg.getAnimations({ subtree: true }).map((a) => a.effect!.getComputedTiming());
      report[svg.dataset.key!] = {
        overflow: 0,
        end: Math.max(0, ...timings.map((t) => Number(t.endTime))),
        cycle: Math.max(0, ...timings.map((t) => Number(t.duration))),
        forever: timings.length > 0 && timings.every((t) => t.iterations === Infinity),
      };
    }

    // How far each clipped part already sits outside its clip at rest.
    const atRest = new Map<Element, number>();

    for (let time = 0; time <= limits.expressive; time += step) {
      animations.forEach((animation) => (animation.currentTime = time));

      for (const svg of svgs) {
        const toUser = svg.getScreenCTM()!.inverse();
        const entry = report[svg.dataset.key!]!;
        const productive = svg.dataset.key!.endsWith("/productive");

        for (const shape of svg.querySelectorAll<SVGGeometryElement>("path, circle, ellipse, rect, line, polyline, polygon")) {
          if (shape.closest("clipPath, mask") || !shape.checkVisibility()) continue;
          // A clipped part counts against its clip rect, and only in productive mode.
          const clipped = shape.closest("[clip-path]");
          if (clipped && !productive) continue;
          const id = clipped?.getAttribute("clip-path")?.match(/#([^)]+)/)?.[1];
          const rect = id ? svg.querySelector<SVGRectElement>(`[id="${id}"] rect`)!.getBBox() : { x: 0, y: 0, width: 32, height: 32 };
          const matrix = toUser.multiply(shape.getScreenCTM()!);
          const length = shape.getTotalLength();
          let overflow = -Infinity;

          for (let at = 0; at <= length; at += 1) {
            const { x, y } = shape.getPointAtLength(at).matrixTransform(matrix);
            overflow = Math.max(overflow, rect.x - x, x - rect.x - rect.width, rect.y - y, y - rect.y - rect.height);
          }

          if (clipped && !atRest.has(shape)) atRest.set(shape, Math.max(0, overflow));
          entry.overflow = Math.max(entry.overflow, overflow - (atRest.get(shape) ?? 0));
        }
      }
    }

    return report;
  },
  { limits: LIMITS, step: 20 }
);

await browser.close();

const failures: string[] = [];

for (const [key, { overflow, end, cycle, forever }] of Object.entries(results)) {
  const [, motion, loop] = key.split("/") as [string, keyof typeof LIMITS, string | undefined];

  if (end === 0) failures.push(`${key}: doesn't animate`);
  if (loop && !forever) failures.push(`${key}: doesn't repeat forever`);
  if (loop && cycle > LIMITS.expressive) failures.push(`${key}: has a ${cycle}ms cycle, over ${LIMITS.expressive}ms`);
  if (!loop && end > LIMITS[motion]) failures.push(`${key}: runs ${end}ms, over ${LIMITS[motion]}ms`);
  if (overflow > TOLERANCE && !EXITS.has(key)) {
    failures.push(`${key}: leaves the canvas by ${overflow.toFixed(2)} units`);
  }
}

const loops = Object.keys(results).filter((key) => key.endsWith("/loop")).length / 2;
console.log(`Checked ${names.length} animated icons in both modes, ${loops} of them looping, in ${browserName}.`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
