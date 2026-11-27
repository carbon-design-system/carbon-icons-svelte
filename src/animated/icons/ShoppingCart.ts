import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit, standard } = EASING;

/**
 * The basket dips on its wheels, as if something dropped in. The handle
 * reaches the left edge and the wheels the bottom, so the cart can't roll
 * or tip without leaving the canvas.
 * Productive: the basket dips.
 * Expressive: the basket dips, rebounds and settles.
 */
export default {
  name: "ShoppingCart",
  sourceHash: "edbb8f973fb8",
  content: `<circle cx="10" cy="28" r="2" />
  <circle cx="24" cy="28" r="2" />
  <path class="basket" d="M28,7H5.82L5,2.8A1,1,0,0,0,4,2H0V4H3.18L7,23.2A1,1,0,0,0,8,24H26V22H8.82L8,18H26a1,1,0,0,0,1-.78l2-9A1,1,0,0,0,28,7Zm-2.8,9H7.62L6.22,9H26.75Z" />`,
  css: `  ${PRODUCTIVE} .basket {
    animation: dip ${DURATION.slow01};
  }

  ${EXPRESSIVE} .basket {
    animation: drop ${DURATION.slow02};
  }

  @keyframes dip {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(2px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes drop {
    0% {
      transform: translateY(0);
      animation-timing-function: ${exit.expressive};
    }
    30% {
      transform: translateY(2px);
      animation-timing-function: ${standard.expressive};
    }
    55% {
      transform: translateY(-1px);
      animation-timing-function: ${standard.expressive};
    }
    80% {
      transform: translateY(0.4px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
