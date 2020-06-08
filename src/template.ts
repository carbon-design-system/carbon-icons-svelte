import {
  formatAttributes,
  toString,
  defaultAttributes,
} from "@carbon/icon-helpers";
import { IconOutput } from "@carbon/icons";

function template(output: IconOutput) {
  const { moduleName, descriptor } = output;

  return `<script>
  let className = undefined;
  export { className as class };
  export let id = undefined;
  export let tabindex = undefined;
  export let focusable = ${defaultAttributes.focusable};
  export let title = undefined;
  export let style = undefined;

  $: ariaLabel = $$props['aria-label'];
  $: ariaLabelledBy = $$props['aria-labelledby'];
  $: labelled = ariaLabel || ariaLabelledBy || title;
  $: attributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': labelled ? undefined : true,
    role: labelled ? 'img' : undefined,
    focusable: tabindex === '0' ? true : focusable,
    tabindex
  };
</script>

<svg
  data-carbon-icon="${moduleName}"
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:keyup
  on:keydown
  ${formatAttributes(descriptor.attrs)}
  class={className}
  preserveAspectRatio="${defaultAttributes.preserveAspectRatio}"
  {style}
  {id}
  {...attributes}>
  ${descriptor.content.map((element) => toString(element)).join("")}
  <slot>
    {#if title}
      <title>{title}</title>
    {/if}
  </slot>
</svg>`;
}

function templateSvg(output: IconOutput) {
  const { moduleName, descriptor } = output;

  return `<svg data-svg-carbon-icon="${moduleName}"
  ${formatAttributes(descriptor.attrs)}
  preserveAspectRatio="${defaultAttributes.preserveAspectRatio}">
  ${descriptor.content.map((element) => toString(element)).join("")}
</svg>`;
}

export { template, templateSvg };
