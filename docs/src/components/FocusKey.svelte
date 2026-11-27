<script>
  import { focusInPlace } from "../gallery.js";

  /**
   * Focuses a search field on "/", unless another field has focus, so a
   * "/" can still be typed there, or a dialog is open, since the field
   * behind it can't be reached.
   *
   * Cmd+K (Ctrl+K outside macOS) is the field's own `shortcut`, which also
   * shows it as a hint. `Search` takes one shortcut, so this adds the second.
   */

  /**
   * Specify the element to focus.
   */
  export let element = null;

  /**
   * Set to `true` to select text in the element when focused.
   */
  export let selectText = false;

  const typing = (target) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

  /** @param {KeyboardEvent} event */
  function onKeydown(event) {
    if (!element || event.defaultPrevented || event.isComposing) return;
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (active === element || typing(active)) return;
    if (active?.closest('[role="dialog"], [aria-modal="true"]')) return;

    event.preventDefault();
    focusInPlace(element);
    if (selectText) element.select();
  }
</script>

<svelte:window on:keydown={onKeydown} />
