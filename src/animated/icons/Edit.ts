import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The pencil pivots on its tip; the line stays put.
 * Productive: tilts back once.
 * Expressive: scribbles three strokes to the right, then returns.
 */
export default {
  name: "Edit",
  sourceHash: "c97a4ed911a1",
  content: `<path d="M2 26H30V28H2z" />
  <path class="pencil" d="M25.4,9c0.8-0.8,0.8-2,0-2.8c0,0,0,0,0,0l-3.6-3.6c-0.8-0.8-2-0.8-2.8,0c0,0,0,0,0,0l-15,15V24h6.4L25.4,9z M20.4,4L24,7.6	l-3,3L17.4,7L20.4,4z M6,22v-3.6l10-10l3.6,3.6l-10,10H6z" />`,
  css: `  .pencil {
    transform-box: view-box;
    transform-origin: 5px 23px;
  }

  ${PRODUCTIVE} .pencil {
    animation: tilt ${DURATION.slow01};
  }

  ${EXPRESSIVE} .pencil {
    animation: scribble ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes tilt {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: rotate(-6deg);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: rotate(0);
    }
  }

  @keyframes scribble {
    20% {
      transform: translateX(1px) rotate(-6deg);
    }
    40% {
      transform: translateX(2px) rotate(4deg);
    }
    60% {
      transform: translateX(3px) rotate(-4deg);
    }
    80% {
      transform: translateX(1.5px) rotate(2deg);
    }
  }`,
} satisfies AnimatedIcon;
