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
  // The Animated page and its 257 icons load only when someone opens it,
  // or once the Icons page is idle, so the first visit to either page is
  // smaller.
  const loadAnimated = () => import("./Animated.svelte");
  import { ALIASES_URL, BUILD_INFO_URL } from "../constants";
  import { FUZZY_RANK, indexAliases, normalize, rankAliases, rankName } from "../search.js";

  /** @typedef {{ byModuleName: Record<string, string>; bySize: { order: string[]; sizes: Record<string, string[]> }; total: number; renamedIcons?: Record<string, string> }} BuildInfo */

  /** @type {BuildInfo | null} */
  let data = null;

  onMount(() => {
    if (route !== "animated") (window.requestIdleCallback ?? setTimeout)(() => loadAnimated());
  });

  onMount(async () => {
    const res = await fetch(BUILD_INFO_URL);
    data = await res.json();
    // Search terms come after the icons render. Until then, search matches names.
    fetch(ALIASES_URL)
      .then((response) => response.json())
      .then((aliases) => (aliasIndex = indexAliases(aliases)))
      .catch(() => {});
  });

  const { match } = fuzzy;
  const GLYPH_SUFFIX_REGEX = /Glyph$/;
  const WHITESPACE_REGEX = /\s+/g;
  const THEME_KEY = "theme";
  const VALID_THEMES = ["white", "g10", "g80", "g90", "g100"];
  const ICON_SIZE_KEY = "icon-size";
  const VALID_ICON_SIZES = [16, 20, 24, 32];
  // Shared by the icon list and the animated gallery. 24 so detail, and
  // motion, are easy to see.
  const DEFAULT_ICON_SIZE = 24;

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
      if (stored == null) return DEFAULT_ICON_SIZE;

      let parsed = stored;
      try {
        parsed = JSON.parse(stored);
      } catch {
        parsed = Number(stored);
      }

      const size = typeof parsed === "number" ? parsed : Number(parsed);
      return VALID_ICON_SIZES.includes(size) ? size : DEFAULT_ICON_SIZE;
    } catch {
      return DEFAULT_ICON_SIZE;
    }
  }

  /** @returns {"icons" | "animated"} */
  const getRoute = () => (location.hash.startsWith("#animated") ? "animated" : "icons");

  let route = getRoute();

  let ref = null;
  let value = "";

  $: searchTerm = value.trim().replace(WHITESPACE_REGEX, "");
  $: aliasQuery = normalize(value);
  /** @type {Map<string, string[]>} */
  let aliasIndex = new Map();
  $: allIconsOrdered = data
    ? data.bySize.order
        .flatMap((size) => data.bySize.sizes[size])
        .sort((a, b) => a.localeCompare(b))
    : [];
  $: allIcons = data ? Object.values(data.bySize.sizes).flat() : [];
  $: allIconsSet = new Set(allIcons);
  $: aliasToCanonical = data?.renamedIcons ?? {};
  $: searchModuleNames = data
    ? [
        ...new Set([
          ...Object.keys(data.byModuleName),
          ...data.bySize.sizes.glyph.map((name) => `${name}Glyph`),
          ...Object.keys(aliasToCanonical),
        ]),
      ]
    : [];
  $: canonicalToAliases = (() => {
    /** @type {Record<string, string[]>} */
    const result = {};
    for (const [oldName, canonicalName] of Object.entries(aliasToCanonical)) {
      (result[canonicalName] ??= []).push(oldName);
    }
    return result;
  })();
  // Each matching icon's rank, best first (see `rankName`). Old names and
  // Glyph variants count toward the icon they belong to. Typo-tolerant
  // matching only runs when nothing else matches, since it matches any
  // letters in order, like "bell" in "BatteryFull".
  $: ranks = (() => {
    if (!data || aliasQuery === "") return null;
    /** @type {Map<string, number>} */
    const best = new Map();
    const consider = (name, rank) => {
      if (rank < 0 || !allIconsSet.has(name)) return;
      if (!best.has(name) || rank < best.get(name)) best.set(name, rank);
    };
    const canonical = (name) => aliasToCanonical[name] ?? name.replace(GLYPH_SUFFIX_REGEX, "");
    for (const name of searchModuleNames) consider(canonical(name), rankName(aliasQuery, name));
    for (const name of allIcons) consider(name, rankAliases(aliasQuery, aliasIndex.get(name)));
    if (best.size === 0) {
      for (const name of searchModuleNames) if (match(searchTerm, name)) consider(canonical(name), FUZZY_RANK);
    }
    return best;
  })();
  $: filteredModuleNamesSet = ranks ? new Set(ranks.keys()) : allIconsSet;

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

<svelte:window on:hashchange={() => (route = getRoute())} />

<FocusKey element={ref} selectText />

<Header {route} />

{#if mounted}
  <LocalStorage key={ICON_SIZE_KEY} bind:value={iconSize} />
{/if}

{#if route === "animated"}
  {#await loadAnimated() then { default: Animated }}
    <Animated bind:iconSize />
  {/await}
{:else}
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
            placeholder={`Search by name or keyword, like "heart"`}
            shortcut="mod+k"
            selectTextOnFocus
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
                style:order={ranks?.get(name)}
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
{/if}

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

  /* Flex so search results can be ordered by rank without moving any. */
  .list {
    display: flex;
    flex-wrap: wrap;
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
