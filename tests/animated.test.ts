import metadata from "@carbon/icons/metadata.json" with { type: "json" };
import type { IconOutput } from "@carbon/icons";
import { describe, expect, test } from "bun:test";
import { compile } from "svelte/compiler";
import { ANIMATED_ICONS, allAnimatedIcons, buildAnimated, templateAnimated } from "../src/animated/index.js";
import { RULES } from "../src/animated/rules.js";
import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, hashSource } from "../src/animated/shared.js";

/** Matches each `d` attribute in an icon's content. */
const D_PATTERN = / d="([^"]+)"/g;

/** Matches each command letter or number in a path. */
const PATH_TOKEN_PATTERN = /[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g;

/** Matches each duration or delay in CSS. */
const DURATION_PATTERN = /\b\d+(?:\.\d+)?m?s\b/g;

/** Matches each cubic Bézier easing in CSS. */
const CUBIC_BEZIER_PATTERN = /cubic-bezier\([^)]*\)/g;

/** The 32px output that the static component is built from. */
const lookup = (name: string) =>
  metadata.icons.flatMap((icon) => icon.output).find((output) => output.moduleName === `${name}32`) as
    | IconOutput
    | undefined;

const staticDescriptor = (name: string) => lookup(name)?.descriptor;

/** A path's commands and numbers, so `1.50` and `1.5` compare equal. */
const normalize = (d: string) =>
  (d.match(PATH_TOKEN_PATTERN) ?? []).map((token) => (/[a-zA-Z]/.test(token) ? token : parseFloat(token))).join(" ");

const cases = allAnimatedIcons(lookup).map((icon) => [icon.name, icon] as const);

describe("animated icons", () => {
  // Icons are split into parts by hand. If Carbon redraws one, redo its
  // parts from the new paths, then update `sourceHash`.
  test.each(cases)("%s is built from the current @carbon/icons paths", (name, icon) => {
    const descriptor = staticDescriptor(name);
    expect(descriptor).toBeDefined();
    expect(hashSource(descriptor!)).toBe(icon.sourceHash);
  });

  // A path that isn't split must be copied exactly. One that matches a
  // Carbon path number for number but not character for character was
  // retyped, and may hide a typo.
  test.each(cases)("%s copies unsplit paths verbatim", (name, icon) => {
    const source = (staticDescriptor(name)?.content ?? []).flatMap((element) =>
      typeof element.attrs?.d === "string" ? [element.attrs.d] : []
    );

    for (const [, d] of icon.content.matchAll(D_PATTERN)) {
      if (source.includes(d!)) continue;
      expect(source.map(normalize)).not.toContain(normalize(d!));
    }
  });

  test.each(cases)("%s compiles without warnings", (name, icon) => {
    for (const generate of ["client", "server"] as const) {
      const { warnings, css } = compile(templateAnimated(icon), { filename: `${name}.svelte`, generate });
      expect(warnings).toEqual([]);
      expect(css?.code).toBeTruthy();
    }
  });

  // Each icon has a productive and an expressive mode, built from Carbon's
  // motion tokens only. Percentages in keyframes aren't durations.
  // `animate.js` decides whether to play for users who prefer reduced
  // motion, so `reducedMotion="full"` can override it. A media query in the
  // icon's CSS would block that.
  test.each(cases)("%s leaves reduced motion to animate.js", (_, icon) => {
    expect(icon.css).not.toContain("prefers-reduced-motion");
  });

  test.each(cases)("%s has both motion modes, using Carbon motion tokens", (_, icon) => {
    expect(icon.css).toContain(PRODUCTIVE);
    expect(icon.css).toContain(EXPRESSIVE);

    const durations = new Set<string>(Object.values(DURATION));
    const easings = new Set<string>(Object.values(EASING).flatMap((modes) => Object.values(modes)));

    for (const [duration] of icon.css.matchAll(DURATION_PATTERN)) expect(durations).toContain(duration);
    for (const [easing] of icon.css.matchAll(CUBIC_BEZIER_PATTERN)) expect(easings).toContain(easing);
  });

  test("gives masks and clip paths a unique id prefix per instance", () => {
    const checkmark = templateAnimated(ANIMATED_ICONS.find(({ name }) => name === "Checkmark")!);
    expect(checkmark).toContain('import { animate, getAnimatedIconDefaults, uid } from "./animate.js";');
    expect(checkmark).toContain("const id = uid();");

    const renew = templateAnimated(ANIMATED_ICONS.find(({ name }) => name === "Renew")!);
    expect(renew).toContain('import { animate, getAnimatedIconDefaults } from "./animate.js";');
    expect(renew).not.toContain("uid");
  });

  test("template", () => {
    expect(templateAnimated(ANIMATED_ICONS.find(({ name }) => name === "Notification")!)).toMatchSnapshot();
  });

  test("includes every hand-built and rule-based icon", () => {
    expect(cases.length).toBe(ANIMATED_ICONS.length + Object.keys(RULES).length);
  });

  test("rule-based icons move as a whole", () => {
    const arrow = cases.find(([name]) => name === "ArrowUpRight")![1];
    expect(arrow.content.startsWith('<g class="icon">')).toBe(true);
    expect(arrow.css).toContain("translate(2.12px, -2.12px)");

    const reset = cases.find(([name]) => name === "Reset")![1];
    expect(reset.css).toContain("rotate: -360deg");
  });

  test("build output", async () => {
    const names = cases.map(([name]) => name);
    const files = await buildAnimated(lookup);

    expect([...files.keys()].sort()).toEqual(
      [...names.map((name) => `${name}.svelte`), "animate.js", "icon.d.ts", "index.d.ts", "index.js"].sort()
    );
    expect(files.get("index.d.ts")).toMatchSnapshot();
  });

  test("fills in every Carbon token in the runtime", async () => {
    const files = await buildAnimated(lookup);
    const runtime = files.get("animate.js")!;
    expect(runtime).not.toMatch(/__[A-Z_0-9]+__/);
    expect(runtime).toContain(`const HOVER_DELAY = ${parseInt(DURATION.moderate01)};`);
    expect(runtime).toContain(EASING.standard.expressive);
  });

  test("requires a static icon of the same name", async () => {
    await expect(buildAnimated(() => undefined)).rejects.toThrow("Animated icon has no static icon: Add");
  });
});
