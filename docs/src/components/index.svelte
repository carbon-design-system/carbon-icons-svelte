<script>
  // @ts-check
  /** @type {{ iconModuleNames?: string[]; byModuleName: Record<string, string>; bySize?: { order: string[]; sizes: Record<string, string>; }; total?: number; }} */
  import data from "../build-info.json";
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
    SelectSkeleton,
    LocalStorage,
  } from "carbon-components-svelte";
  import fuzzy from "fuzzy";
  import FocusKey from "svelte-focus-key";
  import Header from "./Header.svelte";

  const { match } = fuzzy;
  const sizes = {
    glyph: "Glyphs",
    icon: "Icons",
  };
  const GLYPH_SUFFIX_REGEX = /Glyph$/;
  const WHITESPACE_REGEX = /\s+/g;

  const allIcons = Object.values(data.bySize.sizes).flat();
  const allIconsSet = new Set(allIcons);
  const validIconNamesSet = new Set(Object.keys(data.byModuleName));

  let ref = null;
  let value = "";

  $: searchTerm = value.trim().replace(WHITESPACE_REGEX, "");
  // Search against iconModuleNames (includes Glyph variants for searchability)
  // but map all results to base names only, since those are what exist in bySize.sizes
  $: filteredModuleNamesSet =
    searchTerm === ""
      ? allIconsSet
      : new Set(
          data.iconModuleNames
            .filter((name) => match(searchTerm, name))
            .map((name) => {
              // Map Glyph variants to their base names
              if (name.endsWith("Glyph")) {
                return name.replace(GLYPH_SUFFIX_REGEX, "");
              }
              return name;
            })
            .filter((name) => validIconNamesSet.has(name))
        );

  $: filteredModuleNames = Array.from(filteredModuleNamesSet);

  /** @type {import("svelte").ComponentProps<Theme>["theme"]} */
  let theme = "white";
  let iconSize = 16;

  $: mounted = typeof document !== "undefined";
  $: if (mounted) {
    document.documentElement.style.setProperty(
      "color-scheme",
      ["white", "g10"].includes(theme) ? "light" : "dark"
    );
  }

  let moduleName = null;

  $: code = `<script>\n  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}.svelte";\n<\/script>\n\n<${moduleName}${
    iconSize === 16 ? "" : ` size={${iconSize}}`
  } />`;
  $: iconSizeClass = `icon-size--${iconSize}`;
</script>

<FocusKey element={ref} selectText />

<Header />

<Modal
  passiveModal
  open={moduleName != null}
  modalHeading={moduleName}
  on:transitionend={({ detail }) => {
    if (!detail.open) moduleName = null;
  }}
>
  <div class:icon-preview={true} class={iconSizeClass}>
    {@html data.byModuleName[moduleName]}
  </div>
  <CodeSnippet light type="multi" {code} />
</Modal>

<Content>
  <Grid padding>
    <Row>
      <Column>
        <div class="options">
          {#if mounted}
            <Theme
              bind:theme
              persist
              render="select"
              select={{
                id: "select-theme",
                labelText: "Carbon theme",
                themes: ["white", "g10", "g80", "g90", "g100"],
              }}
            />
            <LocalStorage key="icon-size" bind:value={iconSize} />
            <Select
              id="select-icon-size"
              labelText="Icon size"
              bind:selected={iconSize}
            >
              <SelectItem value={16} />
              <SelectItem value={20} />
              <SelectItem value={24} />
              <SelectItem value={32} />
            </Select>
          {:else}
            <SelectSkeleton class="select-skeleton" />
            <SelectSkeleton class="select-skeleton" />
          {/if}
          <Search
            id="search"
            size="lg"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
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
        {@const displayedIcons = new Set(
          allIcons.filter((name) => filteredModuleNamesSet.has(name))
        )}
        <span class="text-02">
          Showing
          {displayedIcons.size.toLocaleString()}
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
            <h4>{sizes[size]}</h4>
          </div>
          <div class:list={true} class={iconSizeClass}>
            {#each data.bySize.sizes[size] as name (name)}
              {@const isFiltered = filteredModuleNamesSet.has(name)}
              <button
                type="button"
                title={name}
                style:display={isFiltered ? "inline" : "none"}
                on:click={() => (moduleName = name)}
              >
                {@html data.byModuleName[name]}
              </button>
            {/each}
          </div>
        {/each}
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  :global(html) {
    scrollbar-gutter: stable;
  }
  
  :global(.bx--content) {
    padding: 0;
  }

  .options {
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-template-areas: "theme icon-size search";
    align-items: flex-end;
  }

  .options :global(#theme) {
    grid-area: theme;
  }

  .options :global(#icon-size) {
    grid-area: icon-size;
  }

  .options :global(.bx--search) {
    grid-area: search;
    border-left: 1px solid var(--cds-ui-03);
  }

  @media screen and (max-width: 672px) {
    .options {
      grid-template-areas:
        "theme icon-size"
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

  .icon-size--16 :global(svg) {
    width: 16px;
    height: 16px;
  }

  .icon-size--20 :global(svg) {
    width: 20px;
    height: 20px;
  }

  .icon-size--24 :global(svg) {
    width: 24px;
    height: 24px;
  }

  .icon-size--32 :global(svg) {
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

  :global(.select-skeleton) {
    position: relative;
    height: 64px;
    top: 2px;
    min-width: 6.42rem;
  }

  :global(#select-theme),
  :global(#select-icon-size) {
    min-width: 4rem;
  }

  :global(#select-icon-size) {
    border-left: 1px solid var(--cds-ui-03);
  }

  :global(.text-02) {
    color: var(--cds-text-02);
  }

  .icon-preview {
    margin-bottom: var(--cds-spacing-06);
  }
</style>
