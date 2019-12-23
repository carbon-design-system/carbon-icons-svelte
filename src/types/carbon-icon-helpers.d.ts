declare module '@carbon/icon-helpers' {
  export type IconSize = 16 | 20 | 24 | 32;

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

  export type IconContent = ReadonlyArray<IPath | ICircle | IRect>;

  export interface IIconAttrs {
    xmlns: 'http://www.w3.org/2000/svg';
    viewBox: string;
    width: IconSize;
    height: IconSize;
  }

  interface IAttributes {
    focusable: 'false';
    preserveAspectRatio: 'xMidYMid meet';
    style: 'will-change: transform;';
    width: undefined;
    height: undefined;
    viewBox: '0 0 undefined undefined';
    'aria-hidden': true;
  }

  export function formatAttributes(attributes: IIconAttrs): string;
  export function getAttributes(): IAttributes;
  export function toString(element: IPath | ICircle | IRect): string;
}
