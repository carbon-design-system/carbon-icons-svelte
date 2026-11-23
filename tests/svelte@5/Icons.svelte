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
  import { Notification, setAnimatedIconDefaults } from "carbon-icons-svelte/animated";
  import type { CarbonAnimatedIconDefaults, CarbonAnimatedIconProps } from "carbon-icons-svelte/animated";
  import AnimatedIcon from "carbon-icons-svelte/lib/animated/Checkmark.svelte";
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

  // Props are type-checked for barrel and direct imports.
  // @ts-expect-error (`size` must be a number)
  mount(Add, { target: document.body, props: { size: "big" } });
  // @ts-expect-error (`size` must be a number)
  mount(Icon, { target: document.body, props: { size: "big" } });

  // Animated icons take the static props plus `play` and `trigger`.
  const animated_props = {
    size: 20,
    play: 1,
    trigger: "none",
    motion: "expressive",
    reducedMotion: "fade",
    hoverDelay: 0,
    loop: false,
  } satisfies CarbonAnimatedIconProps;

  // Defaults for icons below this component, like ones passed to an `icon` prop.
  const defaults = { motion: "expressive", hoverDelay: 200 } satisfies CarbonAnimatedIconDefaults;
  setAnimatedIconDefaults(defaults);
  // @ts-expect-error (`play` can't be a default)
  setAnimatedIconDefaults({ play: true });
  // @ts-expect-error (`loop` can't be a default)
  setAnimatedIconDefaults({ loop: true });

  // @ts-expect-error (`trigger` is "hover" or "none")
  mount(Notification, { target: document.body, props: { trigger: "click" } });
  // @ts-expect-error (`motion` is "productive" or "expressive")
  mount(Notification, { target: document.body, props: { motion: "playful" } });
  // @ts-expect-error (`reducedMotion` is "static", "fade" or "full")
  mount(Notification, { target: document.body, props: { reducedMotion: "always" } });
  // @ts-expect-error (`loop` is a boolean)
  mount(Notification, { target: document.body, props: { loop: "yes" } });
  // @ts-expect-error (`play` is a boolean or number)
  mount(AnimatedIcon, { target: document.body, props: { play: "yes" } });

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
<Notification play={true} trigger="hover" title="Notifications" />
<AnimatedIcon {...animated_props} />

<!--
Note that `svelte:component` is no longer needed in Svelte 5.
https://svelte.dev/docs/svelte/v5-migration-guide#Breaking-changes-in-runes-mode-svelte:component-is-no-longer-necessary 
-->
<svelte:component this={Beta} />
