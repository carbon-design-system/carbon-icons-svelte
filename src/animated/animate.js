// Shared runtime for `carbon-icons-svelte/animated`. Copied to `lib/animated/animate.js` by the build.

import { getContext, setContext } from "svelte";

/** Hovering or keyboard-focusing one of these plays an icon inside it. */
const TRIGGER = 'a, button, label, summary, [role="button"], [role="link"], [role="menuitem"], [role="tab"]';

/** Each icon's CSS runs its animation while the `<svg>` has this attribute: `"motion"` or `"fade"`. */
const PLAYING = "data-playing";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const DEFAULTS = "carbon-icons-svelte/animated";

/**
 * Sets defaults for every animated icon in this component and its children,
 * such as icons passed to a component's `icon` prop, which can't take extra
 * props. Call it while the component initializes. Props on an icon win.
 */
export const setAnimatedIconDefaults = (defaults) =>
  setContext(DEFAULTS, { ...getContext(DEFAULTS), ...defaults });

/** Returns the defaults set by `setAnimatedIconDefaults`. */
export const getAnimatedIconDefaults = () => getContext(DEFAULTS) ?? {};

const isRunning = (node) =>
  node.getAnimations?.({ subtree: true }).some((animation) => animation.playState === "running") ?? false;

/** Starts the animation over from its first frame. */
const restart = (node, mode) => {
  node.removeAttribute(PLAYING);
  // Flush styles so that adding the attribute back starts a new animation.
  node.getBoundingClientRect();
  node.setAttribute(PLAYING, mode);
};

/**
 * Svelte action that plays an animated icon.
 *
 * With `trigger: "hover"`, the animation plays when a mouse rests on the
 * icon or its closest interactive ancestor for `hoverDelay` ms, or when that
 * ancestor gets keyboard focus. Sweeping across a toolbar plays nothing.
 * Once started, the animation runs to the end. Pure CSS `:hover` would cut
 * it off and snap back to rest when the pointer leaves.
 *
 * `play` restarts the animation whenever it changes to a truthy value.
 *
 * If the user prefers reduced motion, `reducedMotion` decides what plays:
 * nothing (`"static"`), a gentle fade (`"fade"`), or the full motion (`"full"`).
 */
export function animate(node, options) {
  let { play, trigger, reducedMotion, hoverDelay } = options;
  let timer;

  const target = node.closest(TRIGGER) ?? node;

  const start = () => {
    if (!matchMedia(REDUCED_MOTION).matches || reducedMotion === "full") restart(node, "motion");
    else if (reducedMotion === "fade") restart(node, "fade");
  };

  const startIfIdle = () => {
    if (trigger === "hover" && !isRunning(node)) start();
  };

  const cancel = () => clearTimeout(timer);

  const onEnter = (event) => {
    // Hover is a mouse thing. Touch and pen fire `pointerenter` on tap, just
    // ahead of the click.
    if (event.pointerType !== "mouse") return;
    cancel();
    timer = setTimeout(startIfIdle, hoverDelay);
  };

  const onFocusIn = (event) => {
    if (event.target.matches(":focus-visible")) startIfIdle();
  };

  // Chrome makes an `<svg>` with a focus listener keyboard-focusable, which
  // would add a tab stop. Only listen on the icon if it's focusable already.
  const listensForFocus = target !== node || node.hasAttribute("tabindex");

  target.addEventListener("pointerenter", onEnter);
  target.addEventListener("pointerleave", cancel);
  if (listensForFocus) target.addEventListener("focusin", onFocusIn);

  if (play) start();

  return {
    update(next) {
      const previous = play;
      ({ play, trigger, reducedMotion, hoverDelay } = next);
      if (play && play !== previous) start();
    },
    destroy() {
      cancel();
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", cancel);
      if (listensForFocus) target.removeEventListener("focusin", onFocusIn);
    },
  };
}

let count = 0;

/** Returns a prefix for `<mask>` and `<clipPath>` ids that is unique on the page. */
export const uid = () => `ccs-animated-${++count}`;
