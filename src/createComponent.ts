import {
  formatAttributes,
  getAttributes,
  toString
} from '@carbon/icon-helpers';

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

type IconSize = 16 | 20 | 24 | 32;

interface IPath {
  elem: 'path';
  attrs: { d: string };
}

interface ICircle {
  elem: 'circle';
  attrs: { cx: string; cy: string; r: string };
}

interface IRect {
  elem: 'rect';
  attrs: { width: string; height: string; x: string; y: string; rx: string };
}

export type CarbonIconContent = ReadonlyArray<IPath | ICircle | IRect>;

export interface ICarbonIcon {
  elem: 'svg';
  attrs: {
    xmlns: 'http://www.w3.org/2000/svg';
    viewBox: string;
    width: IconSize;
    height: IconSize;
  };
  content: CarbonIconContent;
  name: string;
  size?: IconSize;
}

function createComponent(icon: ICarbonIcon) {
  const { name, size, attrs, content } = icon;

  const markup = `
    <script>
      let className = undefined;
      export { className as class };
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
      {...attributes}>
      ${content.map(element => toString(element)).join('')}
      <slot>
        {#if title}
          <title>{title}</title>
        {/if}
      </slot>
    </svg>
  `;

  return { name, size, markup };
}

export { createComponent };
