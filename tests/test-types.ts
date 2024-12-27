import { $ } from "bun";

await $`bun link`;

for await (const dir of $`find tests -maxdepth 1 -type d`.lines()) {
  if (dir && /svelte/.test(dir)) {
    await $`cd ${dir} && bun install`;
    await $`cd ${dir} && bun run test:types`;
  }
}
