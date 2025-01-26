# carbon-icons-svelte

[![NPM][npm]][npm-url]
![GitHub](https://img.shields.io/github/license/ibm/carbon-icons-svelte?color=262626&style=for-the-badge)
![npm downloads to date](https://img.shields.io/npm/dt/carbon-icons-svelte?color=262626&style=for-the-badge)

> [Carbon Design System](https://github.com/carbon-design-system) SVG icons as Svelte components.

This zero dependency icon library builds [Carbon Design System icons](https://www.carbondesignsystem.com/elements/icons/library) as Svelte components. Although best paired with [carbon-components-svelte](https://github.com/IBM/carbon-components-svelte), these icons can be consumed standalone.

Try it in the [Svelte REPL](https://svelte.dev/repl/931e6a3461434622adad0557579c0a29).

## [Preview](https://carbon-icons-svelte.onrender.com) · [Icon Index](ICON_INDEX.md)

## Installation

```sh
# npm
npm i carbon-icons-svelte

# pnpm
pnpm i carbon-icons-svelte

# Yarn
yarn add carbon-icons-svelte

# Bun
bun add carbon-icons-svelte
```

## Usage

### Direct Import

Import the icon from the `carbon-icons-svelte/lib` folder. See the [Icon Index](ICON_INDEX.md) for a list of supported icons.

```svelte
<script>
  import Add from "carbon-icons-svelte/lib/Add.svelte";
</script>

<Add />
```

### Base Import with Preprocessor

> [!TIP]
> Use [optimizeImports](https://github.com/carbon-design-system/carbon-preprocess-svelte#optimizeimports) from [carbon-preprocess-svelte](https://github.com/carbon-design-system/carbon-preprocess-svelte) to speed up development times.

Due to the size of the library, importing directly from the barrel file may result in slow development times, since the entire barrel file is imported (thousands of icons).

[optimizeImports](https://github.com/carbon-design-system/carbon-preprocess-svelte#optimizeimports) is a Svelte preprocessor that optimizes import paths from Carbon Svelte libraries. It enables you to use the barrel file import syntax without importing the entire library.

For example, the following is automatically re-written by `optimizeImports`:

```diff
- import { Add } from "carbon-icons-svelte";
+ import Add from "carbon-icons-svelte/lib/Add.svelte";
```

This offers the best of both worlds:

- Concise import syntax
- Fast development times (only the icons you need are imported)

### Custom size

Use the `size` prop to specify the icon size.

Supported icon sizes include `16`, `20`, `24`, and `32`.

The default size is `16`.

```svelte
<Add size={16} />
<Add size={20} />
<Add size={24} />
<Add size={32} />
```

## API

All props are optional.

| Name  | Type                                          | Default value |
| :---- | :-------------------------------------------- | :------------ |
| size  | <code>16 &#124; 20 &#124; 24 &#124; 32</code> | `16`          |
| title | `string`                                      | `undefined`   |

### Custom props

`$$restProps` are forwarded to the `svg` element.

You can use `fill` to customize the color or pass any other valid `svg` attribute to the component.

```svelte
<Add fill="red" class="icon" />
```

### Labelled

```svelte
<Add aria-label="Add" />
```

### Labelled by

```svelte
<label id="add-file">Add file</label>
<Add aria-labelledby="add-file" />
```

### Focusable

```svelte
<Add aria-label="Add" tabindex={0} />
```

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=262626&style=for-the-badge
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
