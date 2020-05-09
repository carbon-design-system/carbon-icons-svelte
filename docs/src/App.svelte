<script>
  import { Link, Search, CodeSnippet, Modal } from "carbon-components-svelte";
  import LogoGithub20 from "carbon-icons-svelte/lib/LogoGithub20";
  import copy from "clipboard-copy";
  import { afterUpdate } from "svelte";
  import { match } from "fuzzy";

  let ref = undefined;
  let yarn = "yarn add -D carbon-icons-svelte";
  let npm = "npm i -D carbon-icons-svelte";
  let shown = window.ICONS;

  afterUpdate(() => {
    shown = 0;

    document.querySelectorAll(".row svg[data-module-name]").forEach(item => {
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
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .version {
    font-size: 0.75rem;
  }

  .header {
    display: flex;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
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
      <h5>
        Carbon Icons Svelte
        <Link
          style="margin-left: 0.125rem; margin-right: .75rem;"
          href="https://yarnpkg.com/package/carbon-icons-svelte">
          <span class="version">v{window.VERSION}</span>
        </Link>
      </h5>
      <div>
        <Link href="https://github.com/IBM/carbon-icons-svelte">
          <LogoGithub20 />
        </Link>
      </div>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col-md-2">
      <p>
        This zero dependency icon library builds Carbon Design System SVG icons
        as Svelte components.
      </p>
    </div>
    <div class="bx--col">
      <p>
        Install:
        <CodeSnippet
          type="inline"
          code={yarn}
          on:click={() => {
            copy(yarn);
          }} />
        <span>or</span>
        <CodeSnippet
          type="inline"
          code={npm}
          on:click={() => {
            copy(npm);
          }} />
      </p>
    </div>
  </div>

  <Search
    autofocus
    style="margin-top: 1rem; margin-bottom: .75rem;"
    small
    bind:value />

  <div class="bx--row" style="margin-bottom: 3rem;">
    <div class="bx--col" style="font-size: .75rem;">
      Showing {shown} of {window.ICONS} icons
    </div>
  </div>
</div>
