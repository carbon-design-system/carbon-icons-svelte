<script>
  import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ContentSwitcher,
    CssColumn,
    CssGrid,
    Dropdown,
    EmptyState,
    IconIndicator,
    Layer,
    Link,
    OverflowMenu,
    OverflowMenuItem,
    Popover,
    Prose,
    Search as SearchInput,
    SidePanel,
    SkeletonPlaceholder,
    Switch,
    Tab,
    TableOfContents,
    TableOfContentsItem,
    Tabs,
    Tag,
    Theme,
    TextInput,
    Toggle,
    TooltipIcon,
  } from "carbon-components-svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import ArrowRight from "carbon-icons-svelte/lib/ArrowRight.svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import CodeIcon from "carbon-icons-svelte/lib/Code.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import Download from "carbon-icons-svelte/lib/Download.svelte";
  import Information from "carbon-icons-svelte/lib/Information.svelte";
  import Pin from "carbon-icons-svelte/lib/Pin.svelte";
  import PinFilled from "carbon-icons-svelte/lib/PinFilled.svelte";
  import TextFont from "carbon-icons-svelte/lib/TextFont.svelte";
  import Notification from "carbon-icons-svelte/lib/Notification.svelte";
  import Settings from "carbon-icons-svelte/lib/Settings.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  // Each from its own file: importing from carbon-icons-svelte/animated would
  // pull all of its icons into this page's bundle, since the Animated page
  // loads them all.
  import AnimatedAdd from "carbon-icons-svelte/lib/animated/Add.svelte";
  import AnimatedCheckmark from "carbon-icons-svelte/lib/animated/Checkmark.svelte";
  import AnimatedChevronLeft from "carbon-icons-svelte/lib/animated/ChevronLeft.svelte";
  import AnimatedChevronRight from "carbon-icons-svelte/lib/animated/ChevronRight.svelte";
  import AnimatedCode from "carbon-icons-svelte/lib/animated/Code.svelte";
  import AnimatedDashboard from "carbon-icons-svelte/lib/animated/Dashboard.svelte";
  import AnimatedEdit from "carbon-icons-svelte/lib/animated/Edit.svelte";
  import AnimatedIdea from "carbon-icons-svelte/lib/animated/Idea.svelte";
  import AnimatedLink from "carbon-icons-svelte/lib/animated/Link.svelte";
  import AnimatedRenew from "carbon-icons-svelte/lib/animated/Renew.svelte";
  import AnimatedSettings from "carbon-icons-svelte/lib/animated/Settings.svelte";
  import AnimatedStar from "carbon-icons-svelte/lib/animated/Star.svelte";
  import AnimatedTag from "carbon-icons-svelte/lib/animated/Tag.svelte";
  import AnimatedViewOff from "carbon-icons-svelte/lib/animated/ViewOff.svelte";
  import AnimatedZoomIn from "carbon-icons-svelte/lib/animated/ZoomIn.svelte";
  import fuzzy from "fuzzy";
  import { onMount, tick } from "svelte";
  import { fitToolbar, focusInPlace, revealResults, revealTile, rovingFocus, scrollToHash, watchStuck } from "../gallery.js";
  import { pageLinks } from "../page-links.js";
  import { FUZZY_RANK, normalize, rankAliases, rankName } from "../search.js";
  import Code from "./Code.svelte";
  import CompareTray from "./CompareTray.svelte";
  import FocusKey from "./FocusKey.svelte";
  import PixelGrid from "./PixelGrid.svelte";
  import ThemeMatrix from "./ThemeMatrix.svelte";
  import TileActions from "./TileActions.svelte";

  /**
   * @typedef {{ name: string, icons: string[] }} Subcategory
   * @typedef {{ category: string, subcategories: Subcategory[] }} Group
   * @typedef {{ byModuleName: Record<string, string>, bySize: { order: string[], sizes: Record<string, string[]> }, total: number, groups: Group[], version: string, renamedIcons?: Record<string, string> }} BuildInfo
   */

  /** @type {BuildInfo | null} */
  export let data = null;
  /** Carbon's search terms for each icon, as written and as indexed. */
  export let aliasTerms = {};
  /** @type {Map<string, string[]>} */
  export let aliasIndex = new Map();
  /** Icons that also have an animated version. */
  /** @type {Set<string>} */
  export let animatedNames = new Set();
  /** The icon size picked on either page, saved by the parent. */
  export let iconSize = 24;

  const iconSizes = [16, 20, 24, 32];
  const themes = ["white", "g10", "g80", "g90", "g100"];
  const themeNames = { white: "White", g10: "Gray 10", g80: "Gray 80", g90: "Gray 90", g100: "Gray 100" };
  let theme = "white";

  const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const categoryId = (category) => `icons-${slug(category)}`;
  const subcategoryId = (category, subcategory) => `icons-${slug(category)}-${slug(subcategory)}`;

  // Each section's link carries an animated icon, which plays on hover.
  const sections = [
    ["icons-gallery", "Icons", AnimatedStar],
    ["icons-usage", "Usage", AnimatedCode],
    ["icons-sizes", "Sizes", AnimatedZoomIn],
    ["icons-carbon", "In Carbon components", AnimatedAdd],
    ["icons-styling", "Color and styling", AnimatedEdit],
    ["icons-accessibility", "Accessibility", AnimatedViewOff],
    ["icons-renamed", "Renamed icons", AnimatedTag],
    ["icons-performance", "Performance", AnimatedDashboard],
    ["icons-props", "Props", AnimatedSettings],
    ["icons-animated", "Animated icons", AnimatedRenew],
  ];

  // ---- Search ----

  const { match } = fuzzy;
  const GLYPH_SUFFIX = /Glyph$/;
  let query = "";
  /** The search field, which "/" and Cmd+K focus. */
  let searchInput = null;

  $: queryKey = normalize(query);
  $: allIcons = data ? data.groups.flatMap((group) => group.subcategories.flatMap((sub) => sub.icons)) : [];
  $: allIconsSet = new Set(allIcons);
  $: aliasToCanonical = data?.renamedIcons ?? {};
  $: canonicalToAliases = Object.entries(aliasToCanonical).reduce((result, [oldName, name]) => {
    (result[name] ??= []).push(oldName);
    return result;
  }, /** @type {Record<string, string[]>} */ ({}));
  // Names a query can match: each icon, its Glyph variant and its old names.
  $: searchNames = data
    ? [...new Set([...allIcons, ...data.bySize.sizes.glyph.map((name) => `${name}Glyph`), ...Object.keys(aliasToCanonical)])]
    : [];

  // Each matching icon's rank, best first (see `rankName`). Old names and
  // Glyph variants count toward the icon they belong to. Typo-tolerant
  // matching only runs when nothing else matches, since it matches any
  // letters in order, like "bell" in "BatteryFull".
  $: ranks = (() => {
    if (!data || queryKey === "") return null;
    /** @type {Map<string, number>} */
    const best = new Map();
    const consider = (name, rank) => {
      if (rank < 0 || !allIconsSet.has(name)) return;
      if (!best.has(name) || rank < best.get(name)) best.set(name, rank);
    };
    const canonical = (name) => aliasToCanonical[name] ?? name.replace(GLYPH_SUFFIX, "");
    for (const name of searchNames) consider(canonical(name), rankName(queryKey, name));
    for (const name of allIcons) consider(name, rankAliases(queryKey, aliasIndex.get(name)));
    if (best.size === 0) {
      const term = query.trim().replace(/\s+/g, "");
      for (const name of searchNames) if (match(term, name)) consider(canonical(name), FUZZY_RANK);
    }
    return best;
  })();
  // Only icons with an animated version, with or without a search.
  let animatedOnly = false;
  // What the gallery shows: the search's ranks, narrowed to animated icons
  // when that's on. null when nothing is filtered.
  $: filter = animatedOnly
    ? new Map((ranks ? [...ranks] : allIcons.map((name) => [name, 0])).filter(([name]) => animatedNames.has(name)))
    : ranks;
  $: count = (icons) => (filter ? icons.filter((name) => filter.has(name)).length : icons.length);
  $: matches = filter ? filter.size : allIcons.length;

  // ---- Tiles ----

  // The gallery's ~2,800 tiles are static HTML, one string per subcategory,
  // rather than a component each: that keeps the page as quick to load and
  // to search as the plain icon grid it replaced. Clicks are handled once,
  // on the gallery, and a search updates the tiles directly.
  const escapeHtml = (text) =>
    text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  // Carbon's caution-minor IconIndicator, as static HTML for the tiles: the
  // WarningAltFilled icon with the indicator's classes, which color it.
  $: deprecatedIndicator = data
    ? `<span class="bx--icon-indicator bx--icon-indicator--hide-label tile-status">${data.byModuleName.WarningAltFilled.replace(
        "<svg ",
        '<svg class="bx--icon-indicator--caution-minor" aria-hidden="true" '
      )}<span class="bx--visually-hidden">, deprecated</span></span>`
    : "";

  // A line break may fall between the words of a name: "BottomPanel<wbr>Close".
  const nameHtml = (name) => name.split(/(?=[A-Z_])/).map(escapeHtml).join("<wbr>");
  $: tiles = (names) =>
    names
      .map((name) => {
        const formerly = canonicalToAliases[name];
        return `<button type="button" tabindex="-1" data-icon="${name}"${
          formerly ? ` title="${escapeHtml(`${name}, formerly ${formerly.join(", ")}`)}"` : ""
        }><span class="tile-icon">${data.byModuleName[name]}</span><span class="tile-name">${nameHtml(name)}</span>${
          // After the name, so a screen reader hears "Watson, deprecated".
          data.deprecated?.[name] !== undefined ? deprecatedIndicator : ""
        }</button>`;
      })
      .join("");

  /**
   * Shows, hides and ranks the tiles for a search.
   * @param {HTMLElement} node
   * @param {Map<string, number> | null} ranks
   */
  function filterTiles(node, ranks) {
    let filtered = false;
    // What each tile shows now, so a keystroke only touches the tiles that
    // change: rewriting every tile's style makes the browser restyle them all.
    /** @type {WeakMap<HTMLElement, { shown: boolean, order: string }>} */
    const state = new WeakMap();
    const apply = (ranks) => {
      // Nothing to undo when there was no search and still isn't.
      if (!ranks && !filtered) return;
      filtered = Boolean(ranks);
      for (const tile of node.querySelectorAll("button[data-icon]")) {
        const name = tile.dataset.icon;
        const shown = !ranks || ranks.has(name);
        const order = ranks?.has(name) ? String(ranks.get(name)) : "";
        const before = state.get(tile) ?? { shown: true, order: "" };
        if (before.shown !== shown) tile.style.display = shown ? "" : "none";
        if (before.order !== order) tile.style.order = order;
        state.set(tile, { shown, order });
      }
    };
    apply(ranks);
    return { update: apply };
  }

  // Announce the number of matches once typing pauses, so a screen reader
  // isn't interrupted on every keystroke.
  let searchStatus = "";
  let statusTimer;
  $: {
    clearTimeout(statusTimer);
    const text = queryKey
      ? matches === 0
        ? `No icons match ${query.trim()}${animatedOnly ? " with an animated version" : ""}`
        : `${matches.toLocaleString()} ${matches === 1 ? "icon matches" : "icons match"} ${query.trim()}`
      : "";
    statusTimer = setTimeout(() => (searchStatus = text), 500);
  }

  // ---- Toolbar and results ----

  let toolbarStuck = false;
  let compactToolbar = typeof matchMedia !== "undefined" && matchMedia("(max-width: 65.98rem)").matches;
  let optionsOpen = false;
  const setCompact = (compact) => {
    compactToolbar = compact;
    if (!compact) optionsOpen = false;
  };

  let toolbarElement = null;
  let groupsElement = null;
  let emptyElement = null;
  let lastQuery;
  $: {
    const key = `${queryKey}|${animatedOnly}`;
    if (lastQuery !== undefined && key !== lastQuery) {
      tick().then(() => revealResults(emptyElement ?? groupsElement, toolbarElement, !compactToolbar));
    }
    lastQuery = key;
  }

  // The empty state's icon plays once it has settled in. In a function, so
  // only `noResults` reruns it.
  let emptyPlay = 0;
  let emptyTimer;
  const scheduleEmptyPlay = (empty) => {
    clearTimeout(emptyTimer);
    if (empty) emptyTimer = setTimeout(() => emptyPlay++, 400);
    else emptyPlay = 0;
  };
  $: noResults = Boolean(data) && matches === 0;
  $: scheduleEmptyPlay(noResults);

  const clearSearch = () => {
    query = "";
    searchInput?.focus();
  };

  // ---- Details panel ----

  let selected = null;
  let detailsOpen = false;
  const previews = [
    ["icon", "Icon"],
    ["button", "Button"],
    ["icon-button", "Icon button"],
    ["themes", "Themes"],
    ["pixels", "Pixels"],
  ];
  // Tabs that show the icon on its own, with its props in the code.
  $: standalone = ["icon", "themes", "pixels"].includes(preview);

  // ---- Props playground ----

  // A name for screen readers, and a color from Carbon's tokens.
  let iconTitle = "";
  const colors = [
    ["--cds-icon-primary", "Primary"],
    ["--cds-icon-secondary", "Secondary"],
    ["--cds-icon-interactive", "Interactive"],
    ["--cds-support-error", "Error"],
    ["--cds-support-warning", "Warning"],
    ["--cds-support-success", "Success"],
    ["--cds-support-info", "Info"],
  ];
  let colorToken = colors[0][0];
  $: iconProps = [
    iconSize !== 16 && `size={${iconSize}}`,
    iconTitle.trim() && `title="${iconTitle.trim().replace(/"/g, "&quot;")}"`,
    colorToken !== colors[0][0] && `style="fill: var(${colorToken})"`,
  ].filter(Boolean);

  // ---- Cost ----

  // The icon's SVG gzipped, as browsers download it, and its paths.
  let cost = null;
  const measure = async (name) => {
    const markup = data?.byModuleName[name];
    if (!markup || typeof CompressionStream === "undefined") return;
    const stream = new Blob([markup]).stream().pipeThrough(new CompressionStream("gzip"));
    const bytes = (await new Response(stream).arrayBuffer()).byteLength;
    const shapes = (markup.match(/<(path|circle|rect|polygon|ellipse|line|polyline)\b/g) ?? []).length;
    if (name === selected) cost = { bytes, shapes };
  };
  $: if (selected && data) measure(selected);

  // ---- Compare ----

  /** Icons pinned to compare, kept across visits. */
  let compared = [];
  // Saved only once read, so the empty list on load doesn't overwrite it.
  let comparedLoaded = false;
  onMount(() => {
    try {
      compared = JSON.parse(localStorage.getItem("compare-icons") ?? "[]").filter((name) => typeof name === "string");
    } catch {}
    comparedLoaded = true;
  });
  $: if (comparedLoaded) {
    try {
      localStorage.setItem("compare-icons", JSON.stringify(compared));
    } catch {}
  }
  const toggleCompare = (name) =>
    (compared = compared.includes(name) ? compared.filter((other) => other !== name) : [...compared, name]);
  let previewIndex = 0;
  $: preview = previews[previewIndex][0];
  // "direct" imports the icon's own file; "barrel" imports from the
  // package's index, which needs optimizeImports.
  const importStyles = ["direct", "barrel"];
  let importIndex = 0;
  $: importStyle = importStyles[importIndex];

  // A subcategory has its own heading only when its category has others.
  const subcategoryOrCategoryId = (category, subcategory) =>
    (data?.groups.find((group) => group.category === category)?.subcategories.length ?? 0) > 1
      ? subcategoryId(category, subcategory)
      : categoryId(category);

  // A category link in the details: clear the search, which merges the
  // groups, close the panel and go to the group.
  const goToGroup = async (event, id) => {
    event.preventDefault();
    query = "";
    animatedOnly = false;
    detailsOpen = false;
    history.replaceState(history.state, "", `${location.pathname}#${id}`);
    await tick();
    scrollToHash();
  };

  // A deprecation reason with the icons it names as links: Carbon writes
  // them in kebab case ("logo--x"), or after "icon" ("the icon watsonx").
  $: iconByKey = new Map(allIcons.map((name) => [name.toLowerCase(), name]));
  const reasonParts = (reason) => {
    const parts = [];
    let last = 0;
    for (const match of reason.matchAll(/(icon\s+)?\b([a-z0-9]+(?:-{1,2}[a-z0-9]+)*)\b/gi)) {
      const [, afterIcon, token] = match;
      const name = iconByKey.get(token.replace(/-/g, "").toLowerCase());
      const isName = name && name !== selected && (token.includes("-") || (afterIcon && /^[a-z0-9]+$/.test(token)));
      if (!isName) continue;
      const start = match.index + (afterIcon?.length ?? 0);
      parts.push({ text: reason.slice(last, start) }, { icon: name });
      last = start + token.length;
    }
    // Carbon's reasons don't all end in a period.
    const rest = reason.slice(last).trimEnd();
    parts.push({ text: /[.!?]$/.test(rest) ? rest : `${rest}.` });
    return parts;
  };

  const open = (name) => showIcon(name);

  // The gallery's order as shown: every icon by category, or the filtered
  // ones best match first, ties in category order. j and k step through it.
  $: position = new Map(allIcons.map((name, index) => [name, index]));
  $: browseOrder = filter
    ? [...filter.keys()].sort((a, b) => filter.get(a) - filter.get(b) || position.get(a) - position.get(b))
    : allIcons;
  $: browseIndex = selected ? browseOrder.indexOf(selected) : -1;
  const step = (delta) => {
    const next = browseOrder[browseIndex + delta];
    if (browseIndex === -1 || !next) return;
    selected = next;
  };

  // ---- Tile actions ----

  // The SVG at the size the gallery shows.
  const svgOf = (name) => sized(data.byModuleName[name], iconSize);

  const copyText = async (text, status, done, key) => {
    await navigator.clipboard.writeText(text);
    done(status, key);
  };
  // A file name from the icon's name: AddAlt → add-alt.svg.
  const fileName = (name) => `${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}.svg`;
  const downloadSvg = (name, svg) => {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: fileName(name) });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  // The tile of the icon the panel shows is marked as current, so it's
  // clear which one is open. Tiles are static HTML, so it's set directly.
  let currentTile = null;
  const markCurrent = (name) => {
    currentTile?.removeAttribute("aria-current");
    currentTile = name ? tileOf(name) : null;
    currentTile?.setAttribute("aria-current", "true");
  };
  $: if (groupsElement) markCurrent(detailsOpen ? selected : null);

  // Keep the gallery behind the panel on the icon shown, so closing the
  // panel lands where browsing ended.
  const tileOf = (name) => groupsElement?.querySelector(`button[data-icon="${name}"]`);
  $: if (groupsElement && detailsOpen && selected) revealTile(tileOf(selected));
  let wasOpen = false;
  $: {
    if (wasOpen && !detailsOpen && selected) {
      // After SidePanel returns focus to the tile that opened it.
      requestAnimationFrame(() => tileOf(selected)?.focus({ preventScroll: true }));
    }
    wasOpen = detailsOpen;
  }


  // The same icon's other styles, found by name: Add, AddAlt, AddFilled,
  // AddLarge. Suffixes come off the end until only the stem is left.
  const VARIANT_SUFFIX = /(Filled|Outline|Alt|Large|Solid|Half|Fill|Stroke|Inverted|Mirror|_\d+)$/;
  const stem = (name) => {
    let base = name;
    while (VARIANT_SUFFIX.test(base) && base.replace(VARIANT_SUFFIX, "")) base = base.replace(VARIANT_SUFFIX, "");
    return base;
  };
  $: families = allIcons.reduce((result, name) => {
    const key = stem(name);
    (result.get(key) ?? result.set(key, []).get(key)).push(name);
    return result;
  }, new Map());
  $: variants = selected ? (families.get(stem(selected)) ?? []).filter((name) => name !== selected) : [];

  $: categoryOf = (() => {
    /** @type {Map<string, [string, string]>} */
    const result = new Map();
    for (const group of data?.groups ?? []) {
      for (const sub of group.subcategories) for (const name of sub.icons) result.set(name, [group.category, sub.name]);
    }
    return result;
  })();

  // A tag stays on one line if it fits 80 columns; otherwise one prop per line.
  const tag = (name, props, indent = "") => {
    const line = `${indent}<${name}${props.map((prop) => ` ${prop}`).join("")} />`;
    return line.length <= 80 ? line : `${indent}<${name}\n${props.map((prop) => `${indent}  ${prop}`).join("\n")}\n${indent}/>`;
  };

  const importFor = (name, style) =>
    style === "direct"
      ? `import ${name} from "carbon-icons-svelte/lib/${name}.svelte";`
      : `import { ${name} } from "carbon-icons-svelte";`;
  $: importLine = selected ? importFor(selected, importStyle) : "";
  $: detailsCode = !selected
    ? ""
    : standalone
      ? `<script>\n  ${importLine}\n<\/script>\n\n${tag(selected, iconProps)}`
      : `<script>\n  import { Button } from "carbon-components-svelte";\n  ${importLine}\n<\/script>\n\n${
          preview === "button"
            ? `<Button icon={${selected}}>${selected}</Button>`
            : `<Button kind="ghost" icon={${selected}} iconDescription="${selected}" />`
        }`;

  // Inline SVG for the previews: the icon at a size, or in a button.
  const sized = (svg, size) => svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);
  const inButton = (svg) => svg.replace("<svg ", '<svg class="bx--btn__icon" aria-hidden="true" ');

  // The open panel and its options live in the URL's query, with the search,
  // so a link reopens the page as it was.
  //
  // History follows what people do: opening an icon, or going to another
  // one from the details (a variant, a replacement), adds an entry, so Back
  // returns to where they were. Browsing with j and k, searching and the
  // panel's options replace the current entry. Closing a panel opened that
  // way goes back to the entry before it.
  let urlReady = false;
  const applyUrl = () => {
    const params = new URLSearchParams(location.search);
    query = params.get("q") ?? "";
    animatedOnly = params.get("animated") === "1";
    const icon = params.get("icon");
    previewIndex = Math.max(0, previews.findIndex(([id]) => id === params.get("preview")));
    importIndex = ["barrel", "package"].includes(params.get("import") ?? "") ? 1 : 0;
    if (icon) selected = icon;
    detailsOpen = Boolean(icon);
  };
  onMount(() => {
    applyUrl();
    urlReady = true;
  });
  // Set while a change should add a history entry rather than replace one.
  let pushNext = false;
  const showIcon = (name) => {
    pushNext = true;
    selected = name;
    detailsOpen = true;
  };
  $: search = (() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (animatedOnly) params.set("animated", "1");
    if (detailsOpen && selected) {
      params.set("icon", selected);
      if (preview !== "icon") params.set("preview", preview);
      if (importStyle !== "direct") params.set("import", importStyle);
    }
    const text = params.toString();
    return text ? `?${text}` : "";
  })();
  $: if (urlReady && search !== location.search) {
    const url = `${location.pathname}${search}${location.hash}`;
    // `iconsPanel` counts the entries the open panel has added.
    const depth = history.state?.iconsPanel ?? 0;
    if (pushNext) {
      history.pushState({ iconsPanel: detailsOpen && new URLSearchParams(location.search).has("icon") ? depth + 1 : 1 }, "", url);
    } else if (!detailsOpen && depth > 0 && new URLSearchParams(location.search).has("icon")) {
      // Closing a panel that added entries: step back to before them all.
      history.go(-depth);
    } else {
      history.replaceState(history.state, "", url);
    }
    pushNext = false;
  }

  let panelSvgCopied = false;
  const copyPanelSvg = async () => {
    await navigator.clipboard.writeText(svgOf(selected));
    panelSvgCopied = true;
    setTimeout(() => (panelSvgCopied = false), 2000);
  };

  let urlCopied = false;
  const copyUrl = async () => {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}${search}`);
    urlCopied = true;
    setTimeout(() => (urlCopied = false), 2000);
  };

  // The icons render once their data loads, after the browser has looked
  // for the URL's target, so scroll to it then.
  let scrolledToHash = false;
  $: if (data && !scrolledToHash) {
    scrolledToHash = true;
    tick().then(scrollToHash);
  }

  // The header's side nav lists this page's sections on narrow screens.
  $: if (data) {
    pageLinks.set(
      sections.flatMap(([id, text]) => [
        { href: `#${id}`, text },
        ...(id === "icons-gallery"
          ? data.groups.map((group) => ({ href: `#${categoryId(group.category)}`, text: group.category, nested: true }))
          : []),
      ])
    );
  }
  onMount(() => () => pageLinks.set([]));

  // ---- Examples ----

  const usageCode = `<script>
  import Add from "carbon-icons-svelte/lib/Add.svelte";
<\/script>

<Add />`;

  const packageCode = `// svelte.config.js
import { optimizeImports } from "carbon-preprocess-svelte";

export default {
  preprocess: [optimizeImports()],
};`;

  const packageImportCode = `<script>
  import { Add } from "carbon-icons-svelte";
<\/script>`;

  const sizesCode = `<Add size={16} />
<Add size={20} />
<Add size={24} />
<Add size={32} />`;

  const componentsCode = `<script>
  import { Button, Link, OverflowMenu } from "carbon-components-svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import ArrowRight from "carbon-icons-svelte/lib/ArrowRight.svelte";
  import Notification from "carbon-icons-svelte/lib/Notification.svelte";
  import Settings from "carbon-icons-svelte/lib/Settings.svelte";
<\/script>

<Button icon={Add}>Add item</Button>
<Button kind="ghost" icon={Notification} iconDescription="Notifications" />
<Link href="#" icon={ArrowRight}>Learn more</Link>
<OverflowMenu icon={Settings} />`;

  const stylingCode = `<p style="color: var(--cds-support-error)">
  <TrashCan /> Deleting removes the file for everyone.
</p>

<Add class="add-icon" />

<style>
  :global(.add-icon) {
    fill: var(--cds-icon-interactive);
  }
</style>`;

  const accessibilityCode = `<!-- Decorative, next to text: hidden from screen readers -->
<Download /> Download

<!-- On its own: an image with a name -->
<Download title="Download" />
<Download aria-label="Download" />

<!-- In an icon-only button: label the button -->
<Button kind="ghost" icon={Download} iconDescription="Download" />`;
</script>

<FocusKey element={searchInput} selectText />

<!-- Back and Forward within the page show the icon and options in the URL. -->
<svelte:window on:popstate={() => urlReady && applyUrl()} />


<Theme bind:theme persist persistKey="theme" />

{#snippet sizeControl(labelledBy)}
  <ContentSwitcher
    size="sm"
    autoWidth
    lowContrast
    aria-labelledby={labelledBy}
    selectedIndex={Math.max(0, iconSizes.indexOf(iconSize))}
    on:change={({ detail }) => (iconSize = iconSizes[detail])}
  >
    {#each iconSizes as option (option)}
      <Switch text="{option}" />
    {/each}
  </ContentSwitcher>
{/snippet}

{#snippet themeControl(id)}
  <div class="toolbar-theme">
    <span {id} class="bx--label">Theme</span>
    <Dropdown
      type="inline"
      size="sm"
      titleText="Theme"
      hideLabel
      aria-labelledby={id}
      items={themes.map((option) => ({ id: option, text: themeNames[option] }))}
      selectedId={theme}
      on:select={({ detail }) => (theme = detail.selectedId)}
    />
  </div>
{/snippet}

{#if data}
  <CompareTray
    bind:names={compared}
    svgs={data.byModuleName}
    size={iconSize}
    importFor={(name) => importFor(name, importStyle)}
    on:open={({ detail }) => open(detail)}
  />
{/if}

<CssGrid class="page docs-page icons-page{compared.length > 0 ? ' with-tray' : ''}" fullWidth>
  <CssColumn sm={4} md={8} lg={4} xlg={3} class="toc-column">
    <div class="toc">
      <TableOfContents labelText="On this page" size="sm" scrollOffset={64}>
        {#each sections as [id, text, icon] (id)}
          <TableOfContentsItem href="#{id}">
            <svelte:component this={icon} />
            {text}
          </TableOfContentsItem>
          {#if id === "icons-gallery" && data && !filter}
            {#each data.groups as group (group.category)}
              {@const total = count(group.subcategories.flatMap((sub) => sub.icons))}
              {#if total > 0}
                <TableOfContentsItem href="#{categoryId(group.category)}" level={2}>
                  {group.category}
                  <span class="toc-count">({total.toLocaleString()})</span>
                </TableOfContentsItem>
              {/if}
            {/each}
          {/if}
        {/each}
      </TableOfContents>
    </div>
  </CssColumn>

  <CssColumn sm={4} md={8} lg={12} xlg={13}>
    <Prose maxWidth="none">
      <section id="icons-gallery">
        <h1 class="page-title">Icons</h1>
        <p class="page-description">
          {#if data}
            {data.total.toLocaleString()} icons from @carbon/icons {data.version}, as Svelte components.
          {:else}
            Carbon Design System icons, as Svelte components.
          {/if}
        </p>
        <div class="toolbar-sentinel" use:watchStuck={(stuck) => (toolbarStuck = stuck && !compactToolbar)}></div>
        <div
          class="gallery-toolbar"
          class:stuck={toolbarStuck}
          class:compact={compactToolbar}
          use:fitToolbar={{ compact: compactToolbar, set: setCompact }}
          bind:this={toolbarElement}
        >
          <SearchInput
            size="sm"
            labelText="Search icons"
            placeholder="Search by name or keyword"
            shortcut="mod+k"
            selectTextOnFocus
            autocomplete="off"
            spellcheck="false"
            disabled={!data}
            bind:ref={searchInput}
            on:shortcut={(event) => {
              // Focus it without nudging the page; see focusInPlace.
              event.preventDefault();
              focusInPlace(searchInput);
            }}
            bind:value={query}
          />
          {#if compactToolbar}
            <div class="toolbar-options">
              <Button
                kind="ghost"
                size="small"
                icon={AnimatedSettings}
                iconDescription="View options"
                tooltipPosition="bottom"
                tooltipAlignment="end"
                aria-expanded={optionsOpen}
                on:click={() => (optionsOpen = !optionsOpen)}
              />
              <Popover bind:open={optionsOpen} align="bottom-right" caret closeOnOutsideClick closeOnEscape>
                <div class="options-panel">
                  <div class="options-field">
                    <span id="icons-compact-size-label" class="bx--label">Size</span>
                    {@render sizeControl("icons-compact-size-label")}
                  </div>
                  {@render themeControl("icons-compact-theme-label")}
                  <div class="toolbar-field">
                    <span id="icons-compact-animated-label" class="bx--label">Animated</span>
                    <Toggle size="sm" labelText="Animated" hideLabel labelA="" labelB="" aria-labelledby="icons-compact-animated-label" bind:toggled={animatedOnly} />
                  </div>
                </div>
              </Popover>
            </div>
          {:else}
            <div class="toolbar-controls">
              <div class="toolbar-field">
                <span id="icons-size-label" class="bx--label">Size</span>
                {@render sizeControl("icons-size-label")}
              </div>
              {@render themeControl("icons-theme-label")}
              <div class="toolbar-field">
                <span id="icons-animated-label" class="bx--label">Animated</span>
                <Toggle size="sm" labelText="Animated" hideLabel labelA="" labelB="" aria-labelledby="icons-animated-label" bind:toggled={animatedOnly} />
              </div>
            </div>
          {/if}
        </div>

        {#if noResults}
          <div class="gallery-empty" bind:this={emptyElement}>
            <EmptyState size="sm" headingLevel={3} titleText="No icons match “{query.trim()}”" subtitleText="Try a keyword like “heart” or “refresh”.">
              <AnimatedIdea slot="illustration" size={32} play={emptyPlay} trigger="none" motion="expressive" />
              <Button kind="tertiary" size="small" on:click={clearSearch}>Clear search</Button>
            </EmptyState>
          </div>
        {/if}
        <p class="visually-hidden" aria-live="polite">{searchStatus}</p>
        <p id="icons-gallery-keys" class="visually-hidden">Use the arrow keys to move between icons.</p>

        {#if data}
          <!-- While searching, the groups merge into one grid ranked best
            first, by turning their own grids into display: contents. -->
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
          <div
            class="gallery-groups icon-size--{iconSize}"
            class:searching={Boolean(filter)}
            bind:this={groupsElement}
            role="group"
            aria-label="Icons"
            aria-describedby="icons-gallery-keys"
            use:filterTiles={filter}
            use:rovingFocus={filter}
            on:click={(event) => {
              const tile = event.target instanceof Element ? event.target.closest("button[data-icon]") : null;
              if (tile instanceof HTMLElement && tile.dataset.icon) open(tile.dataset.icon);
            }}
          >
            <!-- Copying keeps the menu open, with a checkmark on the item,
              so several things can be copied in a row. -->
            <TileActions host={groupsElement} let:icon={name} let:done let:doneKey>
              <OverflowMenuItem
                icon={Copy}
                iconEnd={doneKey === "svg" ? Checkmark : undefined}
                text="Copy SVG"
                on:click={(event) => {
                  event.preventDefault();
                  copyText(svgOf(name), `Copied the SVG for ${name}`, done, "svg");
                }}
              />
              <OverflowMenuItem
                icon={CodeIcon}
                iconEnd={doneKey === "import" ? Checkmark : undefined}
                text="Copy import"
                on:click={(event) => {
                  event.preventDefault();
                  copyText(importFor(name, importStyle), `Copied the import for ${name}`, done, "import");
                }}
              />
              <OverflowMenuItem
                icon={TextFont}
                iconEnd={doneKey === "name" ? Checkmark : undefined}
                text="Copy name"
                on:click={(event) => {
                  event.preventDefault();
                  copyText(name, `Copied ${name}`, done, "name");
                }}
              />
              <OverflowMenuItem
                hasDivider
                icon={Download}
                text="Download SVG"
                on:click={() => {
                  downloadSvg(name, svgOf(name));
                  done(`Downloaded ${fileName(name)}`);
                }}
              />
              <OverflowMenuItem
                icon={compared.includes(name) ? PinFilled : Pin}
                text={compared.includes(name) ? "Unpin from compare" : "Pin to compare"}
                on:click={() => {
                  toggleCompare(name);
                  done(compared.includes(name) ? `Pinned ${name} to compare` : `Unpinned ${name}`);
                }}
              />
            </TileActions>
            <!-- Every group stays mounted: while searching, the groups merge
              and their headings are hidden, so a group with no matches
              shows nothing, and its tiles aren't rebuilt when matches return. -->
            {#each data.groups as group (group.category)}
              <h3 id={categoryId(group.category)}>{group.category}</h3>
              {#each group.subcategories as sub (sub.name)}
                {#if group.subcategories.length > 1}
                  <h4 id={subcategoryId(group.category, sub.name)} class="gallery-subheading">{sub.name}</h4>
                {/if}
                <div class="gallery dense">{@html tiles(sub.icons)}</div>
              {/each}
            {/each}
          </div>
        {:else}
          <div class="gallery dense gallery-loading" aria-hidden="true">
            {#each Array.from({ length: 24 }) as _, i (i)}<SkeletonPlaceholder />{/each}
          </div>
        {/if}
      </section>

      <section id="icons-usage">
        <h2>Usage</h2>
        <p>Import each icon from its own file. Every icon is a Svelte component that renders an inline SVG.</p>
        <Code code={usageCode} />
        <p>
          To import from the package instead, add <code>optimizeImports</code> from <code>carbon-preprocess-svelte</code>. It rewrites each import to the icon's file when your app builds, so only the icons you use are compiled.
        </p>
        <Code code={packageCode} language="js" />
        <Code code={packageImportCode} />
      </section>

      <section id="icons-sizes">
        <h2>Sizes</h2>
        <p>
          Carbon draws icons for 16, 20, 24 and 32 pixels. <code>size</code> sets the width and height, and defaults to 16. Any number works, but those four keep strokes on the pixel grid.
        </p>
        <div class="example">
          <div class="demo">
            <div class="demo-row size-row">
              {#each iconSizes as option (option)}
                <span class="size-sample"><Add size={option} /><span>{option}</span></span>
              {/each}
            </div>
          </div>
          <Code code={sizesCode} />
        </div>
      </section>

      <section id="icons-carbon">
        <h2>In Carbon components</h2>
        <p>Pass an icon wherever a Carbon component takes an <code>icon</code>.</p>
        <div class="example">
          <div class="demo">
            <div class="demo-row">
              <Button icon={Add}>Add item</Button>
              <Button kind="ghost" icon={Notification} iconDescription="Notifications" />
              <Link href="#icons-carbon" icon={ArrowRight}>Learn more</Link>
              <OverflowMenu icon={Settings}>
                <OverflowMenuItem text="Rename" />
                <OverflowMenuItem text="Duplicate" />
              </OverflowMenu>
            </div>
          </div>
          <Code code={componentsCode} />
        </div>
      </section>

      <section id="icons-styling">
        <h2>Color and styling</h2>
        <ul>
          <li><strong>Color:</strong> icons fill with <code>currentColor</code>, so they take the color of the text around them.</li>
          <li><strong>Other attributes</strong> go to the <code>svg</code> element, like <code>class</code>, <code>style</code> or <code>fill</code>.</li>
        </ul>
        <div class="example">
          <div class="demo">
            <p class="styling-sample"><TrashCan /> Deleting removes the file for everyone.</p>
          </div>
          <Code code={stylingCode} />
        </div>
      </section>

      <section id="icons-accessibility">
        <h2>Accessibility</h2>
        <p>An icon is decoration unless you give it a name.</p>
        <ul>
          <li>
            <strong>Hidden by default.</strong> Without a <code>title</code>, <code>aria-label</code> or <code>aria-labelledby</code>, screen readers skip the icon, which is right next to text that says the same thing.
          </li>
          <li><strong>Named:</strong> with one of those, the icon is an image with that name.</li>
          <li>
            <strong>In a button or link,</strong> label the button or link instead, for example with <code>iconDescription</code>.
          </li>
        </ul>
        <Code code={accessibilityCode} />
      </section>

      <section id="icons-renamed">
        <h2>Renamed icons</h2>
        <p>When Carbon renames an icon, the old name still imports and renders the new icon.</p>
        {#if data?.renamedIcons}
          <table>
            <thead>
              <tr><th>Old name</th><th>Now</th></tr>
            </thead>
            <tbody>
              {#each Object.entries(data.renamedIcons) as [oldName, name] (oldName)}
                <tr><td><code>{oldName}</code></td><td><code>{name}</code></td></tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </section>

      <section id="icons-performance">
        <h2>Performance</h2>
        <ul>
          <li><strong>Only what you import.</strong> Each icon is its own small component, with its SVG inline and no runtime.</li>
          <li>
            <strong>Development builds.</strong> Importing from the package without <code>optimizeImports</code> makes your bundler compile all {data ? data.total.toLocaleString() : ""} icons on each build. Import each file, or add <code>optimizeImports</code>.
          </li>
        </ul>
      </section>

      <section id="icons-props">
        <h2>Props</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Default</th></tr>
          </thead>
          <tbody>
            <tr><td><code>size</code></td><td><code>16 | 20 | 24 | 32 | number</code></td><td><code>16</code></td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td><code>undefined</code></td></tr>
          </tbody>
        </table>
        <p>Every other prop goes to the <code>svg</code> element.</p>
      </section>

      <section id="icons-animated">
        <h2>Animated icons</h2>
        <p>
          {animatedNames.size} icons also come animated, from <code>carbon-icons-svelte/animated</code>. They take the same props, and move on hover, focus or when you play them. Open an icon above to see whether it has one.
        </p>
        <p><Link href="/animated">See the animated icons</Link></p>
      </section>
    </Prose>
  </CssColumn>
</CssGrid>

<SidePanel
  bind:open={detailsOpen}
  titleText={selected ?? ""}
  size="lg"
  includeOverlay
  selectorPrimaryFocus=".bx--side-panel__close"
  class="explorer-panel docs-panel"
>
  <div slot="toolbar" class="browse">
    <Button
      kind="ghost"
      size="small"
      icon={AnimatedChevronLeft}
      iconDescription="Previous"
      shortcut="k"
      tooltipPosition="bottom"
      tooltipAlignment="start"
      disabled={browseIndex <= 0}
      on:click={() => step(-1)}
    />
    <Button
      kind="ghost"
      size="small"
      icon={AnimatedChevronRight}
      iconDescription="Next"
      shortcut="j"
      tooltipPosition="bottom"
      disabled={browseIndex === -1 || browseIndex >= browseOrder.length - 1}
      on:click={() => step(1)}
    />
    {#if browseIndex !== -1}
      <span class="browse-position">{(browseIndex + 1).toLocaleString()} of {browseOrder.length.toLocaleString()}</span>
    {/if}
  </div>
  {#if selected && data?.byModuleName[selected]}
    {@const svg = data.byModuleName[selected]}
    <div class="explorer">
        <div class="preview-bar">
          <Tabs type="container" size="md" autoWidth bind:selected={previewIndex}>
            {#each previews as [id, label] (id)}
              <Tab {label} />
            {/each}
          </Tabs>
          <div class="stage-actions">
            <Button
              kind="ghost"
              size="field"
              icon={compared.includes(selected) ? PinFilled : Pin}
              iconDescription={compared.includes(selected) ? "Unpin from compare" : "Pin to compare"}
              tooltipPosition="bottom"
              on:click={() => toggleCompare(selected)}
            />
            <Button
              kind="ghost"
              size="field"
              icon={panelSvgCopied ? Checkmark : Copy}
              iconDescription={panelSvgCopied ? "Copied!" : "Copy SVG"}
              tooltipPosition="bottom"
              on:click={copyPanelSvg}
            />
            <Button
              kind="ghost"
              size="field"
              icon={Download}
              iconDescription="Download SVG"
              tooltipPosition="bottom"
              on:click={() => downloadSvg(selected, svgOf(selected))}
            />
            <Button
              kind="ghost"
              size="field"
              icon={urlCopied ? AnimatedCheckmark : AnimatedLink}
              iconDescription={urlCopied ? "Copied!" : "Copy URL"}
              tooltipPosition="bottom"
              tooltipAlignment="end"
              on:click={copyUrl}
            />
          </div>
        </div>
      <div class="example">
        <div class="stage stage-static">
          {#if preview === "icon"}
            <!-- Every size at once; picking one sets the size in the code. -->
            <div class="size-strip" role="group" aria-label="Size" style:color="var({colorToken})">
              {#each iconSizes as option (option)}
                <button type="button" class="size-option" aria-pressed={iconSize === option} on:click={() => (iconSize = option)}>
                  {@html sized(svg, option)}
                  <span>{option}</span>
                </button>
              {/each}
            </div>
          {:else if preview === "themes"}
            <ThemeMatrix {svg} token={colorToken} size={iconSize} />
          {:else if preview === "pixels"}
            <PixelGrid {svg} />
          {:else if preview === "button"}
            <Button>
              {selected}
              <svelte:fragment slot="icon">{@html inButton(svg)}</svelte:fragment>
            </Button>
          {:else}
            <Button kind="ghost" iconDescription={selected}>
              <svelte:fragment slot="icon">{@html inButton(svg)}</svelte:fragment>
            </Button>
          {/if}
        </div>
        <Code code={detailsCode} />
      </div>
      <Layer class="controls">
        <dl class="prop-list">
          {#if data.deprecated?.[selected] !== undefined}
            <dt>Status</dt>
            <dd class="status text-value">
              <IconIndicator kind="caution-minor" label="Deprecated" />
              <!-- Icons the reason names are links that open them here. -->
              <p>
                {#each reasonParts(data.deprecated[selected] || "Carbon no longer recommends this icon") as part, i (i)}
                  {#if part.icon}<Link href="?icon={part.icon}" on:click={(event) => { event.preventDefault(); showIcon(part.icon); }}>{part.icon}</Link>{:else}{part.text}{/if}
                {/each}
              </p>
            </dd>
          {/if}
          {#if standalone}
            <dt>
              title
              <TooltipIcon icon={Information} direction="top" align="start" portalTooltip>
                <span slot="tooltipText">
                  Without a title, screen readers skip the icon, which suits an icon beside text that says the same. With
                  one, it's an image with that name. In a button or link, label the button or link instead.
                  <span class="tooltip-default">Default: none</span>
                </span>
              </TooltipIcon>
            </dt>
            <dd>
              <TextInput size="sm" labelText="title" hideLabel placeholder="None" bind:value={iconTitle} />
            </dd>
            <dt>Color</dt>
            <dd>
              <!-- Swatches of Carbon's icon and support tokens, as radios: the
                arrow keys move between them, and the name shows beside. -->
              <fieldset class="swatches">
                <legend class="visually-hidden">Color</legend>
                {#each colors as [token, label] (token)}
                  <label class="swatch" title={label}>
                    <input type="radio" name="icon-color" value={token} bind:group={colorToken} />
                    <span class="swatch-dot" style:background="var({token})"></span>
                    <span class="visually-hidden">{label}</span>
                  </label>
                {/each}
                <span class="swatch-name" aria-hidden="true">{colors.find(([token]) => token === colorToken)?.[1]}</span>
              </fieldset>
            </dd>
          {/if}
          <dt>
            Import
            <TooltipIcon icon={Information} direction="top" align="start" portalTooltip>
              <span slot="tooltipText">
                Direct imports the icon's own file, which every bundler handles quickly. Barrel imports from the package,
                which needs optimizeImports from carbon-preprocess-svelte, or development builds compile every icon.
                <span class="tooltip-default">Default: Direct</span>
              </span>
            </TooltipIcon>
          </dt>
          <dd>
            <ContentSwitcher size="sm" autoWidth lowContrast aria-label="Import" bind:selectedIndex={importIndex}>
              <Switch text="Direct" />
              <Switch text="Barrel" />
            </ContentSwitcher>
            {#if importStyle === "barrel"}
              <div class="import-tip">
                <IconIndicator kind="informative" label="Tip" />
                <p>Add <Link size="sm" href="https://github.com/carbon-design-system/carbon-preprocess-svelte#optimizeimports" target="_blank">optimizeImports</Link>
                from carbon-preprocess-svelte. Without it, your bundler compiles all {data.total.toLocaleString()} icons on every
                development build.</p>
              </div>
            {/if}
          </dd>
          {#if cost}
            <dt>Cost</dt>
            <dd class="text-value cost">
              {cost.bytes.toLocaleString()} B of SVG, gzipped · {cost.shapes} {cost.shapes === 1 ? "shape" : "shapes"}
            </dd>
          {/if}
          {#if categoryOf.get(selected)}
            <dt>Category</dt>
            {@const [category, subcategory] = categoryOf.get(selected)}
            <dd>
              <Breadcrumb noTrailingSlash labelText="Category">
                <BreadcrumbItem href="#{categoryId(category)}" on:click={(event) => goToGroup(event, categoryId(category))}>
                  {category}
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="#{subcategoryOrCategoryId(category, subcategory)}"
                  on:click={(event) => goToGroup(event, subcategoryOrCategoryId(category, subcategory))}
                >
                  {subcategory}
                </BreadcrumbItem>
              </Breadcrumb>
            </dd>
          {/if}
          {#if aliasTerms[selected]}
            <dt>Keywords</dt>
            <dd class="tags-value">
              <!-- Plain tags: TagSet brings a modal for its "all tags" view,
                which a few keywords never need. -->
              <span class="keywords">
                {#each aliasTerms[selected] as term (term)}<Tag size="sm">{term}</Tag>{/each}
              </span>
            </dd>
          {/if}
          {#if canonicalToAliases[selected]}
            <dt>Formerly</dt>
            <dd>{canonicalToAliases[selected].join(", ")}</dd>
          {/if}
          {#if animatedNames.has(selected)}
            <dt>Animated</dt>
            <dd><Link href="/animated?icon={selected}">Try the animated version</Link></dd>
          {/if}
        </dl>
        {#if variants.length > 0}
          <!-- The same icon's other styles, as tiles like the gallery's. -->
          <section class="variants" aria-labelledby="icon-variants-heading">
            <p id="icon-variants-heading" class="variants-heading">Variants</p>
            <div class="gallery dense">
              {#each variants as name (name)}
                <button type="button" data-icon={name} on:click={() => showIcon(name)}>
                  <span class="tile-icon">{@html data.byModuleName[name]}</span>
                  <span class="tile-name">{@html nameHtml(name)}</span>
                </button>
              {/each}
            </div>
          </section>
        {/if}
      </Layer>
    </div>
  {/if}
</SidePanel>

<style>
  /* Icon sizes for the inline SVGs, which carry width and height 16. */
  .gallery-groups :global(.tile-icon svg) {
    width: var(--icon-size);
    height: var(--icon-size);
  }

  .icon-size--16 {
    --icon-size: 16px;
  }

  .icon-size--20 {
    --icon-size: 20px;
  }

  .icon-size--24 {
    --icon-size: 24px;
  }

  .icon-size--32 {
    --icon-size: 32px;
  }

  /* One ranked grid while searching: the groups' headings go, and their
     grids' tiles join this one, so CSS order ranks them across groups. */
  .gallery-groups.searching {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: 1px;
    margin-block-start: var(--cds-spacing-07);
  }

  .gallery-groups.searching :global(:is(h3, h4)) {
    display: none;
  }

  .gallery-groups.searching :global(.gallery) {
    display: contents;
  }

  .gallery-subheading {
    margin-block: var(--cds-spacing-06) var(--cds-spacing-03);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.33;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  /* Its own line under the switch: the row wraps. */
  .prop-list dd:has(.import-tip) {
    flex-wrap: wrap;
  }

  /* Tall enough for the size strip, so switching to a button preview
     doesn't change the preview's height. */
  .explorer .stage.stage-static {
    min-height: 6.5rem;
  }

  .size-strip {
    display: flex;
    align-items: flex-end;
    gap: var(--cds-spacing-03);
  }

  .size-option {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--cds-spacing-03);
    padding: var(--cds-spacing-03) var(--cds-spacing-04);
    border: 1px solid transparent;
    background: none;
    /* The strip's color, the chosen token, reaches the icons. */
    color: inherit;
    cursor: pointer;
    font: inherit;
  }

  .size-option span {
    font-size: 0.75rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .size-option:hover {
    background: var(--cds-layer-hover, var(--cds-hover-ui));
  }

  .size-option[aria-pressed="true"] {
    border-color: var(--cds-border-strong, var(--cds-ui-04));
  }

  .size-option[aria-pressed="true"] span {
    color: var(--cds-text-primary, var(--cds-text-01));
  }

  .size-option:focus-visible {
    outline: 2px solid var(--cds-focus, var(--cds-interactive-01));
    outline-offset: -2px;
  }

  .variants {
    padding-block-end: var(--cds-spacing-05);
    border-block-start: 1px solid var(--cds-border-subtle, var(--cds-ui-03));
  }

  /* Tiles on the panel's own layer, so they stand out like the gallery's. */
  .variants :global(.gallery button) {
    background: var(--cds-layer-02, var(--cds-ui-02));
  }

  .variants :global(.gallery button:hover) {
    background: var(--cds-layer-hover, var(--cds-hover-ui));
  }

  .swatches {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cds-spacing-02);
    margin: 0;
    padding: 0;
    border: 0;
  }

  .swatch {
    position: relative;
    display: flex;
    padding: var(--cds-spacing-02);
    cursor: pointer;
  }

  .swatch input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  .swatch-dot {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  /* The chosen color: a ring around its swatch. */
  .swatch:has(input:checked) .swatch-dot {
    box-shadow:
      0 0 0 2px var(--cds-layer-01, var(--cds-ui-01)),
      0 0 0 3px var(--cds-text-primary, var(--cds-text-01));
  }

  .swatch:has(input:focus-visible) {
    outline: 2px solid var(--cds-focus, var(--cds-interactive-01));
    outline-offset: -2px;
  }

  .swatch-name {
    margin-inline-start: var(--cds-spacing-03);
    font-size: 0.875rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .status {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--cds-spacing-03);
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .status p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .cost {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  /* Room for the compare tray, so it doesn't cover the end of the page. */
  :global(.icons-page.with-tray) {
    padding-block-end: 14rem;
  }

  .variants-heading {
    margin: 0 0 var(--cds-spacing-04);
    padding-block-start: var(--cds-spacing-04);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .variants :global(.tile-icon svg) {
    width: 24px;
    height: 24px;
  }

  .status {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  /* The barrel import's tip: Carbon's informative indicator labelled
     "Tip", then the advice, so it reads as advice, not small print. */
  .import-tip {
    display: flex;
    flex-direction: column;
    gap: var(--cds-spacing-02);
    flex-basis: 100%;
    max-width: 30rem;
    margin-block-start: var(--cds-spacing-04);
  }

  .import-tip p {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .size-row {
    align-items: flex-end;
    gap: var(--cds-spacing-07);
  }

  .size-sample {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--cds-spacing-03);
    font-size: 0.75rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .styling-sample {
    display: flex;
    align-items: center;
    gap: var(--cds-spacing-03);
    margin: 0;
    color: var(--cds-support-error, var(--cds-support-01));
  }

  .gallery-loading :global(.bx--skeleton__placeholder) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
</style>
