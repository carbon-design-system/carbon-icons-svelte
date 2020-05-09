<script>
  import { Header, Search, CodeSnippet, Modal } from "carbon-components-svelte";
  import copy from "clipboard-copy";
  import { afterUpdate } from "svelte";
  import { match } from "fuzzy";

  let ref = undefined;

  afterUpdate(() => {
    document.querySelectorAll("svg[data-module-name]").forEach(item => {
      if (match(value, item.getAttribute("data-module-name")) == null) {
        item.style.display = "none";
      } else {
        item.style.display = "initial";
      }
    });

    if (node != null) {
      ref.innerHTML = "";
      ref.appendChild(node);
    }
  });

  $: node = null;
  $: value = "";
  $: moduleName = null;
  $: code = `
<script>
  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}";
<\/script>

<${moduleName} />`.trim();
</script>

<style>
  :global(body) {
    overflow-y: scroll;
  }

  :global(body.bx--body--with-modal-open) {
    overflow-y: scroll;
  }

  .bx--grid {
    margin-top: 5rem;
    margin-bottom: 2rem;
  }
</style>

<svelte:options immutable />
<svelte:body
  on:click={e => {
    if (e.target.tagName === 'svg' && e.target.getAttribute('data-module-name')) {
      node = e.target.cloneNode(true);
      moduleName = e.target.getAttribute('data-module-name');
    }
    if (e.target.parentNode.tagName === 'svg' && e.target.parentNode.getAttribute('data-module-name')) {
      node = e.target.parentNode.cloneNode(true);
      moduleName = e.target.parentNode.getAttribute('data-module-name');
    }
  }} />

<Header company="" platformName="Carbon Icons Svelte" />

<Modal passiveModal open={moduleName != null} modalHeading={moduleName}>
  <div bind:this={ref} />
  <CodeSnippet
    light
    type="multi"
    on:click={() => {
      copy(code);
    }}
    {code} />
</Modal>

<div class="bx--grid">
  <Search small bind:value />
</div>
