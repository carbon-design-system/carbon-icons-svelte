import { getContext, setContext } from "svelte";

/** Hovering or keyboard-focusing one of these plays an icon inside it. */
const TRIGGER = 'a, button, label, summary, [role="button"], [role="link"], [role="menuitem"], [role="tab"]';

const PLAYING = "data-playing";

// The build fills in Carbon's tokens from `src/animated/shared.ts`.
const FADE = {
  productive: { duration: __DURATION_SLOW_01__, easing: __EASING_STANDARD_PRODUCTIVE__ },
  expressive: { duration: __DURATION_SLOW_02__, easing: __EASING_STANDARD_EXPRESSIVE__ },
};

const HOVER_DELAY = __DURATION_MODERATE_01__;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const DEFAULTS = "carbon-icons-svelte/animated";

export const setAnimatedIconDefaults = (defaults) =>
  setContext(DEFAULTS, { ...getContext(DEFAULTS), ...defaults });

export const getAnimatedIconDefaults = () => getContext(DEFAULTS) ?? {};

const isRunning = (node) =>
  node.getAnimations?.({ subtree: true }).some((animation) => animation.playState === "running") ?? false;

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
 * Plays an animated icon. Once started, an animation runs to the end, where
 * CSS `:hover` would snap back to rest when the pointer leaves.
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
    // Touch and pen fire `pointerenter` on tap, which isn't hover.
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

export const uid = () => `ccs-animated-${++count}`;
