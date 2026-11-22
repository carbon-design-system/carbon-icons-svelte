import metadata from "@carbon/icons/metadata.json" with { type: "json" };
import type { IconOutput } from "@carbon/icons";
import { describe, expect, test } from "bun:test";
import { compile } from "svelte/compiler";
import { ANIMATED_ICONS, buildAnimated, templateAnimated } from "../src/animated/index.js";
import { DURATION, EASING, EXPRESSIVE, hashSource } from "../src/animated/shared.js";

/** Matches each `d` attribute in an icon's content. */
const D_PATTERN = / d="([^"]+)"/g;

/** Matches each command letter or number in a path. */
const PATH_TOKEN_PATTERN = /[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g;

/** Matches each duration or delay in CSS. */
const DURATION_PATTERN = /\b\d+(?:\.\d+)?m?s\b/g;

/** Matches each cubic Bézier easing in CSS. */
const CUBIC_BEZIER_PATTERN = /cubic-bezier\([^)]*\)/g;

/** The 32px descriptor that the static component is built from. */
const staticDescriptor = (name: string) =>
  metadata.icons.flatMap((icon) => icon.output).find((output) => output.moduleName === `${name}32`)
    ?.descriptor as IconOutput["descriptor"] | undefined;

/** A path's commands and numbers, so `1.50` and `1.5` compare equal. */
const normalize = (d: string) =>
  (d.match(PATH_TOKEN_PATTERN) ?? []).map((token) => (/[a-zA-Z]/.test(token) ? token : parseFloat(token))).join(" ");

const cases = ANIMATED_ICONS.map((icon) => [icon.name, icon] as const);

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
      // Every rule that plays the animation is gated by reduced motion.
      expect(css?.code).toContain("@media (prefers-reduced-motion: no-preference)");
    }
  });

  // Icons with a productive and an expressive mode use Carbon's motion
  // tokens only. Percentages in keyframes aren't durations, so they're fine.
  test.each(cases.filter(([, icon]) => icon.css.includes(EXPRESSIVE)))("%s uses Carbon motion tokens", (_, icon) => {
    const durations = new Set<string>(Object.values(DURATION));
    const easings = new Set<string>(Object.values(EASING).flatMap((modes) => Object.values(modes)));

    for (const [duration] of icon.css.matchAll(DURATION_PATTERN)) expect(durations).toContain(duration);
    for (const [easing] of icon.css.matchAll(CUBIC_BEZIER_PATTERN)) expect(easings).toContain(easing);
  });

  test("gives masks and clip paths a unique id prefix per instance", () => {
    const checkmark = templateAnimated(ANIMATED_ICONS.find(({ name }) => name === "Checkmark")!);
    expect(checkmark).toContain('import { animate, uid } from "./animate.js";');
    expect(checkmark).toContain("const id = uid();");

    const renew = templateAnimated(ANIMATED_ICONS.find(({ name }) => name === "Renew")!);
    expect(renew).toContain('import { animate } from "./animate.js";');
    expect(renew).not.toContain("uid");
  });

  test("template", () => {
    expect(templateAnimated(ANIMATED_ICONS.find(({ name }) => name === "Notification")!)).toMatchSnapshot();
  });

  test("build output", async () => {
    const names = ANIMATED_ICONS.map(({ name }) => name).sort();
    const files = await buildAnimated(new Set(names));

    expect([...files.keys()].sort()).toEqual(
      [...names.map((name) => `${name}.svelte`), "animate.js", "icon.d.ts", "index.d.ts", "index.js"].sort()
    );
    expect(files.get("index.d.ts")).toMatchSnapshot();
  });

  test("requires a static icon of the same name", async () => {
    await expect(buildAnimated(new Set())).rejects.toThrow("Animated icon has no static icon: Add");
  });
});
