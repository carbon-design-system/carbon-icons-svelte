import { getContext, setContext } from "svelte";

/** Hovering or keyboard-focusing one of these plays an icon inside it. */
const TRIGGER = 'a, button, label, summary, [role="button"], [role="link"], [role="menuitem"], [role="tab"]';

const PLAYING = "data-playing";

const DISABLED = ':disabled, [aria-disabled="true"]';

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

/** Page-wide defaults, for icons outside any component that sets them. */
let pageDefaults = {};

/** Sets defaults for every animated icon on the page. Later calls merge into earlier ones. */
export const configureAnimatedIcons = (defaults) => {
  pageDefaults = { ...pageDefaults, ...defaults };
};

/** Data attributes on an ancestor element that set defaults for the icons inside it. */
const ATTRIBUTES = {
  motion: "data-animated-motion",
  trigger: "data-animated-trigger",
  reducedMotion: "data-animated-reduced-motion",
  hoverDelay: "data-animated-hover-delay",
};

const FALLBACKS = { motion: "productive", trigger: "hover", reducedMotion: "static", hoverDelay: HOVER_DELAY };

/** Like `closest`, but continues past a shadow root to its host. */
const closestAcross = (node, selector) => {
  for (let element = node; element; ) {
    const found = element.closest(selector);
    if (found) return found;
    const root = element.getRootNode();
    element = root instanceof ShadowRoot ? root.host : null;
  }
  return null;
};

const restart = (node) => {
  // Mid-animation, flush styles so that adding the attribute back starts a
  // new one. Only then: a flush per icon is slow when many start at once.
  if (node.hasAttribute(PLAYING)) {
    node.removeAttribute(PLAYING);
    node.getBoundingClientRect();
  }
  node.setAttribute(PLAYING, "motion");
};

const fade = (node, iterations = 1) => {
  const { duration, easing } = FADE[node.dataset.motion] ?? FADE.productive;
  return node.animate([{ opacity: 1, easing }, { opacity: 0.4, easing }, { opacity: 1 }], { duration, iterations });
};

/**
 * Plays an animated icon. Once started, an animation runs to the end, where
 * CSS `:hover` would snap back to rest when the pointer leaves.
 */
export function animate(node, options) {
  let play, loop, loops, props, contextDefaults;
  let timer;
  let fading;
  let observer;
  let hidden = false;
  let paused = [];

  const resolve = ({ defaults = {}, ...next }) => {
    props = next;
    contextDefaults = defaults;
    loops = props.loops;
    play = props.play;
    loop = loops && props.loop;
  };

  // A prop wins, then defaults from Svelte context, then the nearest ancestor
  // with a data attribute, then `configureAnimatedIcons`. Context comes before
  // the DOM so an icon portaled elsewhere in the page keeps its component's
  // defaults. Read each time an icon plays, so changes to an attribute or the
  // page defaults apply to the next play.
  const setting = (key) => {
    const value = props[key] ?? contextDefaults[key];
    if (value !== undefined) return value;
    const attribute = ATTRIBUTES[key];
    const ancestor = closestAcross(node, `[${attribute}]`);
    if (ancestor) {
      const raw = ancestor.getAttribute(attribute);
      return key === "hoverDelay" ? Number(raw) : raw;
    }
    return pageDefaults[key] ?? FALLBACKS[key];
  };

  // The template renders `data-motion` from props and context; the runtime
  // updates it from the page before each play.
  const applyMotion = () => node.setAttribute("data-motion", setting("motion"));

  resolve(options);

  const target = closestAcross(node, TRIGGER) ?? node;

  const moves = () => !matchMedia(REDUCED_MOTION).matches || setting("reducedMotion") === "full";

  const start = () => {
    applyMotion();
    if (moves()) restart(node);
    else if (setting("reducedMotion") === "fade") fading = fade(node);
  };

  // Browsers keep animating an SVG that's scrolled out of view, on the main
  // thread in Chrome, so a loop pauses while the icon can't be seen.
  const watch = () => {
    if (observer || typeof IntersectionObserver === "undefined") return;
    observer = new IntersectionObserver(([entry]) => {
      hidden = !entry.isIntersecting;
      if (hidden && !loop) {
        stopHidden();
      } else if (hidden) {
        paused = node.getAnimations({ subtree: true }).filter((a) => a.playState === "running");
        paused.forEach((a) => a.pause());
      } else {
        paused.forEach((a) => a.play());
        paused = [];
      }
    });
    observer.observe(node);
  };

  const unwatch = () => {
    observer?.disconnect();
    observer = undefined;
    hidden = false;
    paused = [];
  };

  const startLoop = () => {
    cancel();
    applyMotion();
    if (moves()) node.setAttribute(PLAYING, "loop");
    else if (setting("reducedMotion") === "fade") fading = fade(node, Infinity);
    watch();
  };

  // Out of view, nobody sees a loop snap to rest, and a paused cycle would
  // never finish.
  const stopHidden = () => {
    node.removeAttribute(PLAYING);
    fading?.cancel();
    unwatch();
  };

  // Finish the current cycle, then stop at rest, so a loop never snaps.
  const stopLoop = () => {
    if (hidden) return stopHidden();
    if (node.getAttribute(PLAYING) === "loop") {
      const stop = () => {
        node.removeEventListener("animationiteration", stop);
        if (!loop) {
          node.removeAttribute(PLAYING);
          unwatch();
        }
      };
      node.addEventListener("animationiteration", stop);
    }
    if (fading?.effect.getTiming().iterations === Infinity) {
      fading.effect.updateTiming({ iterations: fading.effect.getComputedTiming().currentIteration + 1 });
      const finishing = fading;
      const done = () => fading === finishing && unwatch();
      fading.finished.then(done, done);
    }
  };

  const isPlaying = () => node.hasAttribute(PLAYING) || fading?.playState === "running";

  const startIfIdle = () => {
    if (setting("trigger") !== "hover" || isPlaying()) return;
    if (target !== node && target.matches(DISABLED)) return;
    start();
  };

  // Clear the attribute once every part has finished, so a later change to
  // `motion` doesn't start the other mode's animation on its own. Other
  // animations on the icon, like a color transition, don't count.
  const onAnimationEnd = () => {
    const running = node.getAnimations({ subtree: true }).some((a) => "animationName" in a && a.playState === "running");
    if (!running) node.removeAttribute(PLAYING);
  };

  const cancel = () => clearTimeout(timer);

  const onEnter = (event) => {
    // Touch and pen fire `pointerenter` on tap, which isn't hover.
    if (event.pointerType !== "mouse") return;
    cancel();
    timer = setTimeout(startIfIdle, setting("hoverDelay"));
  };

  // Only focus on the trigger itself counts: a text input inside a label
  // matches `:focus-visible` even when clicked.
  const onFocusIn = (event) => {
    if (event.target === target && target.matches(":focus-visible")) startIfIdle();
  };

  // Chrome makes an `<svg>` with a focus listener keyboard-focusable, which
  // would add a tab stop. Only listen on the icon if it's focusable already.
  const listensForFocus = target !== node || node.hasAttribute("tabindex");

  target.addEventListener("pointerenter", onEnter);
  target.addEventListener("pointerleave", cancel);
  if (listensForFocus) target.addEventListener("focusin", onFocusIn);
  node.addEventListener("animationend", onAnimationEnd);
  node.addEventListener("animationcancel", onAnimationEnd);

  if (loop) startLoop();
  else if (play) start();

  return {
    update(next) {
      const previous = { play, loop };
      resolve(next);
      if (loop && !previous.loop) startLoop();
      else if (!loop && previous.loop) stopLoop();
      else if (!loop && play && play !== previous.play) start();
    },
    destroy() {
      cancel();
      unwatch();
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", cancel);
      if (listensForFocus) target.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("animationend", onAnimationEnd);
      node.removeEventListener("animationcancel", onAnimationEnd);
    },
  };
}

let count = 0;

export const uid = () => `ccs-animated-${++count}`;
