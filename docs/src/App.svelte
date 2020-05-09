<script>
  import { Link, Search, CodeSnippet, Modal } from "carbon-components-svelte";
  import LogoGithub32 from "carbon-icons-svelte/lib/LogoGithub32";
  import copy from "clipboard-copy";
  import { afterUpdate } from "svelte";
  import { match } from "fuzzy";

  let ref = undefined;
  let install = "yarn add -D carbon-icons-svelte";
  let shown = window.ICONS;

  afterUpdate(() => {
    shown = 0;

    document.querySelectorAll("svg[data-module-name]").forEach(item => {
      if (match(value, item.getAttribute("data-module-name")) == null) {
        item.style.display = "none";
      } else {
        shown += 1;
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
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .version {
    margin-left: 0.25rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1.5rem;
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
  <div class="bx--row">
    <div class="header bx--col">
      <h2>
        Carbon Icons Svelte
        <span class="version">
          <Link href="https://yarnpkg.com/package/carbon-icons-svelte">
            v{window.VERSION}
          </Link>
        </span>
      </h2>
      <div>
        <Link href="https://github.com/IBM/carbon-icons-svelte">
          <LogoGithub32 />
        </Link>
      </div>
    </div>

  </div>
  <div class="bx--row">
    <div class="bx--col-sm-1">
      <h4>Install</h4>
      <CodeSnippet
        code={install}
        on:click={() => {
          copy(install);
        }} />
    </div>
  </div>

  <Search
    autofocus
    style="margin-top: 3rem; margin-bottom: 1rem;"
    small
    bind:value />

  <div class="bx--row" style="margin-bottom: 3rem;">
    <div class="bx--col">Showing {shown} of {window.ICONS} icons</div>
  </div>
</div>
