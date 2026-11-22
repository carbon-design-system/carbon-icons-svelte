import { $ } from "bun";

// Install a packed copy instead of `bun link`. Through a symlink, `lib/index.d.ts`
// resolves `svelte` from the repo root (Svelte 5), so the Svelte 4 project would
// never be checked against Svelte 4's types.
const tarball = "tests/carbon-icons-svelte.tgz";
await $`bun pm pack --ignore-scripts --quiet --filename ${tarball}`;

for await (const dir of $`find tests -maxdepth 1 -type d`.lines()) {
  if (dir && /svelte/.test(dir)) {
    const target = `${dir}/node_modules/carbon-icons-svelte`;
    await $`cd ${dir} && bun install`;
    await $`rm -rf ${target} && mkdir -p ${target}`;
    await $`tar -xzf ${tarball} -C ${target} --strip-components=1`;
    await $`cd ${dir} && bun run test:types`;
  }
}
