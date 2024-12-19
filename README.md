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

### Basic

Import the icon from the `carbon-icons-svelte/lib` folder. See the [Icon Index](ICON_INDEX.md) for a list of supported icons.

```svelte
<script>
  import Add from "carbon-icons-svelte/lib/Add.svelte";
</script>

<Add />
```

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

### Labelled icon that is focusable

```svelte
<Add aria-label="Add" tabindex="0" />
```

### Labelled by

```svelte
<label id="add-file">Add file</label>

<Add aria-labelledby="add-file" />
```

## API

### Props

All props are optional.

| Name  | Type                                          | Default value |
| :---- | :-------------------------------------------- | :------------ |
| size  | <code>16 &#124; 20 &#124; 24 &#124; 32</code> | `16`          |
| title | `string`                                      | `undefined`   |

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=262626&style=for-the-badge
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
