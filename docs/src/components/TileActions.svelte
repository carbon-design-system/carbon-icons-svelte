<script>
  /**
   * An actions menu that follows the hovered or focused tile, instead of
   * one per tile: that would double the gallery's elements, and a tile,
   * itself a button, can't hold one. Put it inside the element that holds
   * the tiles (`host`), which it's positioned against.
   *
   * A menu that's open stays on its tile while another tile is hovered,
   * which gets its own menu button, so there can be two at once.
   *
   * The menu's items go in the default slot, with the tile's `icon` name,
   * a `done(status, key)` to call after an action, and `doneKey`, the key
   * of the action just done on that tile, for a checkmark on its item. The
   * menu's button shows a checkmark too once the menu closes, and screen
   * readers hear `status`. The menu stays in place, not portaled: a
   * portaled menu flips above its button as the page scrolls.
   */
  import { OverflowMenu } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import OverflowMenuVertical from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";

  /** The element that holds the tiles, each a `button[data-icon]`. */
  /** @type {HTMLElement | null} */
  export let host = null;

  /** @typedef {{ name: string, top: number, left: number, flipped: boolean }} Target */

  // The menu's width, 12rem, as set below.
  const MENU_WIDTH = 192;

  /** The tile under the pointer or focus. */
  /** @type {Target | null} */
  let hovered = null;
  /** The tile whose menu is open, which stays put. */
  /** @type {Target | null} */
  let pinned = null;
  /** Each shown menu's open state, by icon name. */
  /** @type {Record<string, boolean>} */
  let openState = {};
  $: openName = Object.keys(openState).find((name) => openState[name]) ?? null;
  // A menu that opens pins its tile; one that closes lets it go.
  $: if (openName && openName !== pinned?.name && hovered?.name === openName) pinned = hovered;
  $: if (!openName && pinned) pinned = null;
  $: targets = [pinned, hovered && hovered.name !== pinned?.name ? hovered : null].filter(Boolean);

  let doneName = null;
  let doneKey = null;
  let timer;
  let status = "";
  const doneFor = (name) => (text, key = null) => {
    status = text;
    doneName = name;
    doneKey = key;
    clearTimeout(timer);
    timer = setTimeout(() => {
      doneName = null;
      doneKey = null;
    }, 2000);
  };

  const place = (tile) => {
    const box = tile.getBoundingClientRect();
    const hostBox = host.getBoundingClientRect();
    // The menu opens leftward, aligned to the tile's right edge, unless
    // that would run past the window's left edge.
    const flipped = box.right - MENU_WIDTH >= 0;
    return { name: tile.dataset.icon, top: box.top - hostBox.top, left: box.right - hostBox.left - 32, flipped };
  };

  const pointAt = (element) => {
    if (!(element instanceof Element) || element.closest(".tile-actions")) return;
    const tile = element.closest("button[data-icon]");
    if (!(tile instanceof HTMLElement) || !host) {
      hovered = null;
      return;
    }
    if (hovered?.name === tile.dataset.icon) return;
    // A click leaves focus on a menu button; let it go before the button
    // moves on, so the next tile doesn't show a focus ring it never got.
    if (!openName && document.activeElement instanceof HTMLElement && document.activeElement.closest(".tile-actions")) {
      document.activeElement.blur();
    }
    hovered = place(tile);
  };

  const onOver = (event) => pointAt(event.target);
  const onLeave = () => (hovered = null);
  const onFocusOut = (event) => {
    if (!(event.relatedTarget instanceof Node && host?.contains(event.relatedTarget))) hovered = null;
  };

  let listening = null;
  $: if (host !== listening) {
    listening?.removeEventListener("mouseover", onOver);
    listening?.removeEventListener("focusin", onOver);
    listening?.removeEventListener("mouseleave", onLeave);
    listening?.removeEventListener("focusout", onFocusOut);
    host?.addEventListener("mouseover", onOver);
    host?.addEventListener("focusin", onOver);
    host?.addEventListener("mouseleave", onLeave);
    host?.addEventListener("focusout", onFocusOut);
    listening = host;
  }
</script>

<p class="tile-actions-status" aria-live="polite">{status}</p>

{#each targets as target (target.name)}
  <span class="tile-actions" style:top="{target.top}px" style:left="{target.left}px">
    <OverflowMenu
      size="sm"
      flipped={target.flipped}
      icon={doneName === target.name && !openState[target.name] ? Checkmark : OverflowMenuVertical}
      menuOptionsClass="tile-actions-menu"
      iconDescription=""
      aria-label={doneName === target.name ? "Done" : "Actions"}
      bind:open={openState[target.name]}
    >
      <!-- No tooltip: an empty iconDescription turns it off, and
        aria-label names the button. "icon", not "name", which names a slot. -->
      <slot icon={target.name} done={doneFor(target.name)} doneKey={doneName === target.name ? doneKey : null} />
    </OverflowMenu>
  </span>
{/each}

<style>
  /* In the tile's top-right corner, clear of its centered icon and name. */
  .tile-actions {
    position: absolute;
    z-index: 1;
    display: flex;
  }

  /* Room for a label and its checkmark. Carbon renders the menu, so global. */
  :global(.tile-actions-menu) {
    min-width: 12rem;
  }

  /* A link item, like Open static icon, keeps the browser's underline
     otherwise, and the page's Prose styles links too; Carbon doesn't reset
     it. */
  :global(.tile-actions-menu a.bx--overflow-menu-options__btn) {
    text-decoration: none;
  }

  .tile-actions-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>
