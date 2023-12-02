# Contributing

## Getting Started

For MacOS, prerequisites include Node and Yarn.

Fork the repo and clone your fork:

```bash
git clone <YOUR_FORK>
cd carbon-icons-svelte
```

Set the original repo as the upstream:

```bash
git remote add upstream git@github.com:carbon-design-system/carbon-icons-svelte.git
# verify that the upstream is added
git remote -v
```

## Prerequisites

This repo uses `bun`. See the docs for [installation instructions](https://bun.sh/docs/installation).

## Workflow

### Building

Icons are generated using `bun` as a test runner.

Run `bun prepack` to build the library. Icons should be emitted to the `lib` folder and tests should pass.

## Submitting a Pull Request

### Sync Your Fork

Before submitting a pull request, make sure your fork is up to date with the latest upstream changes.

```bash
git fetch upstream
git checkout master
git merge upstream/master
```

### Submit a PR

After you've pushed your changes to remote, submit your PR. Make sure you are comparing `<YOUR_USER_ID>/feature` to `origin/master`.

## Maintainer guide

The following items only apply to project maintainers.

### Release

This library is published to NPM with [provenance](https://docs.npmjs.com/generating-provenance-statements) via a [GitHub workflow](https://github.com/carbon-design-system/carbon-icons-svelte/blob/master/.github/workflows/release.yml).

The workflow is automatically triggered when pushing a tag that begins with `v` (e.g., `v12.3.0`).

However, maintainers must perform a few things in preparation for a release.

```sh
# 1. Install and re-build the library.
yarn; yarn prepack;

# 2. Commit the changes using the new version as the commit message.
git commit -am "v12.3.0"

# 3. Create a tag.
git tag v12.3.0

# 4. Push the tag to the remote.
# This will trigger the `release.yml` workflow to publish a new package to NPM (with provenance).
git push origin v12.3.0
```

If all goes as expected, the [`release.yml` workflow](https://github.com/carbon-design-system/carbon-icons-svelte/actions/workflows/release.yml) should trigger a new run and publish the new version to NPM.

### Post-release checklist

After confirming that the new release is published to NPM, perform the following:

1. Create a [new release](https://github.com/carbon-design-system/carbon-icons-svelte/releases/new) on GitHub. Click "Generate release notes" to automatically list changes by commit with the relevant Pull Request and author metadata. You may manually remove notes that are not relevant to the release (e.g., CI changes).

2. Publish the release as the latest release.
