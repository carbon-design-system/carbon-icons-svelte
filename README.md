# carbon-icons-svelte

[![NPM][npm]][npm-url]
![npm downloads to date](https://img.shields.io/npm/dt/carbon-icons-svelte?color=262626&style=for-the-badge)

> [Carbon Design System](https://github.com/carbon-design-system) SVG icons as Svelte components.

This zero dependency icon library builds [Carbon Design System icons](https://www.carbondesignsystem.com/elements/icons/library) as Svelte components. Although best paired with [carbon-components-svelte](https://github.com/carbon-design-system/carbon-components-svelte), these icons can be consumed standalone.

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

By design, the Carbon Design System uses a scale of 16, 20, 24, and 32 pixels for icons. However, you can still pass any number for `size` (pixels).

The default size is `16`.

```svelte
<Add size={16} />
<Add size={20} />
<Add size={24} />
<Add size={32} />
```

## API

All props are optional.

| Name  | Type                                                        | Default value |
| :---- | :---------------------------------------------------------- | :------------ |
| size  | <code>16 &#124; 20 &#124; 24 &#124; 32 &#124; number</code> | `16`          |
| title | `string`                                                    | `undefined`   |

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

## Animated icons

Some icons have animated versions: `Add`, `Checkmark`, `ChevronRight`, `Copy`, `Download`, `Edit`, `Favorite`, `Light`, `Location`, `Locked`, `Notification`, `Renew`, `Search`, `Send`, `Settings`, `Star`, `Time`, `TrashCan`, `Upload`, `View`, `VolumeUp`, `WarningAlt` and `Wifi`. They take the same props as the static icons, plus `play`, `trigger` and `motion`.

```svelte
<script>
  import { Notification } from "carbon-icons-svelte/animated";
  // Or, import directly:
  // import Notification from "carbon-icons-svelte/lib/animated/Notification.svelte";
</script>

<button>
  <Notification /> Notifications
</button>
```

By default, an icon plays when the pointer enters it or the link, button, label or summary around it, or when that gets keyboard focus. Once started, the animation always runs to the end.

Use `play` to run it yourself. It plays each time `play` changes to a truthy value, so increment a number to replay it. Set `trigger="none"` to turn off hover and focus.

```svelte
<script>
  import { Checkmark } from "carbon-icons-svelte/animated";

  let saved = 0;
</script>

<button on:click={() => saved++}>
  <Checkmark play={saved} trigger="none" /> Save
</button>
```

`motion` picks one of Carbon's two motion styles. `"productive"` (the default) is short and subtle, for routine UI like toolbar buttons. `"expressive"` is larger and livelier, for moments that matter, like a new notification or a saved state. Both use Carbon's motion durations and easings.

```svelte
<script>
  import { Notification } from "carbon-icons-svelte/animated";

  export let unread = 0;
</script>

<Notification motion="expressive" play={unread} trigger="none" />
```

Animations don't run when the user has turned on reduced motion (`prefers-reduced-motion: reduce`).

| Name    | Type                                              | Default value  |
| :------ | :------------------------------------------------ | :------------- |
| play    | <code>boolean &#124; number</code>                | `false`        |
| trigger | <code>"hover" &#124; "none"</code>                | `"hover"`      |
| motion  | <code>"productive" &#124; "expressive"</code>     | `"productive"` |

## TypeScript

This library offers TypeScript support for Svelte 4 and Svelte 5.

For Svelte 3 compatibility, use [`carbon-icons-svelte@12.13.0`](https://github.com/carbon-design-system/carbon-icons-svelte/tree/v12.13.0).

For convenience, a `CarbonIconProps` type is exported from the library.

```svelte
<script lang="ts">
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import type { CarbonIconProps } from "carbon-icons-svelte";

  const props: CarbonIconProps = {
    size: 16,
    fill: "red",
    "data-test": "id",
  };
</script>

<Add {...props} />
```

Animated icons export `CarbonAnimatedIconProps` from `carbon-icons-svelte/animated`.

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=262626&style=for-the-badge
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
