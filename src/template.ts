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

/** One SVG number: sign, digits with an optional fraction or a bare fraction, exponent. */
const SVG_NUMBER_PATTERN = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g;

/** Arc commands, whose shape can shift far more than their numbers do. */
const ARC_COMMAND_PATTERN = /[Aa]/;

/** Numbers with more fraction digits than this get rounded. */
const MAX_DECIMALS = 3;

const formatNumber = (token: string) => {
  const fraction = token.match(/\.(\d+)/)?.[1] ?? "";
  if (fraction.length <= MAX_DECIMALS || /[eE]/.test(token)) return token;

  const rounded = String(Number(Number(token).toFixed(MAX_DECIMALS)));
  return rounded === "-0" ? "0" : rounded.replace(/^(-?)0\./, "$1.");
};

/**
 * Rounds the numbers in path data to `MAX_DECIMALS` places. Paths with
 * arcs are left alone: an arc whose chord is close to its diameter moves
 * its center by far more than the rounding, and arc flags may run
 * together. SVG lets adjacent numbers run together too (`1.5.5` is
 * `1.5 .5`), so a separator is added wherever a rounded number would
 * otherwise merge with the next one.
 */
export const roundPathData = (d: string) => {
  if (ARC_COMMAND_PATTERN.test(d)) return d;

  let output = "";
  let end = 0;
  let previous: string | undefined;

  for (const match of d.matchAll(SVG_NUMBER_PATTERN)) {
    const gap = d.slice(end, match.index);
    const token = formatNumber(match[0]);

    if (gap === "" && previous !== undefined && `${previous}${token}`.match(SVG_NUMBER_PATTERN)?.length !== 2) {
      output += " ";
    }

    output += gap + token;
    end = match.index + match[0].length;
    previous = token;
  }

  return output + d.slice(end);
};

type Node = Parameters<typeof toString>[0];

const roundNode = ({ attrs, content, ...node }: Node): Node => ({
  ...node,
  attrs: attrs?.d === undefined ? attrs : { ...attrs, d: roundPathData(attrs.d) },
  content: content?.map(roundNode),
});

export const renderContent = (descriptor: IconOutput["descriptor"]) =>
  (descriptor?.content ?? []).map((node) => toString(roundNode(node as Node))).join("");

export const template = ({ descriptor }: IconOutput, inner = renderContent(descriptor)) => `<script>
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
  ${inner}
</svg>`;

export const templateSvg = ({ moduleName, descriptor }: IconOutput, inner = renderContent(descriptor)) => {
  const isGlyph = GLYPH_SUFFIX_PATTERN.test(moduleName);
  const attrs = omitDuplicateSvgAttrs(descriptor?.attrs ?? {});

  const { width, height, ...rest } = attrs;
  const formatted = formatAttributes(
    isGlyph ? attrs : { ...rest, width: 16, height: 16 }
  );

  return compactSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" ${formatted} fill="currentColor" preserveAspectRatio="xMidYMid meet">${inner}</svg>`
  );
};
