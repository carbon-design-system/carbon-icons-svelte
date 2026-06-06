import { formatAttributes, toString } from "@carbon/icon-helpers";
import type { IconOutput } from "@carbon/icons";

const GLYPH_SUFFIX_PATTERN = /Glyph$/;

const compactSvg = (svg: string) =>
  svg.replace(/\s+/g, " ").replace(/> </g, "><").trim();

const omitDuplicateSvgAttrs = ({
  xmlns,
  fill,
  ...rest
}: Record<string, string | number>) => rest;

export const template = ({ descriptor }: IconOutput) => `<script>
  export let size = 16;

  export let title = undefined;

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
  {...attributes}
  {...$$restProps}>
  {#if title}<title>{title}</title>{/if}
  ${(descriptor?.content ?? []).map(toString).join("")}
</svg>`;

export const templateSvg = ({ moduleName, descriptor }: IconOutput) => {
  const isGlyph = GLYPH_SUFFIX_PATTERN.test(moduleName);
  const attrs = omitDuplicateSvgAttrs(descriptor?.attrs ?? {});
  const content = descriptor?.content ?? [];

  const { width, height, ...rest } = attrs;
  const formatted = formatAttributes(
    isGlyph ? attrs : { ...rest, width: 16, height: 16 }
  );
  const inner = content.map(toString).join("");

  return compactSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" ${formatted} fill="currentColor" preserveAspectRatio="xMidYMid meet">${inner}</svg>`
  );
};
