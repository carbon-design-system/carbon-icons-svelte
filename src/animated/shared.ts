import { toString } from "@carbon/icon-helpers";
import type { IconOutput } from "@carbon/icons";
import { createHash } from "node:crypto";

export interface AnimatedIcon {
  /** Name of the static icon this animates. */
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
}

/**
 * Match the icon while it plays its motion (see `animate.js`) in each
 * `motion` mode. Carbon uses productive motion for routine UI, and
 * expressive motion for moments that matter. The `<svg>` carries
 * `data-motion` from the prop.
 *
 * `animate.js` only plays motion if the user hasn't asked for reduced
 * motion, or `reducedMotion="full"`, so icon CSS needs no media query.
 */
export const PRODUCTIVE = ':global(svg[data-playing="motion"][data-motion="productive"])';
export const EXPRESSIVE = ':global(svg[data-playing="motion"][data-motion="expressive"])';

// Carbon's motion tokens, copied from `@carbon/motion` 11.57.0
// (https://carbondesignsystem.com/elements/motion/overview/). They've been
// stable since Carbon v10; if Carbon changes them, update them here.

/** Carbon's motion durations. */
export const DURATION = {
  fast01: "70ms",
  fast02: "110ms",
  moderate01: "150ms",
  moderate02: "240ms",
  slow01: "400ms",
  slow02: "700ms",
};

/** Carbon's motion easings: productive for routine UI, expressive for moments that matter. */
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
    .update((descriptor.content ?? []).map(toString).join(""))
    .digest("hex")
    .slice(0, 12);
