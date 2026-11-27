import type { IconOutput } from "@carbon/icons";
import { createHash } from "node:crypto";
import { renderContent } from "../template.js";

export interface AnimatedIcon {
  name: string;
  /**
   * Hash of the static icon's 32px content (see `hashSource`). Each icon is
   * split into parts by hand from Carbon's paths, so a test fails if Carbon
   * redraws one, and its parts need redoing.
   */
  sourceHash: string;
  /** SVG markup. `{id}` is a prefix for `<mask>` and `<clipPath>` ids, unique on the page. */
  content: string;
  /**
   * The icon's CSS, unscoped: plain class selectors and keyframe names.
   * `scopeCss` ties it to the icon, so it works without a framework.
   */
  css: string;
  /**
   * Set to `true` if the icon can loop, for progress. Unless `css` styles
   * `LOOP_PRODUCTIVE` and `LOOP_EXPRESSIVE` itself, the loop repeats the
   * one-shot animation of each mode (see `withLoop`), so every cycle starts
   * and ends at rest.
   */
  loop?: boolean;
}

// `animate.js` handles reduced motion, so icon CSS needs no media query.
export const PLAYING = 'svg[data-playing="motion"]';
export const PRODUCTIVE = 'svg[data-playing="motion"][data-motion="productive"]';
export const EXPRESSIVE = 'svg[data-playing="motion"][data-motion="expressive"]';
export const LOOP_PRODUCTIVE = 'svg[data-playing="loop"][data-motion="productive"]';
export const LOOP_EXPRESSIVE = 'svg[data-playing="loop"][data-motion="expressive"]';

/** Matches a rule that plays a one-shot animation: its mode, selector and `animation` value. */
const ONE_SHOT_RULE = /svg\[data-playing="motion"\]\[data-motion="(productive|expressive)"\] ([^{,]+?)\s*\{\s*animation:\s*([^;]+);\s*\}/g;

/** Splits a CSS list on its top-level commas, not the ones inside `cubic-bezier()`. */
const splitList = (value: string) => {
  const parts = [""];
  let depth = 0;
  for (const char of value) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "," && depth === 0) parts.push("");
    else parts[parts.length - 1] += char;
  }
  return parts.map((part) => part.trim());
};

/**
 * Adds loop rules that repeat each one-shot animation forever. A one-shot
 * cycle starts and ends at rest, so stopping at a cycle boundary is seamless.
 */
export const withLoop = (css: string) =>
  css.includes('data-playing="loop"')
    ? css
    : css +
      [...css.matchAll(ONE_SHOT_RULE)]
        .map(
          ([, mode, selector, value]) => `

  svg[data-playing="loop"][data-motion="${mode}"] ${selector} {
    animation: ${splitList(value!).map((part) => `${part} infinite`).join(",\n      ")};
  }`
        )
        .join("");

/** Matches a top-level block: its prelude and its body, one level of nesting deep. */
const BLOCK = /([^{}]+)\{((?:[^{}]|\{[^{}]*\})*)\}/g;

/** Matches the name in `@keyframes name`. */
const KEYFRAMES = /^@keyframes\s+([\w-]+)$/;

/** The root selector of an icon's `<svg>`. */
export const iconRoot = (name: string) => `svg[data-animated-icon="${name}"]`;

/** An icon's keyframe name, unique on the page. */
export const keyframeName = (name: string, keyframes: string) => `ccs-animated-${name}-${keyframes}`;

/**
 * Ties an icon's CSS to the icon, so it works without a framework's scoping:
 * every selector starts at the icon's `<svg>`, and every keyframe name gets
 * the icon's name. A selector that already starts at the `<svg>`, like
 * `PRODUCTIVE`, gets the icon's attribute added to it.
 */
export const scopeCss = (name: string, css: string) => {
  const root = iconRoot(name);
  const keyframes = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, kf]) => kf!));
  const rename = (value: string) =>
    value.replace(/(^|[\s,])([\w-]+)(?=[\s,;]|$)/g, (match, before, word) =>
      keyframes.has(word) ? `${before}${keyframeName(name, word)}` : match
    );

  return css.replace(BLOCK, (block, prelude: string, body: string) => {
    const lead = prelude.match(/^\s*/)![0];
    const head = prelude.trim();
    if (head.includes("/*") || (head.startsWith("@") && !KEYFRAMES.test(head))) {
      throw new Error(`${name}: scopeCss handles rules and @keyframes only, not: ${head}`);
    }
    const kf = head.match(KEYFRAMES);
    if (kf) return `${lead}@keyframes ${keyframeName(name, kf[1]!)} {${body}}`;

    const selectors = head
      .split(",")
      .map((selector) => selector.trim())
      .map((selector) => (selector.startsWith("svg[") ? root + selector.slice(3) : `${root} ${selector}`));
    const declarations = body.replace(/(animation(?:-name)?\s*:)([^;]+)/g, (_, property, value) => property + rename(value));
    return `${lead}${selectors.join(`,\n${lead.replace(/^\n+/, "")}`)} {${declarations}}`;
  });
};

// Carbon's motion tokens, copied from `@carbon/motion` 11.57.0
// (https://carbondesignsystem.com/elements/motion/overview/). They've been
// stable since Carbon v10; if Carbon changes them, update them here.

export const DURATION = {
  fast01: "70ms",
  fast02: "110ms",
  moderate01: "150ms",
  moderate02: "240ms",
  slow01: "400ms",
  slow02: "700ms",
};

export const EASING = {
  standard: {
    productive: "cubic-bezier(0.2, 0, 0.38, 0.9)",
    expressive: "cubic-bezier(0.4, 0.14, 0.3, 1)",
  },
  entrance: {
    productive: "cubic-bezier(0, 0, 0.38, 0.9)",
    expressive: "cubic-bezier(0, 0, 0.3, 1)",
  },
  exit: {
    productive: "cubic-bezier(0.2, 0, 1, 0.9)",
    expressive: "cubic-bezier(0.4, 0.14, 1, 1)",
  },
};

export const hashSource = (descriptor: IconOutput["descriptor"]) =>
  createHash("sha256")
    .update(renderContent(descriptor))
    .digest("hex")
    .slice(0, 12);
