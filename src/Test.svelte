<script lang="ts">
  import { Add16 } from "../lib";
  import Icon from "../lib/Accessibility16";
</script>

<Add16
  title="Title"
  fill="red"
  on:click={(e) => {
    console.log(e);
  }}
/>

<Icon title="Title" />
