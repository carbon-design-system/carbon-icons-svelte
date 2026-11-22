import { PLAYING, type AnimatedIcon } from "../shared.js";

/** Nudges 4 units the way it points, then springs back past rest and settles. */
export default {
  name: "ChevronRight",
  sourceHash: "de3ce9bcd5df",
  content: `<path class="chevron" d="M22 16 12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .chevron {
      animation: nudge 480ms;
    }
  }

  @keyframes nudge {
    0% {
      transform: translateX(0);
      animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
    }
    38% {
      transform: translateX(4px);
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    100% {
      transform: translateX(0);
    }
  }`,
} satisfies AnimatedIcon;
