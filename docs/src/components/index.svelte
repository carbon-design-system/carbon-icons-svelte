<script>
  import { onMount } from "svelte";
  import { Content, LocalStorage } from "carbon-components-svelte";
  import Header from "./Header.svelte";
  import Icons from "./Icons.svelte";
  import { ALIASES_URL, BUILD_INFO_URL } from "../constants";
  import { indexAliases } from "../search.js";
  import { ANIMATED_NAMES } from "../generated/animated-aliases";

  // The Animated page and its 257 icons load only when someone opens it,
  // or once the Icons page is idle, so the first visit to either page is
  // smaller.
  // Kept once loaded, so switching to the page renders it in the same frame
  // the Icons page goes, with no blank frame between them.
  let AnimatedPage = null;
  const loadAnimated = () =>
    import("./Animated.svelte").then((module) => (AnimatedPage = module.default));

  const animatedNames = new Set(ANIMATED_NAMES);

  const ANIMATED_PATH = "/animated";

  // The Animated page lives at /animated. Links from when it was #animated
  // still work: #animated opens the page, and #animated-… opens it at that
  // section.
  /** @returns {"icons" | "animated"} */
  const getRoute = () => {
    if (location.pathname === "/" && location.hash.startsWith("#animated")) {
      const hash = location.hash === "#animated" ? "" : location.hash;
      history.replaceState(history.state, "", `${ANIMATED_PATH}${location.search}${hash}`);
    }
    return location.pathname.replace(/\/$/, "") === ANIMATED_PATH ? "animated" : "icons";
  };

  let route = getRoute();

  // Links between the two pages switch without reloading. A click with a
  // modifier, or on a link to anywhere else, does what it normally does.
  // Switch pages once the Animated page's code is in, so the current page
  // stays until the next one can replace it.
  const showRoute = async () => {
    const next = getRoute();
    if (next === "animated" && !AnimatedPage) await loadAnimated();
    route = next;
  };

  /** @param {MouseEvent} event */
  async function navigate(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (path !== "/" && path !== ANIMATED_PATH) return;
    // A link to a section of the current page scrolls there as usual.
    const current = location.pathname.replace(/\/$/, "") || "/";
    if (path === current && url.search === location.search && url.hash) return;
    event.preventDefault();
    if (path === ANIMATED_PATH && !AnimatedPage) await loadAnimated();
    history.pushState(null, "", url);
    await showRoute();
    if (!url.hash) scrollTo(0, 0);
  }

  /** The icons, their groups and their SVG, from the build. */
  let data = null;
  /** Carbon's search terms as written, and indexed for matching. */
  let aliasTerms = {};
  let aliasIndex = new Map();

  onMount(() => {
    if (route !== "animated") (window.requestIdleCallback ?? setTimeout)(() => loadAnimated());
  });

  onMount(async () => {
    const response = await fetch(BUILD_INFO_URL);
    data = await response.json();
    // Search terms come after the icons render. Until then, search matches names.
    fetch(ALIASES_URL)
      .then((response) => response.json())
      .then((aliases) => {
        aliasTerms = aliases;
        aliasIndex = indexAliases(aliases);
      })
      .catch(() => {});
  });

  const ICON_SIZE_KEY = "icon-size";
  const VALID_ICON_SIZES = [16, 20, 24, 32];
  // Shared by both pages. 24 so detail, and motion, are easy to see.
  const DEFAULT_ICON_SIZE = 24;

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

  let iconSize = getStoredIconSize();
</script>

<svelte:window on:hashchange={showRoute} on:popstate={showRoute} on:click={navigate} />

<Header {route} />

<LocalStorage key={ICON_SIZE_KEY} bind:value={iconSize} />

{#if route === "animated"}
  {#if AnimatedPage}
    <svelte:component this={AnimatedPage} bind:iconSize />
  {:else}
    {#await loadAnimated() then}{/await}
  {/if}
{:else}
  <Content>
    <Icons {data} {aliasTerms} {aliasIndex} {animatedNames} bind:iconSize />
  </Content>
{/if}

<style>
  :global(html) {
    scrollbar-gutter: stable;
  }

  :global(.bx--content) {
    padding: 0;
  }

  :global(body) {
    overflow-y: scroll;
  }
</style>
