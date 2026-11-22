<script lang="ts">
  import { Add } from "carbon-icons-svelte";
  import Icon from "carbon-icons-svelte/lib/Accessibility.svelte";
  import Alias from "carbon-icons-svelte/lib/IbmQuantumSafeAdvisor.svelte";
  import { mount } from "svelte";

  // Deep imports must stay typed under `"moduleResolution": "NodeNext"`,
  // which doesn't allow directory imports like `"./"` in declarations.
  // @ts-expect-error (`size` must be a number)
  mount(Icon, { target: document.body, props: { size: "big" } });
  // @ts-expect-error (`size` must be a number)
  mount(Alias, { target: document.body, props: { size: "big" } });
  // @ts-expect-error (`size` must be a number)
  mount(Add, { target: document.body, props: { size: "big" } });
</script>

<Add size={20} />
<Icon size={20} fill="red" data-test="id" />
<Alias size={20} />
