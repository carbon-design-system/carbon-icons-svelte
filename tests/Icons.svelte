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
  } from "../lib";
  import type { CarbonIconProps } from "../lib";
  import Icon from "../lib/Accessibility.svelte";

  const props: CarbonIconProps = {
    size: 32,
    fill: "red",
  };

  const icon = new Icon({ target: document.body, props });

  $: console.log(icon.$$prop_def);
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
