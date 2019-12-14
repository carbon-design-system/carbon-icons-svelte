# rollup

> Rollup example using [svelte-rollup-template](https://github.com/metonym/svelte-rollup-template).

## Getting Started

Install the project dependencies.

```bash
yarn install
```

## Available Scripts

### `yarn develop`

Runs the app in development mode with livereload enabled. Visit `http://localhost:3000` to view the app.

To configure the port number, modify the `port` value in [rollup.config.js](rollup.config.js#L48).

```diff
serve({
  contentBase: ['build'],
- port: 3000
+ port: 8080
})
```

### `yarn build`

Builds the app in production mode.
