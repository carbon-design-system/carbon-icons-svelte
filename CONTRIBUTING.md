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

Install the project dependencies:

```bash
yarn install
```

## Workflow

### Building

Icons are generated using `vitest` as a test runner.

Run `yarn prepack` to build the library. Icons should be emitted to the `lib` folder and tests should pass.

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
