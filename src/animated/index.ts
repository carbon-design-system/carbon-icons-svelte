/**
 * `carbon-icons-svelte/animated`: hand-built animated versions of some icons.
 *
 * Carbon's icons are filled outlines, and many are a single merged path, so
 * per-part motion can't be generated from the descriptors. Each icon in
 * `./icons/` is drawn from its `@carbon/icons` paths, split into parts by
 * hand where the motion needs it. See "Animated icons" in CONTRIBUTING.md.
 */

import type { AnimatedIcon } from "./shared.js";
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
