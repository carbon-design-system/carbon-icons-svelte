import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Turns a quarter. The plus looks the same every 90°, so it ends where it started.
 * Productive: a plain quarter turn.
 * Expressive: overshoots by 10° and settles back.
 */
export default {
  name: "Add",
  sourceHash: "cb9b320a5f82",
  content: `<path class="plus" d="M17 15 17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z" />`,
  css: `  .plus {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .plus {
      animation: turn ${DURATION.slow01} ${standard.productive};
    }

    ${EXPRESSIVE} .plus {
      animation: turn-overshoot ${DURATION.slow02};
    }
  }

  @keyframes turn {
    to {
      transform: rotate(90deg);
    }
  }

  @keyframes turn-overshoot {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    70% {
      transform: rotate(100deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(90deg);
    }
  }`,
} satisfies AnimatedIcon;
