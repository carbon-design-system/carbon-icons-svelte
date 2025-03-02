import type { IconOutput } from "@carbon/icons";
import { describe, expect, test } from "bun:test";
import { template, templateSvg } from "../src/template.js";

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
    expect(result).toContain('data-svg-carbon-icon="TestIcon"');
    expect(result).toContain('width="16"');
    expect(result).toContain('height="16"');
    expect(result).toContain('fill="currentColor"');
    expect(result).toContain('path d="M0 0h32v32H0z"');
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
    expect(result).toContain('data-svg-carbon-icon="TestIconGlyph"');
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
    expect(result).toContain('data-svg-carbon-icon="EmptyIcon"');
    expect(result).not.toContain("path");
  });
}); 