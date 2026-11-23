// Shared runtime for `carbon-icons-svelte/animated`. Copied to `lib/animated/animate.js` by the build.

import { getContext, setContext } from "svelte";

/** Hovering or keyboard-focusing one of these plays an icon inside it. */
const TRIGGER = 'a, button, label, summary, [role="button"], [role="link"], [role="menuitem"], [role="tab"]';

/** Each icon's CSS runs its animation while the `<svg>` has `data-playing="motion"`. */
const PLAYING = "data-playing";

/**
 * What plays for users who prefer reduced motion with `reducedMotion="fade"`:
 * the icon dims and comes back, without moving. The build fills in Carbon's
 * durations and easings from `src/animated/shared.ts`.
 */
const FADE = {
  productive: { duration: __DURATION_SLOW_01__, easing: __EASING_STANDARD_PRODUCTIVE__ },
  expressive: { duration: __DURATION_SLOW_02__, easing: __EASING_STANDARD_EXPRESSIVE__ },
};

/** How long, in ms, a mouse rests on the trigger before the icon plays: Carbon's moderate-01. */
const HOVER_DELAY = __DURATION_MODERATE_01__;

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

/** Starts the motion over from its first frame. */
const restart = (node) => {
  node.removeAttribute(PLAYING);
  // Flush styles so that adding the attribute back starts a new animation.
  node.getBoundingClientRect();
  node.setAttribute(PLAYING, "motion");
};

const fade = (node) => {
  const { duration, easing } = FADE[node.dataset.motion] ?? FADE.productive;
  node.animate([{ opacity: 1, easing }, { opacity: 0.4, easing }, { opacity: 1 }], duration);
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
 *
 * Props left `undefined` fall back to `defaults`, from `setAnimatedIconDefaults`.
 */
export function animate(node, options) {
  let play, trigger, reducedMotion, hoverDelay;
  let timer;

  const resolve = ({ defaults = {}, ...props }) => {
    play = props.play;
    trigger = props.trigger ?? defaults.trigger ?? "hover";
    reducedMotion = props.reducedMotion ?? defaults.reducedMotion ?? "static";
    hoverDelay = props.hoverDelay ?? defaults.hoverDelay ?? HOVER_DELAY;
  };

  resolve(options);

  const target = node.closest(TRIGGER) ?? node;

  const start = () => {
    if (!matchMedia(REDUCED_MOTION).matches || reducedMotion === "full") restart(node);
    else if (reducedMotion === "fade") fade(node);
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
      resolve(next);
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
