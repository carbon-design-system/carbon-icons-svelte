# rollup-typescript

> This example was scaffolded from the official [Svelte TypeScript template](https://github.com/sveltejs/template).

Add the following fields in you `tsconfig.json` for autocompleting Carbon Icons:

```diff
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "include": ["src/**/*"],
+  "compilerOptions": {
+   "importsNotUsedAsValues": "remove",
+   "types": ["svelte", "carbon-icons-svelte"]
+  },
  "exclude": ["node_modules/*", "public/*"]
}
```

Assuming that you use VSCode and have the offical [Svelte VSCode extension](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-vscode) installed, you should experience some level of code completion for module imports and props.

## Available Scripts

### `yarn dev`

Runs the app in development mode.

### `yarn build`

Builds the app in production mode.

### `yarn start`

Serves the app locally. Run `yarn build` before `yarn start`.

### `yarn validate`

Runs `svelte-check`.
