# carbon-icons-svelte

[![NPM][npm]][npm-url]
[![Dependencies][deps]][deps-badge]
[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

> Svelte components for icons in digital and software products using the Carbon Design System.

This library uses [@carbon/icons](https://github.com/carbon-design-system/carbon/tree/master/packages/icons) to build [Carbon icons](https://www.carbondesignsystem.com/guidelines/icons/library) with zero dependencies.

## Getting Started

`carbon-icons-svelte` can be installed as a development dependency.

### Using Yarn

```bash
yarn add -D carbon-icons-svelte
```

### Using NPM

```bash
npm i -D carbon-icons-svelte
```

## Usage

Supported icon sizes include `16`, `20`, `24` and `32`. Refer to the [Icon Index](docs/ICON_INDEX.md) for a list of available icons.

### Basic

```html
<script>
  import { Add16 } from 'carbon-icons-svelte';
</script>

<Add16 />
```

### Recommended

For faster compiling, import icons individually.

```html
<script>
  import Add16 from 'carbon-icons-svelte/lib/Add16';
</script>

<Add16 />
```

#### Import Path Pattern

```js
import Icon from 'carbon-icons-svelte/lib/<IconModuleName>';
```

## API

### Props

| Name            | Value               |
| --------------- | ------------------- |
| aria-label      | `string` (optional) |
| aria-labelledby | `string` (optional) |
| tabindex        | `string` (optional) |
| title           | `string` (optional) |
| class           | `string` (optional) |
| style           | `string` (optional) |

### Recipes

#### Custom Class

```html
<style>
  :global(.custom-class) {
    outline: 1px solid #000;
  }
</style>

<Add16 class="custom-class" />
```

#### Labelled

```html
<Add16 aria-label="Add" />
```

#### Labelled with Focus

```html
<Add16 aria-label="Add" tabindex="0" />
```

#### Labelled by

```html
<label id="addFile">Add file</label>

<Add16 aria-labelledby="addFile" />
```

### Slot

`title` can be passed as a prop or through the slot.

```html
<Add16 title="Add" />

<!-- OR -->

<Add16>
  <title>Add</title>
</Add16>
```

### Forwarded Events

Event directives can be forwarded directly to the SVG element.

```html
<Add16
  on:click="{() => {}}"
  on:mouseenter="{() => {}}"
  on:mouseover="{() => {}}"
  on:mouseleave="{() => {}}"
/>
```

## Limitations

Currently, the `UMD` format is not supported.

This library exports icons in the `ES` format. Use Webpack or Rollup for application bundling (see [examples](examples)).

## Examples

- [Webpack](examples/webpack)
- [Rollup](examples/rollup)

## [Changelog](CHANGELOG.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=blue
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
[deps]: https://david-dm.org/ibm/carbon-icons-svelte/status.svg
[deps-badge]: https://david-dm.org/ibm/carbon-icons-svelte
[build]: https://travis-ci.com/ibm/carbon-icons-svelte.svg?branch=master
[build-badge]: https://travis-ci.com/ibm/carbon-icons-svelte
[codecov]: https://codecov.io/gh/ibm/carbon-icons-svelte
[codecov-shield]: https://img.shields.io/codecov/c/github/ibm/carbon-icons-svelte.svg
