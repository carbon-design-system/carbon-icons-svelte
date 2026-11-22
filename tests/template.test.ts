import type { IconOutput } from "@carbon/icons";
import { describe, expect, test } from "bun:test";
import { roundPathData, template, templateSvg } from "../src/template.js";

describe("template", () => {
  test("should generate correct Svelte component template with minimal input", () => {
    const input: IconOutput = {
      moduleName: "TestIcon",
      filepath: "test/path",
      size: 32,
      descriptor: {
        elem: "svg",
        name: "test",
        size: 32,
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 32,
          height: 32
        },
        content: [
          { elem: "path", attrs: { d: "M0 0h16v16H0z" } }
        ]
      }
    };

    const result = template(input);
    expect(result).toContain("<script>");
    expect(result).toContain("export let size = 16;");
    expect(result).toContain("export let title = undefined;");
    expect(result).toContain("<svg");
    expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(result).toContain('viewBox="0 0 32 32"');
    expect(result).toContain("path d=\"M0 0h16v16H0z\"");
  });

  test("should handle empty descriptor content", () => {
    const input: IconOutput = {
      moduleName: "EmptyIcon",
      filepath: "test/path",
      size: 32,
      descriptor: {
        elem: "svg",
        name: "empty",
        size: 32,
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 32,
          height: 32
        },
        content: []
      }
    };

    const result = template(input);
    expect(result).toContain("<svg");
    expect(result).not.toContain("path");
  });

  test("should handle minimal descriptor", () => {
    const input: IconOutput = {
      moduleName: "MinimalIcon",
      filepath: "test/path",
      size: 32,
      descriptor: {
        elem: "svg",
        name: "minimal",
        size: 32,
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 32,
          height: 32
        },
        content: []
      }
    };

    const result = template(input);
    expect(result).toContain("<svg");
    expect(result).not.toContain("path");
  });
});

describe("templateSvg", () => {
  test("should generate correct SVG for non-glyph icon", () => {
    const input: IconOutput = {
      moduleName: "TestIcon",
      filepath: "test/path",
      size: 32,
      descriptor: {
        elem: "svg",
        name: "test",
        size: 32,
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 32,
          height: 32
        },
        content: [
          { elem: "path", attrs: { d: "M0 0h32v32H0z" } }
        ]
      }
    };

    const result = templateSvg(input);
    expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(result).toContain('width="16"');
    expect(result).toContain('height="16"');
    expect(result).toContain('fill="currentColor"');
    expect(result).toContain('path d="M0 0h32v32H0z"');
    expect(result).not.toMatch(/xmlns="[^"]+"[^>]*xmlns="/);
    expect(result).not.toMatch(/fill="currentColor"[^>]*fill="currentColor"/);
  });

  test("should generate correct SVG for glyph icon", () => {
    const input: IconOutput = {
      moduleName: "TestIconGlyph",
      filepath: "test/path",
      size: 16,
      descriptor: {
        elem: "svg",
        name: "test-glyph",
        size: 16,
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 16,
          height: 16
        },
        content: [
          { elem: "path", attrs: { d: "M0 0h16v16H0z" } }
        ]
      }
    };

    const result = templateSvg(input);
    expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(result).toContain('width="16"');
    expect(result).toContain('height="16"');
  });

  test("should handle missing content gracefully", () => {
    const input: IconOutput = {
      moduleName: "EmptyIcon",
      filepath: "test/path",
      size: 16,
      descriptor: {
        elem: "svg",
        name: "empty",
        size: 16,
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 16,
          height: 16
        },
        content: []
      }
    };

    const result = templateSvg(input);
    expect(result).toContain("<svg");
    expect(result).not.toContain("path");
  });
});
describe("roundPathData", () => {
  test.each([
    ["M17 15 17 8", "M17 15 17 8"],
    ["M15.8159,3.0059", "M15.816,3.006"],
    ["l-.0323,6.9985", "l-.032,6.998"],
    ["M0.12345 1", "M.123 1"],
    ["l-0.00004 1", "l0 1"],
    ["l1.23456e-5 1", "l1.23456e-5 1"],
  ])("rounds %s to %s", (input, expected) => {
    expect(roundPathData(input)).toBe(expected);
  });

  test("keeps numbers that would merge after rounding apart", () => {
    // `1.99996.5` is `1.99996 .5`; rounded to `2`, it needs a separator.
    expect(roundPathData("l1.99996.5")).toBe("l2 .5");
    expect(roundPathData("l1.5.00004")).toBe("l1.5 0");
    expect(roundPathData("l3.12345.6")).toBe("l3.123.6");
  });

  test("leaves paths with arcs alone", () => {
    const d = "M18.7061,27.585a5.2615,5.2615,0,0,1-3.7227-8.9834";
    expect(roundPathData(d)).toBe(d);
  });
});
