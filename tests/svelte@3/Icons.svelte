<script lang="ts">
  import { Add, Beta } from "carbon-icons-svelte";
  import type { CarbonIconProps } from "carbon-icons-svelte";
  import Icon from "carbon-icons-svelte/lib/Accessibility.svelte";

  // Svelte 3's `svelte/elements` has no `data-*` index signature.
  const props = {
    size: 32,
    fill: "red",
    "data-test": "id",
  } satisfies CarbonIconProps;

  const icon = new Icon({ target: document.body, props });
  icon.$destroy();

  // Props are type-checked for barrel and direct imports.
  // @ts-expect-error (`size` must be a number)
  new Add({ target: document.body, props: { size: "big" } });
  // @ts-expect-error (`size` must be a number)
  new Icon({ target: document.body, props: { size: "big" } });
</script>

<Add size={20} fill="red" title="title" data-test="id" />
<Icon {...props} data-testid="icon" data-expanded={true} on:click={() => {}} />
<svelte:component this={Beta} />
