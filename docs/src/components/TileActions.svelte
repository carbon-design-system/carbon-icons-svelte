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
   * The menu's items go in the default slot, with the tile's `icon` name
   * and a `done(status)` to call after an action: that menu's button shows
   * a checkmark for a moment, and screen readers hear `status`.
   */
  import { OverflowMenu } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import OverflowMenuVertical from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";

  /** The element that holds the tiles, each a `button[data-icon]`. */
  /** @type {HTMLElement | null} */
  export let host = null;

  /** @typedef {{ name: string, top: number, left: number }} Target */

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
  let timer;
  let status = "";
  const doneFor = (name) => (text) => {
    status = text;
    doneName = name;
    clearTimeout(timer);
    timer = setTimeout(() => (doneName = null), 2000);
  };

  const place = (tile) => {
    const box = tile.getBoundingClientRect();
    const hostBox = host.getBoundingClientRect();
    return { name: tile.dataset.icon, top: box.top - hostBox.top, left: box.right - hostBox.left - 32 };
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
      flipped
      icon={doneName === target.name ? Checkmark : OverflowMenuVertical}
      iconDescription=""
      aria-label={doneName === target.name ? "Done" : "Actions"}
      bind:open={openState[target.name]}
    >
      <!-- No tooltip: an empty iconDescription turns it off, and
        aria-label names the button. "icon", not "name", which names a slot. -->
      <slot icon={target.name} done={doneFor(target.name)} />
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

  .tile-actions-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>
