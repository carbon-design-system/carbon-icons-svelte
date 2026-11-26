<script>
  /**
   * One actions menu for a whole gallery, moved to the tile that's hovered
   * or focused. A menu per tile would double the gallery's elements, and a
   * tile, itself a button, can't hold one. Put it inside the element that
   * holds the tiles (`host`), which it's positioned against.
   *
   * The menu's items go in the default slot, with the tile's `icon` name
   * and a `done(status)` to call after an action: the menu button shows a
   * checkmark for a moment, and screen readers hear `status`.
   */
  import { OverflowMenu } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import OverflowMenuVertical from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";

  /** The element that holds the tiles, each a `button[data-icon]`. */
  /** @type {HTMLElement | null} */
  export let host = null;

  /** The tile the menu sits on, and where, in `host`. */
  /** @type {{ name: string, top: number, left: number } | null} */
  let target = null;
  // While the menu is open it stays on its tile, though the pointer left.
  let open = false;
  let didAct = false;
  let timer;
  let status = "";

  const done = (text) => {
    status = text;
    didAct = true;
    clearTimeout(timer);
    timer = setTimeout(() => (didAct = false), 2000);
  };

  const pointAt = (element) => {
    if (open || !(element instanceof Element) || element.closest(".tile-actions")) return;
    const tile = element.closest("button[data-icon]");
    if (!(tile instanceof HTMLElement) || !host) {
      target = null;
      return;
    }
    if (target?.name === tile.dataset.icon) return;
    // A click leaves focus on the menu button; let it go before the menu
    // moves on, so the next tile doesn't show a focus ring it never got.
    if (document.activeElement instanceof HTMLElement && document.activeElement.closest(".tile-actions")) {
      document.activeElement.blur();
    }
    const box = tile.getBoundingClientRect();
    const hostBox = host.getBoundingClientRect();
    target = { name: tile.dataset.icon, top: box.top - hostBox.top, left: box.right - hostBox.left - 32 };
  };

  const onOver = (event) => pointAt(event.target);
  const onLeave = () => !open && (target = null);
  const onFocusOut = (event) => {
    if (open) return;
    if (!(event.relatedTarget instanceof Node && host?.contains(event.relatedTarget))) target = null;
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

{#if target}
  {@const name = target.name}
  <span class="tile-actions" style:top="{target.top}px" style:left="{target.left}px">
    <OverflowMenu
      size="sm"
      flipped
      icon={didAct ? Checkmark : OverflowMenuVertical}
      iconDescription={didAct ? "Done" : "Actions"}
      tooltipPosition="bottom"
      bind:open
    >
      <!-- "icon", not "name", which names a slot. -->
      <slot icon={name} {done} />
    </OverflowMenu>
  </span>
{/if}

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
