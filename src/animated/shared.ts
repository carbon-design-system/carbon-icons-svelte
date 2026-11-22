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

/** Matches the icon while it plays. See `animate.js`. */
export const PLAYING = ":global(svg[data-playing])";

export const hashSource = (descriptor: IconOutput["descriptor"]) =>
  createHash("sha256")
    .update((descriptor.content ?? []).map(toString).join(""))
    .digest("hex")
    .slice(0, 12);
