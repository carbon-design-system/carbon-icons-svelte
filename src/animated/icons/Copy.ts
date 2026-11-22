import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The front sheet slides back onto the back sheet, then springs out again.
 * Offset by (-6, -6), its border covers the back sheet exactly.
 */
export default {
  name: "Copy",
  sourceHash: "28538dbed18f",
  content: `<path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z" />
  <path class="front" d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .front {
      animation: duplicate 700ms;
    }
  }

  @keyframes duplicate {
    0% {
      transform: translate(0, 0);
      animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
    }
    32%,
    40% {
      transform: translate(-6px, -6px);
      animation-timing-function: cubic-bezier(0.34, 1.45, 0.64, 1);
    }
    100% {
      transform: translate(0, 0);
    }
  }`,
} satisfies AnimatedIcon;
