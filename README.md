# carbon-icons-svelte

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

> Svelte components for icons in digital and software products using the Carbon Design System.

This library uses [@carbon/icons](https://github.com/carbon-design-system/carbon/tree/master/packages/icons) and [@carbon/icon-helpers](https://github.com/carbon-design-system/carbon/tree/master/packages/icon-helpers) to build [Carbon Design System icons](https://www.carbondesignsystem.com/guidelines/icons/library) with zero dependencies.

**Aligned Version**: `@carbon/icons@10.6.1`

## Install

```bash
yarn add -D carbon-icons-svelte
# OR
npm install -D carbon-icons-svelte
```

## Usage

Supported icon sizes include `16`, `20`, `24` and `32`.

Refer to the [Carbon icon library](https://www.carbondesignsystem.com/guidelines/icons/library) for available icons.

## Basic

```html
<script>
  import { Add16 } from 'carbon-icons-svelte';
</script>

<Add16 />
```

## Recommended Usage

For faster compiling, import icons individually.

```html
<script>
  import Add16 from 'carbon-icons-svelte/lib/Add16';
</script>

<Add16 />
```

### Import Path Pattern

```js
import Icon from 'carbon-icons-svelte/lib/<module-name>';
```

## API

### Props

All props are optional.

| Name            | Value                        |
| --------------- | ---------------------------- |
| aria-label      | `string`                     |
| aria-labelledby | `string`                     |
| tabindex        | `string`                     |
| focusable       | `boolean` (Default: `false`) |
| title           | `string`                     |
| class           | `string`                     |
| style           | `string`                     |

```html
<script>
  import Add16 from 'carbon-icons-svelte/lib/Add16';
</script>

<Add16 aria-label="Add" class="custom-class" style="will-change: transform;" />
```

You can pass a `title` as a prop or through the slot.

```html
<Add16 title="Add" />
<!-- OR -->
<Add16>
  <title>Add</title>
</Add16>
```

### Forwarded Events

The following events can be forwarded to the icon:

- `on:click`
- `on:mouseenter`
- `on:mouseover`
- `on:mouseleave`

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

This library exports icons in the `ES` (ES module) format; use a Webpack or Rollup set-up for consumption (see [examples](examples)).

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
