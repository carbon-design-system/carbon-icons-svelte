// Shared runtime for `carbon-icons-svelte/animated`. Copied to `lib/animated/animate.js` by the build.

/** Hovering or keyboard-focusing one of these plays an icon inside it. */
const TRIGGER = 'a, button, label, summary, [role="button"], [role="link"], [role="menuitem"], [role="tab"]';

/** Each icon's CSS runs its animation while the `<svg>` has this attribute. */
const PLAYING = "data-playing";

const isRunning = (node) =>
  node.getAnimations?.({ subtree: true }).some((animation) => animation.playState === "running") ?? false;

/** Starts the animation over from its first frame. */
const restart = (node) => {
  node.removeAttribute(PLAYING);
  // Flush styles so that adding the attribute back starts a new animation.
  node.getBoundingClientRect();
  node.setAttribute(PLAYING, "");
};

/**
 * Svelte action that plays an animated icon.
 *
 * With `trigger: "hover"`, entering the icon or its closest interactive
 * ancestor starts the animation, which then always runs to the end. Pure CSS
 * `:hover` would cut it off and snap back to rest when the pointer leaves.
 *
 * `play` restarts the animation whenever it changes to a truthy value.
 */
export function animate(node, { play = false, trigger = "hover" } = {}) {
  const target = node.closest(TRIGGER) ?? node;

  const onEnter = () => {
    if (trigger === "hover" && !isRunning(node)) restart(node);
  };

  const onFocusIn = (event) => {
    if (event.target.matches(":focus-visible")) onEnter();
  };

  // Chrome makes an `<svg>` with a focus listener keyboard-focusable, which
  // would add a tab stop. Only listen on the icon if it's focusable already.
  const listensForFocus = target !== node || node.hasAttribute("tabindex");

  target.addEventListener("pointerenter", onEnter);
  if (listensForFocus) target.addEventListener("focusin", onFocusIn);

  if (play) restart(node);

  return {
    update(params = {}) {
      const previous = play;
      ({ play = false, trigger = "hover" } = params);
      if (play && play !== previous) restart(node);
    },
    destroy() {
      target.removeEventListener("pointerenter", onEnter);
      if (listensForFocus) target.removeEventListener("focusin", onFocusIn);
    },
  };
}

let count = 0;

/** Returns an `id` for a `<mask>` or `<clipPath>` that is unique on the page. */
export const uid = () => `ccs-animated-${++count}`;
