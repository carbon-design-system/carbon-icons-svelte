import { PLAYING, type AnimatedIcon } from "../shared.js";

/** Looks around: the magnifier drifts up-left, across to the right, and settles. */
export default {
  name: "Search",
  sourceHash: "571ad3b45cee",
  content: `<path class="glass" d="M29,27.5859l-7.5521-7.5521a11.0177,11.0177,0,1,0-1.4141,1.4141L27.5859,29ZM4,13a9,9,0,1,1,9,9A9.01,9.01,0,0,1,4,13Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .glass {
      animation: look 900ms ease-in-out;
    }
  }

  @keyframes look {
    25% {
      transform: translate(-2px, -1.5px);
    }
    60% {
      transform: translate(2px, -1px);
    }
    82% {
      transform: translate(-0.5px, 0.5px);
    }
  }`,
} satisfies AnimatedIcon;
