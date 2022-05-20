<script>
  /** @type {{ VERSION?: string; iconModuleNames?: string[]; byModuleName: Record<string, string>; bySize?: { order: string[]; sizes: Record<string, string>; }; total?: number; }} */
  import data from "../../build-info.json";
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
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import fuzzy from "fuzzy";
  import FocusKey from "svelte-focus-key";
  import Header from "$lib/Header.svelte";

  const { match } = fuzzy;

  let ref = null;
  let value = "";

  $: filteredModuleNames = data.iconModuleNames.filter((name) =>
    match(value, name)
  );

  let theme = "white";
  let previewSize = 16;

  $: if (typeof document !== "undefined") {
    document.documentElement.setAttribute("theme", theme);
  }

  let moduleName = null;

  $: code = `<script>\n  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}.svelte";\n<\/script>\n\n<${moduleName} />`;
</script>

<FocusKey element={ref} selectText />

<Header version={data.VERSION} />

<Modal
  passiveModal
  open={moduleName != null}
  modalHeading={moduleName}
  on:transitionend={({ detail }) => {
    if (!detail.open) moduleName = null;
  }}
>
  <div class={`modal-preview preview-size--${previewSize}`}>
    {@html data.byModuleName[moduleName]}
  </div>
  <CodeSnippet light type="multi" {code} />
</Modal>

<Content style="background: none; padding: 0;">
  <Grid padding>
    <Row>
      <Column>
        <div class="options">
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
          <Select
            id="select-preview-size"
            labelText="Preview size"
            size="xl"
            bind:selected={previewSize}
          >
            <SelectItem value={16}>16</SelectItem>
            <SelectItem value={20}>20</SelectItem>
            <SelectItem value={24}>24</SelectItem>
            <SelectItem value={32}>32</SelectItem>
          </Select>
          <Search
            id="search"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            titleText="Search"
            labelText="Search"
            placeholder={`Search icons (e.g. "Add")`}
            bind:ref
            bind:value
          />
        </div>
      </Column>
    </Row>

    <Row>
      <Column>
        <span class="text-02">
          Showing
          {filteredModuleNames.length.toLocaleString()}
          of
          {data.total.toLocaleString()}
          icons
        </span>
      </Column>
    </Row>
    <Row>
      <Column>
        {#each data.bySize.order as size (size)}
          <div class="divider" role="separator">
            <h4>{size}</h4>
          </div>
          <div class={`list preview-size--${previewSize}`}>
            {#each data.bySize.sizes[size] as name (name)}
              {#if filteredModuleNames.includes(name)}
                <button
                  type="button"
                  title={name}
                  on:click={() => (moduleName = name)}
                >
                  {@html data.byModuleName[name]}
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
  .options {
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-template-areas: "theme preview-size search";
    align-items: flex-end;
  }

  .options :global(#theme) {
    grid-area: theme;
  }

  .options :global(#preview-size) {
    grid-area: preview-size;
  }

  .options :global(.bx--search) {
    grid-area: search;
    border-left: 1px solid var(--cds-ui-03);
  }

  @media screen and (max-width: 672px) {
    .options {
      grid-template-areas:
        "theme preview-size"
        "search search";
      grid-template-columns: 1fr 1fr;
      row-gap: var(--cds-spacing-04);
    }

    .options :global(.bx--search) {
      border-left: none;
    }
  }

  .list {
    margin-bottom: var(--cds-spacing-09);
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

  .preview-size--16 :global(svg) {
    width: 16px;
    height: 16px;
  }

  .preview-size--20 :global(svg) {
    width: 20px;
    height: 20px;
  }

  .preview-size--24 :global(svg) {
    width: 24px;
    height: 24px;
  }

  .preview-size--32 :global(svg) {
    width: 32px;
    height: 32px;
  }

  .divider {
    margin-bottom: var(--cds-spacing-04);
    padding-bottom: var(--cds-spacing-04);
    border-bottom: 1px solid var(--cds-ui-03);
  }

  :global(body) {
    overflow-y: scroll;
  }

  :global(#select-theme),
  :global(#select-preview-size) {
    min-width: 8rem;
  }

  :global(#select-preview-size) {
    border-left: 1px solid var(--cds-ui-03);
  }

  :global(.text-02) {
    color: var(--cds-text-02);
  }

  .modal-preview {
    margin-bottom: var(--cds-spacing-06);
  }
</style>
