# carbon-icons-svelte

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

> Svelte components for icons in digital and software products using the Carbon Design System.

This library uses [@carbon/icons](https://github.com/carbon-design-system/carbon/tree/master/packages/icons) (v10.6.1) and [@carbon/icon-helpers](https://github.com/carbon-design-system/carbon/tree/master/packages/icon-helpers) (v10.4.0) to build [Carbon Design System iconography](https://www.carbondesignsystem.com/guidelines/icons/library) for [Svelte](https://github.com/sveltejs/svelte).

## Install

```bash
yarn add -D carbon-icons-svelte

# OR

npm install -D carbon-icons-svelte
```

## Usage

Supported icon sizes include `16`, `20`, `24` and `32`. Refer to the [Carbon icon library](https://www.carbondesignsystem.com/guidelines/icons/library) for supported icons.

```html
<script>
  import { Add16 } from 'carbon-icons-svelte';
</script>

<Add16 />
```

**Recommendation**: For faster compiling, import icons individually.

### Icon Import Path

```js
import Icon from 'carbon-icons-svelte/lib/<module-name>';
```

#### Example

```html
<script>
  import Add16 from 'carbon-icons-svelte/lib/Add16';
</script>

<Add16 />
```

## API

### Props

All props are optional.

| Name            | Type      | Default     |
| --------------- | --------- | ----------- |
| aria-label      | `string`  | `undefined` |
| aria-labelledby | `string`  | `undefined` |
| tabindex        | `string`  | `undefined` |
| focusable       | `boolean` | `false`     |
| title           | `string`  | `undefined` |
| class           | `string`  | `undefined` |
| style           | `string`  | `undefined` |

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

This library exports icons in the `ES` (ES module) format. Currently, the `UMD` format is not supported.

## [Examples](examples)

## [Changelog](CHANGELOG.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=blue
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
[build]: https://travis-ci.com/ibm/carbon-icons-svelte.svg?branch=master
[build-badge]: https://travis-ci.com/ibm/carbon-icons-svelte
[codecov]: https://codecov.io/gh/ibm/carbon-icons-svelte
[codecov-shield]: https://img.shields.io/codecov/c/github/ibm/carbon-icons-svelte.svg
