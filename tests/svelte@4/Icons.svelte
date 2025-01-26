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
  import { mount } from "svelte";

  // Use the exported `CarbonIconProps` type for typing objects since the 
  // idiomatic `ComponentProps` utility is not compatible with `Component` in Svelte 4.
  const props = {
    size: 32,
    fill: "red",
    "data-test": "id",
  } satisfies CarbonIconProps;

  // Instead, you can use a const assertion for type safety.
  const component_props = {
    size: 16,
    fill: "red",
    "data-test": "id",
  } as const;

  // @ts-expect-error (Svelte components are no longer classes)
  // See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes
  const icon_class = new Icon({ target: document.body, props });

  // Instead, use the `mount` function to manually instantiate the component.
  mount(Icon, { target: document.body, props: component_props });

  $: console.log(typeof Assembly);
</script>

<Add size={20} fill="red" title="title" data-test="id" />
<Icon style={null} />
<BookmarkAdd />
<BreakingChange />
<LogoSvelte />
<Plan />
<ZSystems />
<BatchJob />
<svelte:component this={Beta} />
