import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The front sheet moves toward the back sheet and returns.
 * Productive: halfway, 3 units.
 * Expressive: all the way onto the back sheet, then springs out past rest
 * and settles. Offset by (-6, -6), its border covers the back sheet exactly.
 */
export default {
  name: "Copy",
  sourceHash: "28538dbed18f",
  content: `<path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z" />
  <path class="front" d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z" />`,
  css: `  ${PRODUCTIVE} .front {
    animation: stack ${DURATION.slow01};
  }

  ${EXPRESSIVE} .front {
    animation: duplicate ${DURATION.slow02};
  }

  @keyframes stack {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translate(-3px, -3px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes duplicate {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${standard.expressive};
    }
    32%,
    42% {
      transform: translate(-6px, -6px);
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      transform: translate(1px, 1px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translate(0, 0);
    }
  }`,
} satisfies AnimatedIcon;
