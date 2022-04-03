import { toString, formatAttributes } from "@carbon/icon-helpers";
import type { IconOutput } from "@carbon/icons";

export const template = ({ descriptor }: IconOutput) => `<script>
  export let size = 16;

  $: labelled = $$props["aria-label"] || $$props["aria-labelledby"] || $$props["title"];
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
  {...attributes}
  {...$$restProps}>
  ${descriptor.content.map((element) => toString(element)).join("")}
</svg>`;

export const templateSvg = ({ moduleName, descriptor }: IconOutput) => {
  const isGlyph = /Glyph$/.test(moduleName);
  const { width, height, ...rest } = descriptor.attrs;

  let attrs = formatAttributes(
    isGlyph ? descriptor.attrs : { ...rest, width: 16, height: 16 }
  );

  return `<svg
  data-svg-carbon-icon="${moduleName}"
  xmlns="http://www.w3.org/2000/svg"
  ${attrs}
  fill="currentColor"
  preserveAspectRatio="xMidYMid meet">
  ${descriptor.content.map((element) => toString(element)).join("")}
</svg>`;
};
