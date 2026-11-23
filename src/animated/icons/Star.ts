import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Turns one point (72°; the star has five), so it ends where it started.
 * It shrinks slightly mid-turn so its points stay inside the canvas.
 * `rotate` and `scale` are separate properties, so each has its own easing.
 * Productive: a plain turn.
 * Expressive: overshoots by 8° and settles back.
 */
export default {
  name: "Star",
  sourceHash: "0f9dad2cc024",
  content: `<path class="star" d="M16,6.52l2.76,5.58.46,1,1,.15,6.16.89L22,18.44l-.75.73.18,1,1.05,6.13-5.51-2.89L16,23l-.93.49L9.56,26.34l1-6.13.18-1L10,18.44,5.58,14.09l6.16-.89,1-.15.46-1L16,6.52M16,2l-4.55,9.22L1.28,12.69l7.36,7.18L6.9,30,16,25.22,25.1,30,23.36,19.87l7.36-7.17L20.55,11.22Z" />`,
  css: `  .star {
    transform-box: view-box;
    transform-origin: 16px 17.48px;
  }

  ${PRODUCTIVE} .star {
    animation: turn ${DURATION.slow01} ${standard.productive},
      shrink ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .star {
    animation: turn-overshoot ${DURATION.slow02},
      shrink ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes turn {
    to {
      rotate: 72deg;
    }
  }

  @keyframes turn-overshoot {
    0% {
      rotate: 0deg;
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      rotate: 80deg;
      animation-timing-function: ${standard.expressive};
    }
    100% {
      rotate: 72deg;
    }
  }

  @keyframes shrink {
    50% {
      scale: 0.9;
    }
  }`,
} satisfies AnimatedIcon;
