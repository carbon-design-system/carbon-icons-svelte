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
  import { Notification } from "carbon-icons-svelte/animated";
  import type { CarbonAnimatedIconProps } from "carbon-icons-svelte/animated";
  import AnimatedIcon from "carbon-icons-svelte/lib/animated/Checkmark.svelte";

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

  // Animated icons take the static props plus `play` and `trigger`.
  const animated_props = {
    size: 20,
    play: 1,
    trigger: "none",
  } satisfies CarbonAnimatedIconProps;

  // @ts-expect-error (`trigger` is "hover" or "none")
  new Notification({ target: document.body, props: { trigger: "click" } });
  // @ts-expect-error (`play` is a boolean or number)
  new AnimatedIcon({ target: document.body, props: { play: "yes" } });

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
<Notification play={true} trigger="hover" title="Notifications" />
<AnimatedIcon {...animated_props} />
<svelte:component this={Beta} />
