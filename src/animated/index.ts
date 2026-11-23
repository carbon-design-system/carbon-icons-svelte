// See "Animated icons" in CONTRIBUTING.md.

import type { IconOutput } from "@carbon/icons";
import { RULES, ruleIcons } from "./rules.js";
import { DURATION, EASING, type AnimatedIcon } from "./shared.js";
import Add from "./icons/Add.js";
import Checkmark from "./icons/Checkmark.js";
import ChevronRight from "./icons/ChevronRight.js";
import Copy from "./icons/Copy.js";
import Download from "./icons/Download.js";
import Edit from "./icons/Edit.js";
import Favorite from "./icons/Favorite.js";
import Light from "./icons/Light.js";
import Location from "./icons/Location.js";
import Locked from "./icons/Locked.js";
import Notification from "./icons/Notification.js";
import Renew from "./icons/Renew.js";
import RotateClockwise from "./icons/RotateClockwise.js";
import RotateClockwiseAlt from "./icons/RotateClockwiseAlt.js";
import RotateClockwiseAltFilled from "./icons/RotateClockwiseAltFilled.js";
import RotateClockwiseFilled from "./icons/RotateClockwiseFilled.js";
import RotateCounterclockwise from "./icons/RotateCounterclockwise.js";
import RotateCounterclockwiseAlt from "./icons/RotateCounterclockwiseAlt.js";
import RotateCounterclockwiseAltFilled from "./icons/RotateCounterclockwiseAltFilled.js";
import RotateCounterclockwiseFilled from "./icons/RotateCounterclockwiseFilled.js";
import Search from "./icons/Search.js";
import Send from "./icons/Send.js";
import Settings from "./icons/Settings.js";
import Star from "./icons/Star.js";
import Time from "./icons/Time.js";
import TrashCan from "./icons/TrashCan.js";
import Upload from "./icons/Upload.js";
import View from "./icons/View.js";
import VolumeUp from "./icons/VolumeUp.js";
import WarningAlt from "./icons/WarningAlt.js";
import Wifi from "./icons/Wifi.js";

export type { AnimatedIcon } from "./shared.js";

export const ANIMATED_ICONS: AnimatedIcon[] = [
  Add,
  Checkmark,
  ChevronRight,
  Copy,
  Download,
  Edit,
  Favorite,
  Light,
  Location,
  Locked,
  Notification,
  Renew,
  RotateClockwise,
  RotateClockwiseAlt,
  RotateClockwiseAltFilled,
  RotateClockwiseFilled,
  RotateCounterclockwise,
  RotateCounterclockwiseAlt,
  RotateCounterclockwiseAltFilled,
  RotateCounterclockwiseFilled,
  Search,
  Send,
  Settings,
  Star,
  Time,
  TrashCan,
  Upload,
  View,
  VolumeUp,
  WarningAlt,
  Wifi,
];

/** Content that references `{id}` gets a unique id prefix per instance. */
const ID_PATTERN = /\{id\}/;

export const HOVER_DELAY = parseInt(DURATION.moderate01);

export const fillTokens = (source: string) =>
  source
    .replace("__DURATION_MODERATE_01__", String(HOVER_DELAY))
    .replace("__DURATION_SLOW_01__", String(parseInt(DURATION.slow01)))
    .replace("__DURATION_SLOW_02__", String(parseInt(DURATION.slow02)))
    .replace("__EASING_STANDARD_PRODUCTIVE__", JSON.stringify(EASING.standard.productive))
    .replace("__EASING_STANDARD_EXPRESSIVE__", JSON.stringify(EASING.standard.expressive));

export const templateAnimated = ({ content, css }: AnimatedIcon) => {
  const usesId = ID_PATTERN.test(content);

  return `<script>
  import { animate, getAnimatedIconDefaults${usesId ? ", uid" : ""} } from "./animate.js";

  export let size = 16;

  export let title = undefined;

  export let play = false;

  export let trigger = undefined;

  export let motion = undefined;

  export let reducedMotion = undefined;

  export let hoverDelay = undefined;

  const defaults = getAnimatedIconDefaults();
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
  data-motion={motion ?? defaults.motion ?? "productive"}
  use:animate={{ play, trigger, reducedMotion, hoverDelay, defaults }}
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

/** Props that \`setAnimatedIconDefaults\` can set for every icon below a component. */
export type CarbonAnimatedIconDefaults = {
  /**
   * \`"hover"\` plays the animation when a mouse rests on the icon, or on the
   * link, button, label or summary around it, for \`hoverDelay\` ms, or when
   * that gets keyboard focus. \`"none"\` plays it only through \`play\`.
   * @default "hover"
   */
  trigger?: "hover" | "none";

  /**
   * Carbon's motion style. \`"productive"\` is short and subtle, for routine UI.
   * \`"expressive"\` is larger and livelier, for moments that matter.
   * @default "productive"
   */
  motion?: "productive" | "expressive";

  /**
   * What plays when the user prefers reduced motion. \`"static"\` plays
   * nothing. \`"fade"\` dims the icon and brings it back, without moving it.
   * \`"full"\` plays the full motion anyway; use it only when the motion is
   * essential to understanding the change.
   * @default "static"
   */
  reducedMotion?: "static" | "fade" | "full";

  /**
   * How long, in ms, a mouse must rest on the trigger before the icon plays,
   * so sweeping across a toolbar plays nothing.
   * @default ${HOVER_DELAY}
   */
  hoverDelay?: number;
};

export type CarbonAnimatedIconProps = CarbonIconProps &
  CarbonAnimatedIconDefaults & {
    /**
     * Plays the animation each time this changes to a truthy value.
     * Increment a number to replay it on demand.
     * @default false
     */
    play?: boolean | number;
  };

/** See \`CarbonIcon\` in \`../index.d.ts\`. */
type CarbonAnimatedIcon = typeof import("svelte") extends { mount: any }
  ? (this: void, internals: unknown, props: CarbonAnimatedIconProps) => {}
  : new (
      options: ComponentConstructorOptions<CarbonAnimatedIconProps>
    ) => SvelteComponent<CarbonAnimatedIconProps, Record<string, any>, {}>;

/**
 * Sets defaults for every animated icon in this component and its children,
 * such as icons passed to a component's \`icon\` prop, which can't take
 * extra props. Call it while the component initializes. Props on an icon win.
 */
export declare function setAnimatedIconDefaults(defaults: CarbonAnimatedIconDefaults): void;

${names.map((name) => `export declare const ${name}: CarbonAnimatedIcon;`).join("\n")}
`;

export type IconLookup = (name: string) => IconOutput | undefined;

export const allAnimatedIcons = (lookup: IconLookup) => {
  const handBuilt = new Set(ANIMATED_ICONS.map(({ name }) => name));

  for (const name of handBuilt) {
    if (!lookup(name)) throw new Error(`Animated icon has no static icon: ${name}`);
  }

  for (const name of Object.keys(RULES)) {
    if (handBuilt.has(name)) throw new Error(`Animated icon is both hand-built and rule-based: ${name}`);
  }

  return [...ANIMATED_ICONS, ...ruleIcons(lookup)].sort((a, b) => (a.name < b.name ? -1 : 1));
};

export const buildAnimated = async (lookup: IconLookup) => {
  const files = new Map<string, string>();
  const icons = allAnimatedIcons(lookup);
  const names = icons.map(({ name }) => name);

  for (const icon of icons) {
    files.set(`${icon.name}.svelte`, templateAnimated(icon));
  }

  files.set("animate.js", fillTokens(await Bun.file(new URL("./animate.js", import.meta.url)).text()));
  files.set(
    "index.js",
    'export { setAnimatedIconDefaults } from "./animate.js";\n' +
      names.map((name) => `export { default as ${name} } from "./${name}.svelte";\n`).join("")
  );
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
