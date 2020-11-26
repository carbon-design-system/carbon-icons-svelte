<script>
  import {
    Search,
    CodeSnippet,
    Modal,
    Grid,
    Row,
    Column,
    Content,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import copy from "clipboard-copy";
  import { onMount, afterUpdate } from "svelte";
  import { match } from "fuzzy";
  import Header from "./Header.svelte";

  const root = document.getElementById("svg-root");
  const dataAttribute = "data-svg-carbon-icon";

  let ref = null;
  let shown = window.ICONS;
  let node = null;
  let value = "";
  let moduleName = null;
  let theme = "g100";

  $: document.documentElement.setAttribute("theme", theme);

  onMount(() => {
    document.documentElement.setAttribute("mounted", true);
  });

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
  .flex {
    display: flex;
    align-items: flex-end;
    margin-bottom: var(--cds-layout-01);
  }

  :global(#select-theme) {
    width: 9rem;
  }
</style>

<Header />

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
  <div style="margin-bottom: var(--cds-layout-01);" bind:this={ref} />
  <CodeSnippet
    light
    type="multi"
    on:click={() => {
      copy(code);
    }}
    {code} />
</Modal>

<Content style="background: none; padding: var(--cds-spacing-06) 0;">
  <Grid>
    <Row>
      <Column>
        <div class="flex">
          <Select
            id="select-theme"
            size="xl"
            labelText="Carbon theme"
            bind:selected={theme}>
            <SelectItem value="white" text="White" />
            <SelectItem value="g10" text="Gray 10" />
            <SelectItem value="g90" text="Gray 90" />
            <SelectItem value="g100" text="Gray 100" />
          </Select>
          <Search
            style="border-left: 1px solid var(--cds-ui-03);"
            titleText="Search"
            labelText="Search"
            placeholder={`Search icons by name (e.g. "Add")`}
            bind:value />
        </div>
      </Column>
    </Row>

    <Row>
      <Column>
        <span style="color: var(--cds-text-02)">Showing
          {shown}
          of
          {window.ICONS}
          icons</span>
      </Column>
    </Row>
  </Grid>
</Content>
