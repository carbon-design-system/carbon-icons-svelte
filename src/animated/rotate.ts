import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "./shared.js";

const { entrance, standard } = EASING;

interface RotateIcon {
  name: string;
  sourceHash: string;
  /** `d` of the square, which turns. */
  square: string;
  /** `d` of the arrow, which pushes in expressive mode. */
  arrow: string;
  /** Centre of the square. */
  origin: [x: number, y: number];
  /** 1 is clockwise. */
  direction: 1 | -1;
  /** Which way the arrowhead points, in units. */
  push: [x: number, y: number];
}

/**
 * The `Rotate*` icons: the square turns a quarter about its own centre. A
 * square looks the same every 90°, so it ends where it started. Turned 45°,
 * its corners would leave the canvas, so it shrinks mid-turn.
 *
 * Productive: the square turns.
 * Expressive: the arrow pushes the way it points, then the square turns,
 * overshoots by 8° and settles.
 */
export const rotateIcon = ({ name, sourceHash, square, arrow, origin, direction, push }: RotateIcon): AnimatedIcon => ({
  name,
  sourceHash,
  content: `<path class="square" d="${square}" />
  <path class="arrow" d="${arrow}" />`,
  css: `  .square {
    transform-box: view-box;
    transform-origin: ${origin[0]}px ${origin[1]}px;
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
      rotate: ${direction * 90}deg;
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
      transform: translate(${push[0]}px, ${push[1]}px);
      animation-timing-function: ${standard.expressive};
    }
    50%,
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes turn-overshoot {
    0%,
    20% {
      rotate: 0deg;
      animation-timing-function: ${entrance.expressive};
    }
    80% {
      rotate: ${direction * 98}deg;
      animation-timing-function: ${standard.expressive};
    }
    100% {
      rotate: ${direction * 90}deg;
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
});
