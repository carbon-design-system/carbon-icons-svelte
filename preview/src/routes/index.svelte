<script context="module">
  import buildInfo from "../../build-info.json";

  export function load() {
    return { props: { data: buildInfo } };
  }
</script>

<script>
  /** @type {{ VERSION?:string; iconModuleNames?: string[]; byModuleName: Record<string, string>; bySize?: { order: string[]; sizes: Record<string, string>; }; total?: number; }} */
  export let data = {};

  import "carbon-components-svelte/css/all.css";
  import {
    Search,
    CodeSnippet,
    Modal,
    Grid,
    Row,
    Column,
    Content,
    Theme,
  } from "carbon-components-svelte";
  import fuzzy from "fuzzy";
  import Header from "$lib/Header.svelte";

  const { match } = fuzzy;

  let value = "";

  $: filteredModuleNames = data?.iconModuleNames.filter((name) =>
    match(value, name)
  );

  let theme = "white";

  $: if (typeof document !== "undefined") {
    document.documentElement.setAttribute("theme", theme);
  }

  let moduleName = null;

  $: code = `<script>\n  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}";\n<\/script>\n\n<${moduleName} />`;
</script>

<Header version={data?.VERSION} />

<Modal
  passiveModal
  open={moduleName != null}
  modalHeading={moduleName}
  on:transitionend={({ detail }) => {
    if (!detail.open) moduleName = null;
  }}
>
  <div style="margin-bottom: var(--cds-spacing-06);">
    {@html data?.byModuleName[moduleName]}
  </div>
  <CodeSnippet light type="multi" {code} />
</Modal>

<Content style="background: none; padding: 0;">
  <Grid padding>
    <Row>
      <Column>
        <div class="flex">
          <Theme
            bind:theme
            render="select"
            select={{
              id: "select-theme",
              size: "xl",
              labelText: "Carbon theme",
              themes: ["white", "g10", "g80", "g90", "g100"],
            }}
          />
          <Search
            style="border-left: 1px solid var(--cds-ui-03);"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            titleText="Search"
            labelText="Search"
            placeholder={`Search icons (e.g. "Add")`}
            bind:value
          />
        </div>
      </Column>
    </Row>

    <Row>
      <Column>
        <span class="text-02"
          >Showing
          {filteredModuleNames.length}
          of
          {data?.total}
          icons</span
        >
      </Column>
    </Row>
    <Row>
      <Column>
        {#each data?.bySize.order as size}
          <div class="divider" role="separator">
            <h4>{size}{size !== "glyph" ? "px" : ""}</h4>
          </div>
          <div style="margin-bottom: var(--cds-spacing-09)">
            {#each data?.bySize.sizes[size] as _moduleName}
              {#if filteredModuleNames.includes(_moduleName)}
                <button
                  type="button"
                  title={_moduleName}
                  on:click={() => (moduleName = _moduleName)}
                >
                  {@html data?.byModuleName[_moduleName]}
                </button>
              {/if}
            {/each}
          </div>
        {/each}
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  .flex {
    display: flex;
    align-items: flex-end;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 0;
    cursor: pointer;
    padding: var(--cds-spacing-03);
    color: inherit;
  }

  button:focus {
    outline-color: var(--cds-interactive-01);
  }

  .divider {
    margin-bottom: var(--cds-spacing-04);
    padding-bottom: var(--cds-spacing-04);
    border-bottom: 1px solid var(--cds-ui-03);
  }

  :global(#select-theme) {
    width: 8rem;
  }

  :global(.text-02) {
    color: var(--cds-text-02);
  }
</style>
