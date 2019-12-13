# carbon-icons-svelte

[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

> Carbon Design System icons as Svelte components.

This library uses [@carbon/icons](https://github.com/carbon-design-system/carbon/tree/master/packages/icons) (v10.6.1) and [@carbon/icon-helpers](https://github.com/carbon-design-system/carbon/tree/master/packages/icon-helpers) (v10.4.0) to build [Carbon Design System iconography](https://www.carbondesignsystem.com/guidelines/icons/library) for [Svelte](https://github.com/sveltejs/svelte).

## Install

```bash
yarn add -D carbon-icons-svelte
# OR
npm install -D carbon-icons-svelte
```

## Usage

```html
<script>
  import { Add16 } from 'carbon-icons-svelte';
</script>

<Add16 />
```

For faster compile times, import icons individually:

```html
<script>
  import Add16 from 'carbon-icons-svelte/lib/Add16';
</script>

<Add16 />
```

## [Examples](examples)

## [Changelog](CHANGELOG.md)

## License

[Apache 2.0](LICENSE)

[build]: https://travis-ci.com/ibm/carbon-icons-svelte.svg?branch=master
[build-badge]: https://travis-ci.com/ibm/carbon-icons-svelte
[codecov]: https://codecov.io/gh/ibm/carbon-icons-svelte
[codecov-shield]: https://img.shields.io/codecov/c/github/ibm/carbon-icons-svelte.svg
