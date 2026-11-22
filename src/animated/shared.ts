import { toString } from "@carbon/icon-helpers";
import type { IconOutput } from "@carbon/icons";
import {
  durationFast01,
  durationFast02,
  durationModerate01,
  durationModerate02,
  durationSlow01,
  durationSlow02,
  easings,
} from "@carbon/motion";
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

/** Matches the icon while it plays. See `animate.js`. */
export const PLAYING = ":global(svg[data-playing])";

/**
 * Match the icon while it plays in each `motion` mode. Carbon uses
 * productive motion for routine UI, and expressive motion for moments
 * that matter. The `<svg>` carries `data-motion` from the prop.
 */
export const PRODUCTIVE = ':global(svg[data-playing][data-motion="productive"])';
export const EXPRESSIVE = ':global(svg[data-playing][data-motion="expressive"])';

/** Carbon's motion durations, from `@carbon/motion`. */
export const DURATION = {
  fast01: durationFast01,
  fast02: durationFast02,
  moderate01: durationModerate01,
  moderate02: durationModerate02,
  slow01: durationSlow01,
  slow02: durationSlow02,
};

/** Carbon's motion easings, from `@carbon/motion`. */
export const EASING = easings;

export const hashSource = (descriptor: IconOutput["descriptor"]) =>
  createHash("sha256")
    .update((descriptor.content ?? []).map(toString).join(""))
    .digest("hex")
    .slice(0, 12);
