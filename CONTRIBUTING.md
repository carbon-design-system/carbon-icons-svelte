# Contributing

`carbon-icons-svelte` turns [Carbon Design System](https://www.carbondesignsystem.com/elements/icons/library) SVG icons into Svelte components. The build reads `@carbon/icons` metadata, writes one `.svelte` file per icon to `lib/`, and emits a barrel export plus TypeScript definitions.

[README.md](README.md) documents import paths, props, and TypeScript usage. This file documents how the repo is built and how to change it.

Not sure what to build? [File an issue](https://github.com/carbon-design-system/carbon-icons-svelte/issues) before opening a PR.

## Prerequisites

- [Bun](https://bun.sh/docs/installation). The pinned version is in [`.bun-version`](.bun-version). CI reads it.

Bun handles packages, tests, and builds. You don't need a separate Node toolchain. Run scripts with `bun <script>` and one-off binaries with `bunx <bin>`.

## Project set-up

Fork the repo and clone your fork:

```sh
git clone <YOUR_FORK>
cd carbon-icons-svelte
```

Set the original repository as upstream:

```sh
git remote add upstream git@github.com:carbon-design-system/carbon-icons-svelte.git
# verify that the upstream is added
git remote -v
```

Install dependencies:

```sh
bun install
```

## Scripts

| Script | What it does |
| --- | --- |
| `bun test` | Run all tests. [`prepack`](package.json) calls this, so it's also the full build. |
| `bun run prepack` | Same as `bun test`. Builds `lib/`, regenerates [`ICON_INDEX.md`](ICON_INDEX.md) and docs assets, runs snapshot and unit tests. |
| `bun run build:docs-assets` | Run `buildIcons()` only, no tests. Used by the docs site's `predev` / `prebuild` hooks. |
| `bun run test:types` | Link the local package and run `svelte-check` in [`tests/svelte@4/`](tests/svelte@4/) and [`tests/svelte@5/`](tests/svelte@5/). |

When iterating locally, scope test runs to what you changed. The full suite regenerates thousands of icon files and takes a while.

## How the build works

1. [`src/index.ts`](src/index.ts) imports `metadata.json` from the pinned `@carbon/icons` version in [`package.json`](package.json) `devDependencies`. It merges deprecated icons from older pinned packages and applies rename aliases (see [Backwards compatibility](#backwards-compatibility)).
2. Each icon in metadata can ship multiple size outputs (`Add16`, `Add20`, …). The build strips the size suffix and deduplicates to one Svelte component per icon name.
3. [`template.ts`](src/template.ts) turns an `IconOutput` descriptor into a Svelte component string: props, accessibility attributes, SVG markup. [`templateSvg`](src/template.ts) produces the compact inline SVG for the docs preview grid.
4. `buildIcons()` writes:
   - `lib/<IconName>.svelte`, one component per icon
   - `lib/<IconName>.svelte.d.ts`, per-icon type stub re-exporting from the barrel
   - `lib/index.js` and `lib/index.d.ts`, barrel export and `CarbonIconProps` type
   - [`ICON_INDEX.md`](ICON_INDEX.md), committed icon list
   - `docs/public/build-info.<hash>.json` and [`docs/src/generated/build-info-url.ts`](docs/src/generated/build-info-url.ts), hashed preview data for the docs site (gitignored, regenerated each build)

[`buildIcons()`](src/index.ts) is the only entry point. Tests call it directly. `prepack` runs those tests. `build:docs-assets` calls it for the docs app. [`src/global.d.ts`](src/global.d.ts) holds local type declarations for `@carbon/icons` metadata JSON imports.

`lib/` is gitignored. Only the generator source, snapshots, and [`ICON_INDEX.md`](ICON_INDEX.md) get committed.

## Backwards compatibility

`@carbon/icons` sometimes removes or renames icons between minor versions. We don't remove icons in minor releases of this library. [`src/index.ts`](src/index.ts) enforces that with two tables.

### Deprecated icons (upstream removal)

When Carbon drops an icon, add it to `DEPRECATED_ICONS` with the `@carbon/icons` version that still has it:

```ts
const DEPRECATED_ICONS: Record<string, MetadataSource> = {
  FoundationModel: metadata_11_31,
  // ...
};
```

Pin the source version as a separate devDependency alias (e.g. `"@carbon/icons-11.31": "npm:@carbon/icons@~11.31.0"`), import its `metadata.json`, and add a matching `declare module` in [`src/global.d.ts`](src/global.d.ts) if TypeScript complains. The build pulls matching icons from the older metadata so existing imports keep working.

### Renamed icons (upstream rename)

When Carbon renames an icon, map the old export name to the new one in `RENAMED_ICONS`:

```ts
const RENAMED_ICONS = {
  NavaidVordme: "NavaidVorDme",
  // ...
} as const;
```

The build then exports the old name from the barrel, writes an alias `.svelte` that forwards props to the new component (or re-exports directly when old and new names collide on case-insensitive filesystems; see `collidesOnCaseInsensitiveFs`), lists the alias in `ICON_INDEX.md` as `(alias of <newName>)`, and puts `renamedIcons` in the docs `build-info` payload.

Don't remove a `DEPRECATED_ICONS` or `RENAMED_ICONS` entry in a minor release. That's a breaking change. Save it for a major bump and note it in the changelog.

### Svelte version compatibility

Svelte 4 and 5 are supported in `13.x`. Type-check coverage lives in `tests/svelte@4/` and `tests/svelte@5/`.

For Svelte 3, pin [`carbon-icons-svelte@12.13.0`](https://github.com/carbon-design-system/carbon-icons-svelte/tree/v12.13.0). Template changes shouldn't break Svelte 4 barrel imports or `CarbonIconProps`.

## Conventions

No repo-wide linter. Match what's already in `src/` and `tests/`.

- [`tsconfig.json`](tsconfig.json) sets `strict: true`. Keep `src/` and `tests/` type-clean.
- Use `node:` import specifiers: `import { createHash } from "node:crypto"`, not `"crypto"`.
- ESM only. [`package.json`](package.json) has `"type": "module"`. Import JSON with `import … with { type: "json" }`.
- Hoist regexes to module scope as named `const` values with a short comment (`SIZE_PATTERN`, `GLYPH_SUFFIX_PATTERN` in [`src/index.ts`](src/index.ts)).
- Batch file writes with `Promise.all` in `buildIcons`, not sequential awaits.
- Don't hand-edit generated output. Never commit `lib/`, `docs/public/build-info*.json`, or `docs/src/generated/`. Change the generator and re-run `bun test`.
- A change to [`src/template.ts`](src/template.ts) changes every emitted icon. Treat it like a public API change.

## Testing

Tests use Bun. They live in `tests/`.

```sh
bun test                         # everything, includes full rebuild
bun test template                # filter by file-path substring
bun test tests/template.test.ts  # a single file
```

### Icon inventory snapshot

[`tests/index.test.ts`](tests/index.test.ts) calls `buildIcons()`, checks the total icon count, and snapshots the sorted export names in [`tests/__snapshots__/index.test.ts.snap`](tests/__snapshots__/index.test.ts.snap).

When icons are added or removed (including `RENAMED_ICONS` aliases), update the count:

```ts
expect(icons.length).toEqual(2689);
```

Run `bun test`. If the name list changed, read the snapshot diff before regenerating. Use `bun test --update-snapshots` on purpose. A snapshot diff is a behavior change.

### Template unit tests

[`tests/template.test.ts`](tests/template.test.ts) pins `template` and `templateSvg` for a few inputs: standard icon, glyph, empty content, missing descriptor fields. Add a case when you change template logic instead of relying on the full icon snapshot.

### Type checks

[`tests/test-types.ts`](tests/test-types.ts) (`bun run test:types`) runs `bun link` at the repo root, then installs and runs `svelte-check` in each `tests/svelte@*` project. Those projects import from the barrel, import `carbon-icons-svelte/lib/<Icon>.svelte` directly, use `CarbonIconProps`, and check `ComponentProps` on Svelte 5 vs `satisfies CarbonIconProps` on Svelte 4.

Run `bun run prepack` first so `lib/` exists, then `bun run test:types`. CI runs both.

## Upgrading `@carbon/icons`

Most releases are just a dependency bump for new Carbon icons.

1. Bump `devDependencies["@carbon/icons"]` in `package.json`.
2. `bun install`
3. Check what Carbon added, removed, or renamed. Grep the new `metadata.json` if you need to.
4. Handle removals and renames before building ([Backwards compatibility](#backwards-compatibility)).
5. `bun run prepack`
6. Update the icon count in [`tests/index.test.ts`](tests/index.test.ts) if the total changed.
7. Review [`ICON_INDEX.md`](ICON_INDEX.md), the snapshot, and any new alias files in `lib/` locally (`lib/` is not committed).
8. Commit with a conventional message (below).

### Before you push

CI runs this. Run it locally too:

```sh
bun install
bun run prepack      # build lib/, snapshot test, template tests
bun run test:types   # svelte-check against Svelte 4 and 5
```

All three must pass. If `prepack` fails on the icon count, the snapshot moved, or a rename alias target is missing, fix the generator or compatibility tables before updating snapshots.

### Open a pull request

Most PRs here are `@carbon/icons` bumps. A clean upgrade (no upstream removals or renames) is a small diff. See [#229](https://github.com/carbon-design-system/carbon-icons-svelte/pull/229) (11.81 → 11.82, net +2 icons).

**Branch.** Name it after the target version, e.g. `upgrade-11.82`.

**Commands.**

```sh
git fetch upstream
git checkout master
git merge upstream/master
git checkout -b upgrade-11.82

# edit package.json: bump devDependencies["@carbon/icons"]
bun install
bun run prepack
# if the count assertion fails, update tests/index.test.ts, then re-run
bun run test:types

git add package.json bun.lock ICON_INDEX.md tests/
git commit -m "feat(deps-dev): upgrade \`@carbon/icons\` 11.81 -> 11.82"
git push -u origin upgrade-11.82
```

**Files that should change** in a clean upgrade:

| File | What changed |
| --- | --- |
| [`package.json`](package.json) | `@carbon/icons` version in `devDependencies` |
| [`bun.lock`](bun.lock) | Lockfile from `bun install` |
| [`ICON_INDEX.md`](ICON_INDEX.md) | Regenerated list; header line updates the Carbon version and canonical icon count |
| [`tests/index.test.ts`](tests/index.test.ts) | `expect(icons.length)` matches the new total (includes rename aliases) |
| [`tests/__snapshots__/index.test.ts.snap`](tests/__snapshots__/index.test.ts.snap) | New or removed export names |

**Files that should not be committed:** `lib/` (gitignored build output), `docs/public/build-info*.json`, `docs/src/generated/`. `bun run prepack` writes them locally; CI and the docs deploy hook regenerate them.

**Title.** Match the commit:

```
feat(deps-dev): upgrade `@carbon/icons` 11.81 -> 11.82
```

**Body.** One bullet under **Features** is enough for a clean bump. Use the canonical count from the [`ICON_INDEX.md`](ICON_INDEX.md) header for the net delta:

```markdown
**Features**

- upgrade `@carbon/icons` to v11.82.0 (net +2 icons)
```

Compute net icons as new header count minus old (e.g. 2677 − 2675 = +2 in [#229](https://github.com/carbon-design-system/carbon-icons-svelte/pull/229)). If Carbon only changed existing SVGs and the count is unchanged, say so: `(no new icons)`.

**When it's not a clean upgrade.** If Carbon removed or renamed icons, don't ship only the version bump. Update `DEPRECATED_ICONS` or `RENAMED_ICONS` in [`src/index.ts`](src/index.ts) first ([Backwards compatibility](#backwards-compatibility)), then run the workflow above. Renames may also touch [`src/global.d.ts`](src/global.d.ts) or docs preview code. Those changes can live in the same PR as the bump or in a preceding PR (see [#227](https://github.com/carbon-design-system/carbon-icons-svelte/pull/227) for renames without a version bump).

**Changelog.** Contributors don't need to edit [`CHANGELOG.md`](CHANGELOG.md). Maintainers add the entry at release time.

**Review checklist.** Before requesting review, confirm locally:

1. `bun run prepack` passes (build, icon count, snapshot).
2. `bun run test:types` passes (Svelte 4 and 5).
3. The snapshot diff lists only the icons you expect from Carbon's release notes or metadata diff.
4. [`ICON_INDEX.md`](ICON_INDEX.md) header version matches `package.json`.

## Docs site

[`docs/`](docs/) is a Vite + Svelte app that previews every icon. Separate `package.json` and lockfile:

```sh
cd docs
bun install
bun dev
```

`predev` and `prebuild` call `bun run --cwd .. build:docs-assets` to regenerate preview data. The site loads `BUILD_INFO_URL`, a content-hashed JSON file, for the icon grid, search, and rename aliases. Icon-only dependency bumps usually don't need docs changes. Changes to `build-info` shape or preview behavior do.

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every PR and on pushes to `master`:

1. `bun ci`
2. `bun run prepack`
3. `bun run test:types`

Pushes to `master` also hit a Render deploy hook for the [preview site](https://carbon-icons-svelte.onrender.com).

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Common types: `fix`, `feat`, `docs`, `chore`, `test`, `ci`, `refactor`. Scope is the area touched: `deps-dev`, `docs`, `types`, `template`, or omit for repo-wide changes. Append `!` after the scope for breaking changes. One line, imperative mood. Put detail in the body; reference issues with `Fixes #N`.

Icon upgrades:

```
feat(deps-dev): upgrade `@carbon/icons` 11.81 -> 11.82
```

Removed or renamed upstream icons:

```
chore: account for renamed icons
```

Releases (maintainers):

```
v13.12.0
```

From the log:

```
fix(types): widen `size` prop to `number`
ci: use bun ci for reproducible builds
docs: hash build-info.json and remove from source control
```

## Submit a pull request

For `@carbon/icons` upgrades, follow [Open a pull request](#open-a-pull-request) above. That's the path you'll use most of the time.

For other changes, sync your fork, branch from `master`, and open a PR against `origin/master`:

```sh
git fetch upstream
git checkout master
git merge upstream/master
git checkout -b my-change
```

Keep PRs focused. Match the [commit message](#commit-messages) style.

## Maintainer guide

Maintainers only from here.

### Release

[`release.yml`](.github/workflows/release.yml) publishes to NPM with [provenance](https://docs.npmjs.com/generating-provenance-statements) when a `v*` tag is pushed. It installs, runs `bun run prepack`, prunes with `bunx culls --preserve=svelte`, and runs `npm publish --provenance --access public`.

Bump the version in `package.json`, update [`CHANGELOG.md`](CHANGELOG.md), then:

```sh
bun install
bun run prepack
git commit -am "v13.12.0"
git tag v13.12.0
git push origin v13.12.0
```

If the workflow succeeds, the new version is on NPM.

### Post-release checklist

After the package is on NPM:

1. Create a [new release](https://github.com/carbon-design-system/carbon-icons-svelte/releases/new) on GitHub. Click "Generate release notes", then drop CI-only noise.
2. Mark it as the latest release.
