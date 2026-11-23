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

Some icons have animated versions, in `carbon-icons-svelte/animated`. They take the same props as the static icons, plus the ones [below](#animated-icon-props). See them all, in Carbon components, on the [preview site](https://carbon-icons-svelte.onrender.com/#animated).

- **Hand-built**, with parts that move on their own: `Add`, `Checkmark`, `ChevronRight`, `Copy`, `Download`, `Edit`, `Favorite`, `Light`, `Location`, `Locked`, `Notification`, `Renew`, `RotateClockwise*`, `RotateCounterclockwise*`, `Search`, `Send`, `Settings`, `Star`, `Time`, `TrashCan`, `Upload`, `View`, `VolumeUp`, `WarningAlt` and `Wifi`.
- **Whole-icon motion**: arrows, carets, chevrons, paging, skip, undo and redo icons nudge the way they point, and `Recycle`, `RenewAlt`, `Repeat`, `Reset` and `Restart` turn. See [`src/animated/rules.ts`](src/animated/rules.ts) for the full list.

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

By default, an icon plays when a mouse rests on it, or on the link, button, label or summary around it, for 150ms, or when that gets keyboard focus. Sweeping the pointer across a toolbar plays nothing, and a tap on a touch screen doesn't count as hover. Once started, the animation runs to the end.

### Carbon components

Pass an animated icon wherever a [carbon-components-svelte](https://github.com/carbon-design-system/carbon-components-svelte) component takes an `icon`:

```svelte
<script>
  import { Button } from "carbon-components-svelte";
  import { Add, Notification } from "carbon-icons-svelte/animated";
</script>

<Button icon={Add}>Add item</Button>
<Button kind="ghost" icon={Notification} iconDescription="Notifications" />
```

An `icon` prop can't take props. Use `Button`'s `icon` slot to pass them, or set defaults for a whole area with `setAnimatedIconDefaults` in a parent component. Props on an icon win over defaults.

```svelte
<script>
  import { setAnimatedIconDefaults } from "carbon-icons-svelte/animated";

  setAnimatedIconDefaults({ motion: "expressive" });
</script>
```

### Play on an event

Use `play` to run the animation yourself. It plays each time `play` changes to a truthy value, so increment a number to replay it. Set `trigger="none"` to turn off hover and focus.

```svelte
<script>
  import { Button } from "carbon-components-svelte";
  import { Checkmark } from "carbon-icons-svelte/animated";

  let saved = 0;
</script>

<Button on:click={() => saved++}>
  Save
  <Checkmark slot="icon" class="bx--btn__icon" aria-hidden="true"
    play={saved} trigger="none" motion="expressive" />
</Button>
```

### Motion

`motion` picks one of Carbon's two motion styles. `"productive"` (the default) is one short, subtle move, for routine UI like toolbars and menus. `"expressive"` is larger and livelier, for moments that matter, like a saved state or a new notification. Both use Carbon's motion durations and easings.

### Reduced motion

By default, nothing plays for users who prefer reduced motion (`prefers-reduced-motion: reduce`). `reducedMotion` changes what they see:

- `"static"` (the default): nothing plays.
- `"fade"`: the icon dims and comes back, without moving. Use it to still acknowledge an event, like a save.
- `"full"`: the full motion plays anyway. Use it only when the motion itself is essential to understanding the change.

### Animated icon props

| Name          | Type                                                   | Default value  |
| :------------ | :----------------------------------------------------- | :------------- |
| play          | <code>boolean &#124; number</code>                     | `false`        |
| trigger       | <code>"hover" &#124; "none"</code>                     | `"hover"`      |
| motion        | <code>"productive" &#124; "expressive"</code>          | `"productive"` |
| reducedMotion | <code>"static" &#124; "fade" &#124; "full"</code>      | `"static"`     |
| hoverDelay    | `number` (ms)                                          | `150`          |

Every prop except `play` can also be set with `setAnimatedIconDefaults`.

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

Animated icons export `CarbonAnimatedIconProps` and `CarbonAnimatedIconDefaults` from `carbon-icons-svelte/animated`.

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## License

[Apache 2.0](LICENSE)

[npm]: https://img.shields.io/npm/v/carbon-icons-svelte.svg?color=262626&style=for-the-badge
[npm-url]: https://npmjs.com/package/carbon-icons-svelte
