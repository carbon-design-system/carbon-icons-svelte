// Behaviour shared by the docs pages' icon galleries.

/** The UI shell header's height. */
const HEADER = 48;

/**
 * Switches a toolbar to its compact layout when its controls don't fit on
 * one row, and back when they do. Whether they fit depends on their content
 * (a theme like "Gray 100" is wider than "White"), so it's measured, not a
 * breakpoint.
 * @param {HTMLElement} node
 * @param {{ compact: boolean, set: (compact: boolean) => void }} params
 */
export function fitToolbar(node, params) {
  // The width the full toolbar needs, measured whenever it's shown.
  let fullWidth = 1312;
  const check = () => {
    if (!params.compact) {
      fullWidth = node.scrollWidth;
      if (node.scrollWidth > node.clientWidth) params.set(true);
    } else if (node.clientWidth >= fullWidth) {
      params.set(false);
    }
  };
  const resize = new ResizeObserver(check);
  // Content changes, like a longer theme name, change the controls' width.
  const content = new MutationObserver(() => requestAnimationFrame(check));
  resize.observe(node);
  content.observe(node, { subtree: true, childList: true, characterData: true });
  requestAnimationFrame(check);
  return {
    update(next) {
      params = next;
    },
    destroy() {
      resize.disconnect();
      content.disconnect();
    },
  };
}

/**
 * Reports when a sticky toolbar is stuck under the header. Put it on a
 * zero-height element just above the toolbar: it leaves the viewport, below
 * the header, exactly when the toolbar sticks.
 * @param {HTMLElement} node
 * @param {(stuck: boolean) => void} set
 */
export function watchStuck(node, set) {
  const observer = new IntersectionObserver(
    ([entry]) => set(!entry.isIntersecting && entry.boundingClientRect.top < HEADER),
    { rootMargin: `-${HEADER}px 0px 0px 0px` }
  );
  observer.observe(node);
  return {
    update(next) {
      set = next;
    },
    destroy: () => observer.disconnect(),
  };
}

/**
 * Narrowing a gallery while scrolled into it would leave the results above
 * the viewport, so this brings their start back under the toolbar, or
 * under the header when the toolbar isn't sticky. Only ever scrolls up.
 * @param {HTMLElement | null} results
 * @param {HTMLElement | null} toolbar
 * @param {boolean} sticky
 */
export async function revealResults(results, toolbar, sticky) {
  if (!results || !toolbar) return;
  // The page gets shorter as results go, and sections skipped by
  // content-visibility take their real size as they come into view, so
  // check again each frame until the results stay put.
  for (let frame = 0; frame < 5; frame++) {
    const below = sticky ? Math.max(HEADER, toolbar.getBoundingClientRect().bottom) : HEADER;
    const top = results.getBoundingClientRect().top;
    if (top >= below) return;
    window.scrollBy({ top: top - below - 16, behavior: "instant" });
    await new Promise(requestAnimationFrame);
  }
}

/**
 * One tab stop for the whole gallery: the arrow keys move between tiles,
 * Up and Down to the nearest tile in the row above or below, and Home and
 * End to the first and last tile. Hidden tiles are skipped.
 * @param {HTMLElement} node
 */
export function rovingFocus(node) {
  let current = null;
  const all = () => [...node.querySelectorAll(".gallery button")];
  // A search hides tiles with an inline display: none. Checked from the
  // style, not the layout, so it doesn't force a layout of every tile.
  const isShown = (tile) => tile.isConnected && tile.style.display !== "none";
  const visible = () => all().filter(isShown);
  const sync = () => {
    const tiles = all();
    if (!current || !tiles.includes(current) || !isShown(current)) current = tiles.find(isShown) ?? null;
    for (const tile of tiles) {
      const tabIndex = tile === current ? 0 : -1;
      if (tile.tabIndex !== tabIndex) tile.tabIndex = tabIndex;
    }
  };
  const rowStep = (all, from, direction) => {
    const box = from.getBoundingClientRect();
    const center = box.left + box.width / 2;
    const rows = all.filter((tile) => {
      const top = tile.getBoundingClientRect().top;
      return direction > 0 ? top > box.top + 1 : top < box.top - 1;
    });
    if (rows.length === 0) return null;
    const tops = rows.map((tile) => tile.getBoundingClientRect().top);
    const rowTop = direction > 0 ? Math.min(...tops) : Math.max(...tops);
    const row = rows.filter((tile) => Math.abs(tile.getBoundingClientRect().top - rowTop) < 1);
    const distance = (tile) => {
      const b = tile.getBoundingClientRect();
      return Math.abs(b.left + b.width / 2 - center);
    };
    return row.reduce((best, tile) => (distance(tile) < distance(best) ? tile : best));
  };
  // In visual order, which a search's ranking can change from DOM order.
  const ordered = () =>
    visible().sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return ra.top - rb.top || ra.left - rb.left;
    });
  const onKeydown = (event) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const all = ordered();
    const index = all.indexOf(event.target);
    if (index === -1) return;
    const next = {
      ArrowRight: all[index + 1],
      ArrowLeft: all[index - 1],
      ArrowDown: event.key === "ArrowDown" && rowStep(all, all[index], 1),
      ArrowUp: event.key === "ArrowUp" && rowStep(all, all[index], -1),
      Home: all[0],
      End: all[all.length - 1],
    }[event.key];
    event.preventDefault();
    if (!next) return;
    current = next;
    sync();
    next.focus();
  };
  const onFocusin = (event) => {
    if (event.target instanceof HTMLElement && event.target.matches(".gallery button")) {
      current = event.target;
      sync();
    }
  };
  node.addEventListener("keydown", onKeydown);
  node.addEventListener("focusin", onFocusin);
  sync();
  return {
    update: () => requestAnimationFrame(sync),
    destroy() {
      node.removeEventListener("keydown", onKeydown);
      node.removeEventListener("focusin", onFocusin);
    },
  };
}

/**
 * Scrolls to the element the URL's hash names, for a page that renders
 * after the browser has looked for it. Content that renders as it comes
 * into view can move the target, so it scrolls again each frame until the
 * target stays put.
 */
export async function scrollToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  let top;
  for (let frame = 0; frame < 10; frame++) {
    target.scrollIntoView({ behavior: "instant" });
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const next = target.getBoundingClientRect().top;
    if (next === top) return;
    top = next;
  }
}

/**
 * Focuses a field without scrolling when it's already on screen. A plain
 * focus() scrolls a field in a sticky toolbar to clear the page's scroll
 * padding, nudging the page even though the field was in view.
 * @param {HTMLElement | null} element
 */
export function focusInPlace(element) {
  if (!element) return;
  const box = element.getBoundingClientRect();
  const visible = box.top >= 0 && box.bottom <= window.innerHeight;
  element.focus({ preventScroll: visible });
}
