<script lang="ts">
  import { Add16, BookmarkAdd16, BreakingChange16, Beta16 } from "../lib";
  import Icon from "../lib/Accessibility16";
  import IconSvelte from "../lib/Accessibility16/Accessibility16.svelte";

  const icon = new Icon({ target: document.body, props: { focusable: true } });

  $: console.log(icon.$$prop_def);
</script>

<Add16
  title="Title"
  fill="red"
  on:click={(e) => {
    console.log(e);
  }}
/>

<Icon title="Title" />

<BookmarkAdd16 />

<BreakingChange16 />

<svelte:component this={Beta16} />

<IconSvelte title="" />
