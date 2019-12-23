import { formatAttributes, getAttributes, toString } from '@carbon/icon-helpers';
import { IconContent, IIconAttrs } from './buildIcons';

interface IAttributes {
  focusable: 'false';
  preserveAspectRatio: 'xMidYMid meet';
  style: 'will-change: transform;';
  width: undefined;
  height: undefined;
  viewBox: '0 0 undefined undefined';
  'aria-hidden': true;
}

const attributes: IAttributes = getAttributes();

function template({ attrs, content }: { attrs: IIconAttrs; content: IconContent }) {
  const markup = `<script>
  let className = undefined;
  export { className as class };
  export let id = undefined;
  export let tabindex = undefined;
  export let focusable = ${attributes.focusable};
  export let title = undefined;
  export let style = '${attributes.style}';

  const preserveAspectRatio = '${attributes.preserveAspectRatio}';
  const ariaLabel = $$props['aria-label'];
  const ariaLabelledBy = $$props['aria-labelledby'];
  const labelled = ariaLabel || ariaLabelledBy || title;
  const attributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': labelled ? undefined : true,
    role: labelled ? 'img' : undefined,
    focusable: tabindex ? true : focusable,
    tabindex
  };
</script>

<svg
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
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
