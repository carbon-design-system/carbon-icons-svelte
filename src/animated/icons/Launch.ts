import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The arrow nudges up and right, out of its box, which stays still. It
 * reaches the canvas corner, so it moves 2 units at most.
 * Productive: nudges out and back.
 * Expressive: nudges further, springs back past rest, and settles.
 */
export default {
  name: "Launch",
  sourceHash: "e06e1ac27673",
  content: `<path d="M26,28H6a2.0027,2.0027,0,0,1-2-2V6A2.0027,2.0027,0,0,1,6,4H16V6H6V26H26V16h2V26A2.0027,2.0027,0,0,1,26,28Z" />
  <path class="arrow" d="M20 2 20 4 26.586 4 18 12.586 19.414 14 28 5.414 28 12 30 12 30 2 20 2z" />`,
  css: `  ${PRODUCTIVE} .arrow {
    animation: nudge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .arrow {
    animation: nudge-spring ${DURATION.slow02};
  }

  @keyframes nudge {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translate(1.5px, -1.5px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes nudge-spring {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: translate(2px, -2px);
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: translate(-0.75px, 0.75px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translate(0, 0);
    }
  }`,
} satisfies AnimatedIcon;
