import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The bar squeezes in from both ends and comes back.
 * Productive: squeezes to 70%.
 * Expressive: squeezes to 60%, overshoots and settles.
 */
export default {
  name: "Subtract",
  sourceHash: "8fc740ee0994",
  content: `<path class="bar" d="M8 15H24V17H8z" />`,
  css: `  .bar {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  ${PRODUCTIVE} .bar {
    animation: squeeze ${DURATION.slow01};
  }

  ${EXPRESSIVE} .bar {
    animation: squeeze-spring ${DURATION.slow02};
  }

  @keyframes squeeze {
    0% {
      transform: scaleX(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scaleX(0.7);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scaleX(1);
    }
  }

  @keyframes squeeze-spring {
    0% {
      transform: scaleX(1);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: scaleX(0.6);
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: scaleX(1.08);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scaleX(1);
    }
  }`,
} satisfies AnimatedIcon;
