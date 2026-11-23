import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The magnifier looks around.
 * Productive: drifts up-left and back.
 * Expressive: drifts up-left, across to the right, and settles.
 */
export default {
  name: "Search",
  sourceHash: "571ad3b45cee",
  content: `<path class="glass" d="M29,27.5859l-7.5521-7.5521a11.0177,11.0177,0,1,0-1.4141,1.4141L27.5859,29ZM4,13a9,9,0,1,1,9,9A9.01,9.01,0,0,1,4,13Z" />`,
  css: `  ${PRODUCTIVE} .glass {
    animation: drift ${DURATION.slow01};
  }

  ${EXPRESSIVE} .glass {
    animation: look ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes drift {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translate(-2px, -1.5px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translate(0, 0);
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
