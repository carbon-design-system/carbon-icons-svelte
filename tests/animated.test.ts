import metadata from "@carbon/icons/metadata.json" with { type: "json" };
import { describe, expect, test } from "bun:test";
import { compile } from "svelte/compiler";
import { ANIMATED_ICONS, buildAnimated, templateAnimated } from "../src/animated/index.js";

/** The 32px descriptor that the static component is built from. */
const staticPaths = (name: string) => {
  const output = metadata.icons
    .flatMap((icon) => icon.output)
    .find((output) => output.moduleName === `${name}32`);

  return output?.descriptor.content.map((element) => element.attrs.d);
};

describe("animated icons", () => {
  // Animated icons are split into parts by hand. If Carbon redraws an icon,
  // redo its parts from the new paths, then update `source`.
  test.each(ANIMATED_ICONS.map((icon) => [icon.name, icon] as const))(
    "%s is built from the current @carbon/icons paths",
    (name, icon) => {
      expect(staticPaths(name)).toEqual(icon.source);
    }
  );

  test.each(ANIMATED_ICONS.map((icon) => [icon.name, icon] as const))(
    "%s compiles without warnings",
    (name, icon) => {
      for (const generate of ["client", "server"] as const) {
        const { warnings, css } = compile(templateAnimated(icon), { filename: `${name}.svelte`, generate });
        expect(warnings).toEqual([]);
        // Every rule that plays the animation is gated by reduced motion.
        expect(css?.code).toContain("@media (prefers-reduced-motion: no-preference)");
      }
    }
  );

  test("gives masks and clip paths a unique id per instance", () => {
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
    const names = new Set(ANIMATED_ICONS.map(({ name }) => name));
    const files = await buildAnimated(names);

    expect([...files.keys()].sort()).toEqual([
      "Checkmark.svelte",
      "Download.svelte",
      "Notification.svelte",
      "Renew.svelte",
      "animate.js",
      "icon.d.ts",
      "index.d.ts",
      "index.js",
    ]);
    expect(files.get("index.d.ts")).toMatchSnapshot();
  });

  test("requires a static icon of the same name", async () => {
    await expect(buildAnimated(new Set())).rejects.toThrow("Animated icon has no static icon: Checkmark");
  });
});
