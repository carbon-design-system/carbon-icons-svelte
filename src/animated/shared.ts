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
  /** Component CSS. Svelte scopes it, keyframe names included. */
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
export const PLAYING = ':global(svg[data-playing="motion"])';
export const PRODUCTIVE = ':global(svg[data-playing="motion"][data-motion="productive"])';
export const EXPRESSIVE = ':global(svg[data-playing="motion"][data-motion="expressive"])';
export const LOOP_PRODUCTIVE = ':global(svg[data-playing="loop"][data-motion="productive"])';
export const LOOP_EXPRESSIVE = ':global(svg[data-playing="loop"][data-motion="expressive"])';

/** Matches a rule that plays a one-shot animation: its mode, selector and `animation` value. */
const ONE_SHOT_RULE = /:global\(svg\[data-playing="motion"\]\[data-motion="(productive|expressive)"\]\) ([^{,]+?)\s*\{\s*animation:\s*([^;]+);\s*\}/g;

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

  :global(svg[data-playing="loop"][data-motion="${mode}"]) ${selector} {
    animation: ${splitList(value!).map((part) => `${part} infinite`).join(",\n      ")};
  }`
        )
        .join("");

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
