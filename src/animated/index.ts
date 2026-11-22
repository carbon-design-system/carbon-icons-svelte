/**
 * `carbon-icons-svelte/animated`: hand-built animated versions of a few icons.
 *
 * Carbon's icons are filled outlines, and many are a single merged path, so
 * per-part motion can't be generated from the descriptors. Each icon here is
 * drawn from its `@carbon/icons` paths, split into parts by hand where the
 * motion needs it. `source` records the paths each one was built from;
 * `tests/animated.test.ts` fails if Carbon redraws the icon.
 */

export interface AnimatedIcon {
  /** Name of the static icon this animates. */
  name: string;
  /** `d` of each path in the static icon, in order. */
  source: string[];
  /** SVG markup. `{id}` is an id for a `<mask>` or `<clipPath>`, unique on the page. */
  content: string;
  /** Component CSS. Svelte scopes it, keyframe names included. */
  css: string;
}

/** Matches the icon while it plays. See `animate.js`. */
const PLAYING = ":global(svg[data-playing])";

/** Content that references `{id}` gets a unique id per instance. */
const ID_PATTERN = /\{id\}/;

const NOTIFICATION =
  "M28.7071,19.293,26,16.5859V13a10.0136,10.0136,0,0,0-9-9.9492V1H15V3.0508A10.0136,10.0136,0,0,0,6,13v3.5859L3.2929,19.293A1,1,0,0,0,3,20v3a1,1,0,0,0,1,1h7v.7768a5.152,5.152,0,0,0,4.5,5.1987A5.0057,5.0057,0,0,0,21,25V24h7a1,1,0,0,0,1-1V20A1,1,0,0,0,28.7071,19.293ZM19,25a3,3,0,0,1-6,0V24h6Zm8-3H5V20.4141L7.707,17.707A1,1,0,0,0,8,17V13a8,8,0,0,1,16,0v4a1,1,0,0,0,.293.707L27,20.4141Z";
const RENEW_TOP = "M12,10H6.78A11,11,0,0,1,27,16h2A13,13,0,0,0,6,7.68V4H4v8h8Z";
const RENEW_BOTTOM = "M20,22h5.22A11,11,0,0,1,5,16H3a13,13,0,0,0,23,8.32V28h2V20H20Z";
const CHECKMARK = "M13 24 4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z";
const DOWNLOAD_TRAY = "M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z";
const DOWNLOAD_ARROW = "M26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14z";

export const ANIMATED_ICONS: AnimatedIcon[] = [
  {
    name: "Checkmark",
    source: [CHECKMARK],
    // The check is a filled shape, so it can't be drawn with a stroke. A
    // stroke along its centreline masks it instead, which reveals Carbon's
    // exact fill. The stroke overshoots both ends and is wide enough to
    // cover the fill.
    content: `<mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <path class="ink" d="M3 12.586 13 22.586 29 6.586" fill="none" stroke="#fff" stroke-width="4" pathLength="1" stroke-dasharray="1 1" />
  </mask>
  <path mask="url(#{id})" d="${CHECKMARK}" />`,
    css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .ink {
      animation: draw 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
    }
  }

  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }`,
  },
  {
    name: "Download",
    source: [DOWNLOAD_TRAY, DOWNLOAD_ARROW],
    // The clip is on a wrapper so it stays put while the arrow moves.
    content: `<clipPath id={id}>
    <rect width="32" height="24" />
  </clipPath>
  <g clip-path="url(#{id})">
    <path class="arrow" d="${DOWNLOAD_ARROW}" />
  </g>
  <path class="tray" d="${DOWNLOAD_TRAY}" />`,
    css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .arrow {
      animation: drop 850ms;
    }

    ${PLAYING} .tray {
      animation: catch 850ms;
    }
  }

  /* Falls into the tray, then a new arrow drops in from the top. */
  @keyframes drop {
    0% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.45);
    }
    38% {
      transform: translateY(24px);
      animation-timing-function: step-end;
    }
    38.1% {
      transform: translateY(-24px);
      animation-timing-function: cubic-bezier(0.2, 0.75, 0.3, 1.08);
    }
    100% {
      transform: translateY(0);
    }
  }

  /* Dips as the arrow lands. */
  @keyframes catch {
    0%,
    30% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.2, 0, 0.3, 1);
    }
    40% {
      transform: translateY(1.5px);
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    66%,
    100% {
      transform: translateY(0);
    }
  }`,
  },
  {
    name: "Notification",
    source: [NOTIFICATION],
    // Carbon draws the bell as one path. The clapper is split out so it can
    // swing on its own, and the bell's bottom edge is closed where it joined.
    content: `<path class="clapper" d="M11,24v.7768a5.152,5.152,0,0,0,4.5,5.1987A5.0057,5.0057,0,0,0,21,25V24ZM19,25a3,3,0,0,1-6,0V24h6Z" />
  <path class="bell" d="M28.7071,19.293,26,16.5859V13a10.0136,10.0136,0,0,0-9-9.9492V1H15V3.0508A10.0136,10.0136,0,0,0,6,13v3.5859L3.2929,19.293A1,1,0,0,0,3,20v3a1,1,0,0,0,1,1H28a1,1,0,0,0,1-1V20A1,1,0,0,0,28.7071,19.293ZM27,22H5V20.4141L7.707,17.707A1,1,0,0,0,8,17V13a8,8,0,0,1,16,0v4a1,1,0,0,0,.293.707L27,20.4141Z" />`,
    css: `  /* Both swing from the top of the stem. */
  .bell,
  .clapper {
    transform-box: view-box;
    transform-origin: 16px 1px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .bell {
      animation: ring 900ms ease-in-out;
    }

    /* Starts later and swings further, so it lags behind the bell. */
    ${PLAYING} .clapper {
      animation: ring-clapper 900ms ease-in-out 40ms backwards;
    }
  }

  @keyframes ring {
    12% {
      transform: rotate(14deg);
    }
    28% {
      transform: rotate(-11deg);
    }
    44% {
      transform: rotate(7deg);
    }
    60% {
      transform: rotate(-4deg);
    }
    76% {
      transform: rotate(1.5deg);
    }
  }

  @keyframes ring-clapper {
    13% {
      transform: rotate(20deg);
    }
    30% {
      transform: rotate(-15deg);
    }
    46% {
      transform: rotate(10deg);
    }
    62% {
      transform: rotate(-5deg);
    }
    78% {
      transform: rotate(2deg);
    }
  }`,
  },
  {
    name: "Renew",
    source: [RENEW_TOP, RENEW_BOTTOM],
    content: `<g class="arrows">
    <path d="${RENEW_TOP}" />
    <path d="${RENEW_BOTTOM}" />
  </g>`,
    // The icon looks the same after a half turn, so 180° ends where it
    // started. It turns the way the arrows point, with a slight overshoot.
    css: `  .arrows {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .arrows {
      animation: spin 700ms cubic-bezier(0.3, 1.25, 0.5, 1);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(-180deg);
    }
  }`,
  },
];

export const templateAnimated = ({ content, css }: AnimatedIcon) => {
  const usesId = ID_PATTERN.test(content);

  return `<script>
  import { animate${usesId ? ", uid" : ""} } from "./animate.js";

  export let size = 16;

  export let title = undefined;

  export let play = false;

  export let trigger = "hover";
${usesId ? "\n  const id = uid();\n" : ""}
  $: labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title;
  $: attributes = {
    "aria-hidden": labelled ? undefined : true,
    role: labelled ? "img" : undefined,
    focusable: Number($$props["tabindex"]) === 0 ? true : undefined
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 32 32"
  fill="currentColor"
  preserveAspectRatio="xMidYMid meet"
  width={size}
  height={size}
  use:animate={{ play, trigger }}
  {...attributes}
  {...$$restProps}>
  {#if title}<title>{title}</title>{/if}
  ${content}
</svg>

<style>
${css}
</style>
`;
};

const definitions = (names: string[]) => `import type { ComponentConstructorOptions, SvelteComponent } from "svelte";
import type { CarbonIconProps } from "../index.js";

export type CarbonAnimatedIconProps = CarbonIconProps & {
  /**
   * Plays the animation each time this changes to a truthy value.
   * Increment a number to replay it on demand.
   * @default false
   */
  play?: boolean | number;

  /**
   * \`"hover"\` plays the animation when the pointer enters the icon or the
   * link, button, label or summary around it, or when that gets keyboard focus.
   * \`"none"\` plays it only through \`play\`.
   * @default "hover"
   */
  trigger?: "hover" | "none";
};

/** See \`CarbonIcon\` in \`../index.d.ts\`. */
type CarbonAnimatedIcon = typeof import("svelte") extends { mount: any }
  ? (this: void, internals: unknown, props: CarbonAnimatedIconProps) => {}
  : new (
      options: ComponentConstructorOptions<CarbonAnimatedIconProps>
    ) => SvelteComponent<CarbonAnimatedIconProps, Record<string, any>, {}>;

${names.map((name) => `export declare const ${name}: CarbonAnimatedIcon;`).join("\n")}
`;

/** Returns the files for `lib/animated/`. */
export const buildAnimated = async (staticNames: Set<string>) => {
  const files = new Map<string, string>();
  const names = ANIMATED_ICONS.map(({ name }) => name).sort();

  for (const icon of ANIMATED_ICONS) {
    if (!staticNames.has(icon.name)) {
      throw new Error(`Animated icon has no static icon: ${icon.name}`);
    }

    files.set(`${icon.name}.svelte`, templateAnimated(icon));
  }

  files.set("animate.js", await Bun.file(new URL("./animate.js", import.meta.url)).text());
  files.set("index.js", names.map((name) => `export { default as ${name} } from "./${name}.svelte";\n`).join(""));
  files.set("index.d.ts", definitions(names));
  files.set(
    "icon.d.ts",
    `import type { ${names[0]} } from "./index.js";

declare const Icon: typeof ${names[0]};
export default Icon;
`
  );

  return files;
};
