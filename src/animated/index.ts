// See "Animated icons" in CONTRIBUTING.md.

import type { IconOutput } from "@carbon/icons";
import { RULES, ruleIcons } from "./rules.js";
import { DURATION, EASING, type AnimatedIcon } from "./shared.js";
import AddIcon from "./icons/Add.js";
import ArrowsHorizontalIcon from "./icons/ArrowsHorizontal.js";
import ArrowsVerticalIcon from "./icons/ArrowsVertical.js";
import CheckmarkIcon from "./icons/Checkmark.js";
import CheckmarkFilledIcon from "./icons/CheckmarkFilled.js";
import CheckmarkOutlineIcon from "./icons/CheckmarkOutline.js";
import ChevronRightIcon from "./icons/ChevronRight.js";
import CloseIcon from "./icons/Close.js";
import CopyIcon from "./icons/Copy.js";
import DownloadIcon from "./icons/Download.js";
import EditIcon from "./icons/Edit.js";
import EditOffIcon from "./icons/EditOff.js";
import ErrorIcon from "./icons/Error.js";
import ErrorFilledIcon from "./icons/ErrorFilled.js";
import FavoriteIcon from "./icons/Favorite.js";
import FavoriteFilledIcon from "./icons/FavoriteFilled.js";
import InformationIcon from "./icons/Information.js";
import InformationFilledIcon from "./icons/InformationFilled.js";
import InformationSquareFilledIcon from "./icons/InformationSquareFilled.js";
import LaunchIcon from "./icons/Launch.js";
import LightIcon from "./icons/Light.js";
import LocationIcon from "./icons/Location.js";
import LockedIcon from "./icons/Locked.js";
import MenuIcon from "./icons/Menu.js";
import NotificationIcon from "./icons/Notification.js";
import OverflowMenuHorizontalIcon from "./icons/OverflowMenuHorizontal.js";
import OverflowMenuVerticalIcon from "./icons/OverflowMenuVertical.js";
import RenewIcon from "./icons/Renew.js";
import RotateClockwiseIcon from "./icons/RotateClockwise.js";
import RotateClockwiseAltIcon from "./icons/RotateClockwiseAlt.js";
import RotateClockwiseAltFilledIcon from "./icons/RotateClockwiseAltFilled.js";
import RotateClockwiseFilledIcon from "./icons/RotateClockwiseFilled.js";
import RotateCounterclockwiseIcon from "./icons/RotateCounterclockwise.js";
import RotateCounterclockwiseAltIcon from "./icons/RotateCounterclockwiseAlt.js";
import RotateCounterclockwiseAltFilledIcon from "./icons/RotateCounterclockwiseAltFilled.js";
import RotateCounterclockwiseFilledIcon from "./icons/RotateCounterclockwiseFilled.js";
import SearchIcon from "./icons/Search.js";
import SendIcon from "./icons/Send.js";
import SettingsIcon from "./icons/Settings.js";
import StarIcon from "./icons/Star.js";
import StarFilledIcon from "./icons/StarFilled.js";
import SubtractIcon from "./icons/Subtract.js";
import TimeIcon from "./icons/Time.js";
import TrashCanIcon from "./icons/TrashCan.js";
import UploadIcon from "./icons/Upload.js";
import ViewIcon from "./icons/View.js";
import ViewOffIcon from "./icons/ViewOff.js";
import VolumeUpIcon from "./icons/VolumeUp.js";
import WarningIcon from "./icons/Warning.js";
import WarningAltIcon from "./icons/WarningAlt.js";
import WarningAltFilledIcon from "./icons/WarningAltFilled.js";
import WarningAltInvertedFilledIcon from "./icons/WarningAltInvertedFilled.js";
import WarningFilledIcon from "./icons/WarningFilled.js";
import WarningSquareFilledIcon from "./icons/WarningSquareFilled.js";
import WifiIcon from "./icons/Wifi.js";

export type { AnimatedIcon } from "./shared.js";

// Suffixed so icon names like `Error` don't shadow globals.
export const ANIMATED_ICONS: AnimatedIcon[] = [
  AddIcon,
  ArrowsHorizontalIcon,
  ArrowsVerticalIcon,
  CheckmarkIcon,
  CheckmarkFilledIcon,
  CheckmarkOutlineIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  EditOffIcon,
  ErrorIcon,
  ErrorFilledIcon,
  FavoriteIcon,
  FavoriteFilledIcon,
  InformationIcon,
  InformationFilledIcon,
  InformationSquareFilledIcon,
  LaunchIcon,
  LightIcon,
  LocationIcon,
  LockedIcon,
  MenuIcon,
  NotificationIcon,
  OverflowMenuHorizontalIcon,
  OverflowMenuVerticalIcon,
  RenewIcon,
  RotateClockwiseIcon,
  RotateClockwiseAltIcon,
  RotateClockwiseAltFilledIcon,
  RotateClockwiseFilledIcon,
  RotateCounterclockwiseIcon,
  RotateCounterclockwiseAltIcon,
  RotateCounterclockwiseAltFilledIcon,
  RotateCounterclockwiseFilledIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  StarIcon,
  StarFilledIcon,
  SubtractIcon,
  TimeIcon,
  TrashCanIcon,
  UploadIcon,
  ViewIcon,
  ViewOffIcon,
  VolumeUpIcon,
  WarningIcon,
  WarningAltIcon,
  WarningAltFilledIcon,
  WarningAltInvertedFilledIcon,
  WarningFilledIcon,
  WarningSquareFilledIcon,
  WifiIcon,
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
     * Plays the animation when the icon mounts with a truthy value, and each
     * time this changes to a new truthy value. Increment a number to replay
     * it on demand.
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
