import {
  formatAttributes,
  getAttributes,
  IconContent,
  IIconAttrs,
  toString
} from '@carbon/icon-helpers';

const attributes = getAttributes();

function template({
  attrs,
  content,
  moduleName
}: {
  attrs: IIconAttrs;
  content: IconContent;
  moduleName: string;
}) {
  const markup = `<script>
  let className = undefined;
  export { className as class };
  export let id = undefined;
  export let tabindex = undefined;
  export let focusable = ${attributes.focusable};
  export let title = undefined;
  export let style = '${attributes.style}';

  const preserveAspectRatio = '${attributes.preserveAspectRatio}';
  $: ariaLabel = $$props['aria-label'];
  $: ariaLabelledBy = $$props['aria-labelledby'];
  $: labelled = ariaLabel || ariaLabelledBy || title;
  $: attributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': labelled ? undefined : true,
    role: labelled ? 'img' : undefined,
    focusable: tabindex ? true : focusable,
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
  on:focus
  on:blur
  ${formatAttributes(attrs)}
  class={className}
  {preserveAspectRatio}
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

  return markup;
}

export { template };
