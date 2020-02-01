# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [10.8.4](https://github.com/IBM/carbon-icons-svelte/releases/tag/v10.8.4) - 2020-02-01

- Bump `@carbon/icons` build dependency to 10.8.2

## [10.8.3](https://github.com/IBM/carbon-icons-svelte/releases/tag/v10.8.3) - 2020-01-27

- Bump `@carbon/icons` build dependency to 10.8.1

- Update documentation in README to include CodeSandbox examples

## [10.8.2](https://github.com/IBM/carbon-icons-svelte/releases/tag/v10.8.2) - 2019-12-30

- Fix focusring bug by removing `on:focus`, `on:blur` events
  ([#20](https://github.com/IBM/carbon-icons-svelte/issues/20))

- Use strict equality check for `tabindex` ('0') to override `focusable` prop

## [10.8.1](https://github.com/IBM/carbon-icons-svelte/releases/tag/v10.8.1) - 2019-12-29

- Forward `on:keyup`, `on:keydown`, `on:focus`, `on:blur` events
  ([#17](https://github.com/IBM/carbon-icons-svelte/issues/17))

- Mark constant assignments as reactive
  ([#18](https://github.com/IBM/carbon-icons-svelte/issues/18))

## [10.8.0](https://github.com/IBM/carbon-icons-svelte/releases/tag/v10.8.0) - 2019-12-22

- Upgrade @carbon/icons to 10.8.0
  ([#11](https://github.com/IBM/carbon-icons-svelte/issues/11))

- Support optional `id` prop
  ([#14](https://github.com/IBM/carbon-icons-svelte/issues/14))

- Add data selector to svg element for easier querying
  ([#15](https://github.com/IBM/carbon-icons-svelte/issues/1))

## [10.8.0-rc.0](https://github.com/IBM/carbon-icons-svelte/releases/tag/v10.8.0-rc.0) - 2019-12-14

- Upgrade @carbon/icons to 10.8.0-rc.0

- Use build-info.json from @carbon/icons to generate library and icon index
  ([#6](https://github.com/IBM/carbon-icons-svelte/issues/6))

## [1.0.1](https://github.com/IBM/carbon-icons-svelte/releases/tag/v1.0.1) - 2019-12-14

- Add rollup set-up to examples
  ([#3](https://github.com/IBM/carbon-icons-svelte/issues/3))

- Update documentation for usage, API, forwarded events
  ([#2](https://github.com/IBM/carbon-icons-svelte/issues/2))

## [1.0.0](https://github.com/IBM/carbon-icons-svelte/releases/tag/v1.0.0) - 2019-12-13

- Breaking changes: remove `width`, `height` props, change `focusable` prop from string to boolean

- Use `formatAttributes`, `toString` utilities from `@carbon/icon-helpers`
  ([#4](https://github.com/IBM/carbon-icons-svelte/issues/4))

## [0.1.0](https://github.com/IBM/carbon-icons-svelte/releases/tag/v0.1.0) - 2019-12-13

- Initial release (using `@carbon/icons@10.6.1`, `@carbon/icon-helpers@10.4.0`)
