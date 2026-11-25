<script>
  /**
   * Focuses a search field on "/" or on Cmd+K (Ctrl+K outside macOS).
   *
   * "/" is ignored while typing in another field, so it can still be typed.
   * Cmd+K works from anywhere, and takes over the browser's own shortcut,
   * except inside a dialog, where the field behind it can't be reached.
   * Both run on keydown: macOS sends no keyup for a key pressed with Cmd.
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
    if (!element || event.defaultPrevented || event.isComposing || event.altKey) return;
    const active = document.activeElement;
    if (active === element) return;
    if (active?.closest('[role="dialog"], [aria-modal="true"]')) return;

    const modifier = event.metaKey || event.ctrlKey;
    const slash = event.key === "/" && !modifier && !typing(active);
    const commandK = modifier && !event.shiftKey && event.key.toLowerCase() === "k";
    if (!slash && !commandK) return;

    event.preventDefault();
    element.focus();
    if (selectText) element.select();
  }
</script>

<svelte:window on:keydown={onKeydown} />
