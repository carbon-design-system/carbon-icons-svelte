<script lang="ts">
  import {
    Add,
    Assembly,
    Beta,
    BookmarkAdd,
    BreakingChange,
    LogoSvelte,
    Plan,
    ZSystems,
    BatchJob,
  } from "carbon-icons-svelte";
  import type { CarbonIconProps } from "carbon-icons-svelte";
  import Icon from "carbon-icons-svelte/lib/Accessibility.svelte";

  const props = {
    size: 32,
    fill: "red",
    "data-test": "id",
  } satisfies CarbonIconProps;

  // Svelte 4 components are classes.
  const icon = new Icon({ target: document.body, props });
  icon.$destroy();

  // Props are type-checked for barrel and direct imports.
  // @ts-expect-error (`size` must be a number)
  new Add({ target: document.body, props: { size: "big" } });
  // @ts-expect-error (`size` must be a number)
  new Icon({ target: document.body, props: { size: "big" } });

  $: console.log(typeof Assembly);
</script>

<Add size={20} fill="red" title="title" data-test="id" />
<Icon style={null} on:click={() => {}} />
<BookmarkAdd />
<BreakingChange />
<LogoSvelte />
<Plan />
<ZSystems />
<BatchJob />
<svelte:component this={Beta} />
