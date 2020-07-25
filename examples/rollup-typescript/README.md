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
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"]
}
```

In version 10.14.1, [TypeScript definitions](../../types/index.d.ts) were added for `carbon-icons-svelte` in an attempt to stub the interface of Icon components.

Assuming that you use VSCode and have the offical [Svelte VSCode extension](https://github.com/sveltejs/language-tools/tree/master/packages/svelte-vscode) installed, you should experience some level of code completion for module imports and props.
