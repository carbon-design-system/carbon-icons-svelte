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
  import type { ComponentProps } from "svelte";

  // You can use the exported `CarbonIconProps` type.
  const props = {
    size: 32,
    fill: "red",
    "data-test": "id",
  } satisfies CarbonIconProps;

  // Or, you can use the idiomatic `ComponentProps` utility.
  const component_props = {
    size: 16,
    fill: "red",
    "data-test": "id",
  } satisfies ComponentProps<typeof Icon>;

  // @ts-expect-error (Svelte components are no longer classes)
  // See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes
  const icon_class = new Icon(props);

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

<!--
Note that `svelte:component` is no longer needed in Svelte 5.
https://svelte.dev/docs/svelte/v5-migration-guide#Breaking-changes-in-runes-mode-svelte:component-is-no-longer-necessary 
-->
<svelte:component this={Beta} />
