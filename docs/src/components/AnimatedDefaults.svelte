<script>
  import { setAnimatedIconDefaults } from "carbon-icons-svelte/animated";

  /** @type {import("carbon-icons-svelte/animated").CarbonAnimatedIconDefaults} */
  export let defaults = {};

  setAnimatedIconDefaults(defaults);
</script>

<slot />
