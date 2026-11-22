import { $ } from "bun";

// Install a packed copy instead of `bun link`. Through a symlink, `lib/index.d.ts`
// resolves `svelte` from the repo root (Svelte 5), so the Svelte 4 project would
// never be checked against Svelte 4's types.
const tarball = "tests/carbon-icons-svelte.tgz";
await $`bun pm pack --ignore-scripts --quiet --filename ${tarball}`;

const dirs = (await $`find tests -mindepth 1 -maxdepth 1 -type d -name 'svelte@*'`.text())
  .split("\n")
  .filter(Boolean)
  .sort();

// The projects don't share anything, so check them at the same time. Each
// one's output is buffered and printed whole, so runs don't interleave.
const results = await Promise.all(
  dirs.map(async (dir) => {
    const target = `${dir}/node_modules/carbon-icons-svelte`;
    await $`bun install`.cwd(dir).quiet();
    await $`rm -rf ${target} && mkdir -p ${target}`.quiet();
    await $`tar -xzf ${tarball} -C ${target} --strip-components=1`.quiet();
    const { exitCode, stdout, stderr } = await $`bun run test:types`.cwd(dir).nothrow().quiet();
    console.log(`\n${dir}\n${stdout}${stderr}`);
    return { dir, exitCode };
  })
);

const failed = results.filter(({ exitCode }) => exitCode !== 0).map(({ dir }) => dir);

if (failed.length > 0) {
  console.error(`Type checks failed in ${failed.join(", ")}`);
  process.exit(1);
}
