import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Nudges the way it points.
 * Productive: 3 units out and back.
 * Expressive: 5 units out, springs back past rest, and settles.
 */
export default {
  name: "ChevronRight",
  sourceHash: "de3ce9bcd5df",
  content: `<path class="chevron" d="M22 16 12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .chevron {
      animation: nudge ${DURATION.slow01};
    }

    ${EXPRESSIVE} .chevron {
      animation: nudge-spring ${DURATION.slow02};
    }
  }

  @keyframes nudge {
    0% {
      transform: translateX(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateX(3px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes nudge-spring {
    0% {
      transform: translateX(0);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: translateX(5px);
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: translateX(-1px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateX(0);
    }
  }`,
} satisfies AnimatedIcon;
