<script>
  import {
    Link,
    Search,
    CodeSnippet,
    Modal,
    Grid,
    Row,
    Column,
    Content,
  } from "carbon-components-svelte";
  import copy from "clipboard-copy";
  import { afterUpdate } from "svelte";
  import { match } from "fuzzy";

  const yarn = "yarn add -D carbon-icons-svelte";
  const npm = "npm i -D carbon-icons-svelte";

  const root = document.getElementById("svg-root");
  const dataAttribute = "data-svg-carbon-icon";

  let ref = undefined;
  let shown = window.ICONS;
  let node = null;
  let value = "";
  let moduleName = null;

  afterUpdate(() => {
    shown = 0;

    root.querySelectorAll(`[${dataAttribute}]`).forEach((item) => {
      if (match(value, item.getAttribute(dataAttribute)) == null) {
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

  $: code = `
<script>
  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}";
<\/script>

<${moduleName} />`.trim();
</script>

<style>
  :global(.bx--row),
  :global(p) {
    margin-bottom: 1rem;
  }
</style>

<svelte:options immutable />

<svelte:body
  on:click={(e) => {
    if (e.target.tagName === 'svg' && e.target.getAttribute(dataAttribute)) {
      node = e.target.cloneNode(true);
      moduleName = e.target.getAttribute(dataAttribute);
    }
    if (e.target.parentNode.tagName === 'svg' && e.target.parentNode.getAttribute(dataAttribute)) {
      node = e.target.parentNode.cloneNode(true);
      moduleName = e.target.parentNode.getAttribute(dataAttribute);
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

<Content style="padding-left: 0; padding-right: 0;">
  <Grid>
    <Row>
      <Column class="header">
        <h5>
          Carbon Icons Svelte
          <Link
            style="margin-left: 0.125rem; margin-right: .75rem;"
            href="https://github.com/IBM/carbon-icons-svelte">
            <span class="version">v{window.VERSION}</span>
          </Link>
        </h5>
      </Column>
    </Row>

    <Row>
      <Column lg={4}>
        <p>
          This zero dependency icon library builds Carbon Design System SVG
          icons as Svelte components.
        </p>
      </Column>
      <Column>
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
      </Column>
    </Row>

    <Row>
      <Column>
        <Search
          autofocus
          placeholder={`Search icons by name (e.g. "Add")`}
          small
          bind:value />
      </Column>
    </Row>

    <Row>
      <Column>Showing {shown} of {window.ICONS} Icons</Column>
    </Row>
  </Grid>
</Content>
