# carbon-icons-svelte

[![NPM][npm]][npm-url]
![GitHub](https://img.shields.io/github/license/ibm/carbon-icons-svelte?color=262626&style=for-the-badge)
![npm downloads to date](https://img.shields.io/npm/dt/carbon-icons-svelte?color=262626&style=for-the-badge)
[![Build][build]][build-badge]

> [Carbon Design System](https://github.com/carbon-design-system) SVG icons as Svelte components.

This zero dependency icon library builds [Carbon Design System icons](https://www.carbondesignsystem.com/guidelines/icons/library) as Svelte components. Although best paired with [carbon-components-svelte](https://github.com/IBM/carbon-components-svelte), these icons can be consumed standalone.

Try it in the [Svelte REPL](https://svelte.dev/repl/931e6a3461434622adad0557579c0a29).

## [Preview](https://ibm.github.io/carbon-icons-svelte/) · [Icon Index](ICON_INDEX.md)

## Install

`carbon-icons-svelte` can be installed using `yarn` or `npm`.

```bash
yarn add -D carbon-icons-svelte
# OR
npm i -D carbon-icons-svelte
# OR
pnpm i -D carbon-icons-svelte
```

## Usage

Supported icon sizes include `16`, `20`, `24` and `32`. See the [Icon Index](ICON_INDEX.md) for a list of supported icons.

### Base Import

```svelte
<script>
  import { Add16 } from "carbon-icons-svelte";
</script>

<Add16 />
```

### Direct Import (recommended)

Import icons directly for faster compiling.

```js
import Add16 from "carbon-icons-svelte/lib/Add16";
// OR
import Add16 from "carbon-icons-svelte/lib/Add16/Add16.svelte";
```

**Note:** Even if using the base import method, an application bundler like Rollup or webpack should [treeshake](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) unused imports.

#### Import Path Pattern

```js
import Icon from "carbon-icons-svelte/lib/<ModuleName>";
```

Refer to the [Icon Index](ICON_INDEX.md) for a list of all icons by module name.

## API

### Props

All props are optional.

| Name            | Value                        |
| :-------------- | :--------------------------- |
| id              | `string`                     |
| aria-label      | `string`                     |
| aria-labelledby | `string`                     |
| tabindex        | `string`                     |
| title           | `string`                     |
| focusable       | `boolean` (default: `false`) |
| class           | `string`                     |
| style           | `string`                     |

#### `title` as a Slot

`title` can be passed as a prop or through the slot as an element.

```svelte
<Add16 title="Add" />
<!-- OR -->
<Add16>
  <title>Add</title>
</Add16>
```

### Forwarded Events

Event directives are forwarded directly to the SVG element.

```svelte
<Add16
  on:click="{() => {}}"
  on:mouseenter="{() => {}}"
  on:mouseover="{() => {}}"
  on:mouseleave="{() => {}}"
  on:keyup="{() => {}}"
  on:keydown="{() => {}}"
/>
```

### `data-carbon-icon` selector

Each icon embeds its module name in the `data-carbon-icon` selector for easier querying. This may be useful for automated testing in a headless browser.

```html
<svg data-carbon-icon="Add16">...</svg>
```

```js
// selects all carbon icons
document.querySelectorAll("[data-carbon-icon]");

// selects all `Add16` icons
document.querySelectorAll('[data-carbon-icon="Add16"]');
```

## Recipes

### Custom Fill Color

#### Using `class`

```svelte
<style>
  :global(svg.custom-class) {
    fill: blue;
  }
</style>

<Add16 class="custom-class" />
```

#### Using `style`

```svelte
<Add16 style="fill: blue" />
```

### Labelled

```svelte
<Add16 aria-label="Add" />
```

### Labelled with Focus

```svelte
<Add16 aria-label="Add" tabindex="0" />
```

### Labelled by

```svelte
<label id="addFile">Add file</label>

<Add16 aria-labelledby="addFile" />
```

## TypeScript support

Svelte version 3.31 or greater is required to use this library with TypeScript.

## Limitations

This library only ships `.svelte` files.

Refer to the [examples](examples) for sample set-ups.

## Examples

- [examples/webpack](examples/webpack) (Try it on [CodeSandbox](https://codesandbox.io/s/github/IBM/carbon-icons-svelte/tree/master/examples/webpack))
- [examples/rollup](examples/rollup) (Try it on [CodeSandbox](https://codesandbox.io/s/github/IBM/carbon-icons-svelte/tree/master/examples/rollup))
- [examples/rollup-typescript](examples/rollup-typescript)

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=262626&style=for-the-badge
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
[build]: https://img.shields.io/travis/com/ibm/carbon-icons-svelte?color=24a148&style=for-the-badge
[build-badge]: https://travis-ci.com/ibm/carbon-icons-svelte
