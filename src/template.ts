import { formatAttributes, IconContent, IconAttributes, toString, defaultAttributes } from '@carbon/icon-helpers';

function template({ attrs, content, moduleName }: { attrs: IconAttributes; content: IconContent; moduleName: string }) {
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
  ${formatAttributes(attrs)}
  class={className}
  preserveAspectRatio="${defaultAttributes.preserveAspectRatio}"
  {style}
  {id}
  {...attributes}>
  ${content.map(element => toString(element)).join('')}
  <slot>
    {#if title}
      <title>{title}</title>
    {/if}
  </slot>
</svg>`;
}

export { template };
