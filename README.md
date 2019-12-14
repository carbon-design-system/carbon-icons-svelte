# carbon-icons-svelte

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

> Svelte components for icons in digital and software products using the Carbon Design System.

This library uses [@carbon/icons](https://github.com/carbon-design-system/carbon/tree/master/packages/icons) to build [Carbon Design System icons](https://www.carbondesignsystem.com/guidelines/icons/library) with zero dependencies.

## Install

```bash
yarn add -D carbon-icons-svelte
# OR
npm install -D carbon-icons-svelte
```

## Usage

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
import Icon from 'carbon-icons-svelte/lib/<module-name>';
```

Supported icon sizes include `16`, `20`, `24` and `32`. Refer to the [Carbon icon library](https://www.carbondesignsystem.com/guidelines/icons/library) for available icons.

## API

### Props

| Name            | Value                                     |
| --------------- | ----------------------------------------- |
| aria-label      | (optional) `string`                       |
| aria-labelledby | (optional) `string`                       |
| tabindex        | (optional) `string`                       |
| focusable       | (optional) `boolean` (Default is `false`) |
| title           | (optional) `string`                       |
| class           | (optional) `string`                       |
| style           | (optional) `string`                       |

You can pass a `title` as a prop or through the slot.

```html
<Add16 title="Add" />
<!-- OR -->
<Add16>
  <title>Add</title>
</Add16>
```

### Forwarded Events

Events can be forwarded to the icon.

```html
<script>
  import Add16 from 'carbon-icons-svelte/lib/Add16';
</script>

<Add16
  on:click="{() => {}}"
  on:mouseenter="{() => {}}"
  on:mouseover="{() => {}}"
  on:mouseleave="{() => {}}"
/>
```

## Limitations

Currently, the `UMD` format is not supported.

This library exports icons in the `ES` format; use a Webpack or Rollup set-up for consumption (see [examples](examples)).

## Examples

- [Webpack](examples/webpack)
- [Rollup](examples/rollup)

## [Changelog](CHANGELOG.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=blue
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
[build]: https://travis-ci.com/ibm/carbon-icons-svelte.svg?branch=master
[build-badge]: https://travis-ci.com/ibm/carbon-icons-svelte
[codecov]: https://codecov.io/gh/ibm/carbon-icons-svelte
[codecov-shield]: https://img.shields.io/codecov/c/github/ibm/carbon-icons-svelte.svg
