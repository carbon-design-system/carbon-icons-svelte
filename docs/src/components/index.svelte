<script>
  import { onMount } from "svelte";
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
  import FocusKey from "./FocusKey.svelte";
  import Header from "./Header.svelte";

  /** @typedef {{ iconModuleNames?: string[]; byModuleName: Record<string, string>; bySize: { order: string[]; sizes: Record<string, string[]> }; total: number; renamedIcons?: Record<string, string> }} BuildInfo */

  /** @type {BuildInfo | null} */
  let data = null;

  onMount(async () => {
    const res = await fetch("/build-info.json");
    data = await res.json();
  });

  const { match } = fuzzy;
  const GLYPH_SUFFIX_REGEX = /Glyph$/;
  const WHITESPACE_REGEX = /\s+/g;
  const THEME_KEY = "theme";
  const VALID_THEMES = ["white", "g10", "g80", "g90", "g100"];
  const ICON_SIZE_KEY = "icon-size";
  const VALID_ICON_SIZES = [16, 20, 24, 32];

  /** @returns {import("svelte").ComponentProps<Theme>["theme"]} */
  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return stored && VALID_THEMES.includes(stored) ? stored : "white";
    } catch {
      return "white";
    }
  }

  /** @returns {(typeof VALID_ICON_SIZES)[number]} */
  function getStoredIconSize() {
    try {
      const stored = localStorage.getItem(ICON_SIZE_KEY);
      if (stored == null) return 16;

      let parsed = stored;
      try {
        parsed = JSON.parse(stored);
      } catch {
        parsed = Number(stored);
      }

      const size = typeof parsed === "number" ? parsed : Number(parsed);
      return VALID_ICON_SIZES.includes(size) ? size : 16;
    } catch {
      return 16;
    }
  }

  let ref = null;
  let value = "";

  $: searchTerm = value.trim().replace(WHITESPACE_REGEX, "");
  $: allIconsOrdered = data
    ? data.bySize.order
        .flatMap((size) => data.bySize.sizes[size])
        .sort((a, b) => a.localeCompare(b))
    : [];
  $: allIcons = data ? Object.values(data.bySize.sizes).flat() : [];
  $: allIconsSet = new Set(allIcons);
  $: aliasToCanonical = data?.renamedIcons ?? {};
  $: canonicalToAliases = (() => {
    /** @type {Record<string, string[]>} */
    const result = {};
    for (const [oldName, canonicalName] of Object.entries(aliasToCanonical)) {
      (result[canonicalName] ??= []).push(oldName);
    }
    return result;
  })();
  $: filteredModuleNamesSet =
    !data || searchTerm === ""
      ? allIconsSet
      : new Set(
          data.iconModuleNames
            .filter((name) => match(searchTerm, name))
            .map((name) => {
              if (aliasToCanonical[name]) {
                return aliasToCanonical[name];
              }

              // Map Glyph variants to their base names
              if (name.endsWith("Glyph")) {
                return name.replace(GLYPH_SUFFIX_REGEX, "");
              }
              return name;
            })
            .filter((name) => allIconsSet.has(name))
        );

  /** @type {import("svelte").ComponentProps<Theme>["theme"]} */
  let theme = getStoredTheme();
  let iconSize = getStoredIconSize();

  $: mounted = typeof document !== "undefined";

  let moduleName = null;

  $: code = `<script>\n  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}.svelte";\n<\/script>\n\n<${moduleName}${
    iconSize === 16 ? "" : ` size={${iconSize}}`
  } />`;
  $: iconSizeClass = `icon-size--${iconSize}`;
</script>

<FocusKey element={ref} selectText />

<Header />

{#if data}
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
{/if}

<Content>
  <Grid>
    <Row padding>
      <Column>
        <div class="options">
          {#if mounted}
            <Theme
              bind:theme
              persist
              persistKey={THEME_KEY}
              render="select"
              select={{
                id: "select-theme",
                labelText: "Carbon theme",
                themes: VALID_THEMES,
              }}
            />
            <LocalStorage key={ICON_SIZE_KEY} bind:value={iconSize} />
            <Select
              id="select-icon-size"
              labelText="Icon size"
              bind:selected={iconSize}
            >
              {#each VALID_ICON_SIZES as size (size)}
                <SelectItem value={size} />
              {/each}
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
            disabled={!data}
          />
        </div>
      </Column>
    </Row>
    {#if data}
      <Row padding>
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
          <div class:list={true} class={iconSizeClass}>
            {#each allIconsOrdered as name (name)}
              {@const isFiltered = filteredModuleNamesSet.has(name)}
              <button
                type="button"
                title={canonicalToAliases[name]
                  ? `${name} (aliases: ${canonicalToAliases[name].join(", ")})`
                  : name}
                style:display={isFiltered ? "inline" : "none"}
                on:click={() => (moduleName = name)}
              >
                {@html data.byModuleName[name]}
              </button>
            {/each}
          </div>
        </Column>
      </Row>
    {/if}
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
