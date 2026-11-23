import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The square turns a quarter clockwise about its own centre. A square looks the
 * same every 90°, so it ends where it started. Turned 45°, its corners would
 * leave the canvas, so it shrinks mid-turn.
 * Productive: the square turns.
 * Expressive: the arrow pushes down, then the square turns, overshoots by 8° and settles.
 */
export default {
  name: "RotateClockwiseAltFilled",
  sourceHash: "13284a557242",
  content: `<path class="square" d="M16,30H4a2.0023,2.0023,0,0,1-2-2V16a2.0023,2.0023,0,0,1,2-2H16a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,16,30Z" />
  <path class="arrow" d="M30,15l-1.41-1.41L26,16.17V11a7.0078,7.0078,0,0,0-7-7H14V6h5a5.0057,5.0057,0,0,1,5,5v5.17l-2.59-2.58L20,15l5,5Z" />`,
  css: `  .square {
    transform-box: view-box;
    transform-origin: 10px 22px;
  }

  ${PRODUCTIVE} .square {
    animation:
      turn ${DURATION.slow01} ${standard.productive},
      shrink ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .arrow {
    animation: push ${DURATION.slow02};
  }

  ${EXPRESSIVE} .square {
    animation:
      turn-overshoot ${DURATION.slow02},
      shrink-hold ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes turn {
    to {
      rotate: 90deg;
    }
  }

  @keyframes shrink {
    50% {
      scale: 0.85;
    }
  }

  @keyframes push {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.expressive};
    }
    25% {
      transform: translate(0px, 2px);
      animation-timing-function: ${standard.expressive};
    }
    50%,
    100% {
      transform: translate(0, 0);
    }
  }

  /* Waits for the push, then turns. */
  @keyframes turn-overshoot {
    0%,
    20% {
      rotate: 0deg;
      animation-timing-function: ${entrance.expressive};
    }
    80% {
      rotate: 98deg;
      animation-timing-function: ${standard.expressive};
    }
    100% {
      rotate: 90deg;
    }
  }

  @keyframes shrink-hold {
    0%,
    20% {
      scale: 1;
    }
    32%,
    88% {
      scale: 0.85;
    }
  }`,
} satisfies AnimatedIcon;
