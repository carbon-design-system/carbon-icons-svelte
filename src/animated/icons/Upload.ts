import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit, standard } = EASING;

/**
 * The clip is on a wrapper so it stays put while the arrow moves. It starts
 * at the bracket's top bar, not its open end, so the arrowhead can rise into
 * the bracket without being cut off. Mirrors `Download`.
 * Productive: the arrow rises 3 units into the bracket and back.
 * Expressive: the arrow rises into the bracket, which lifts as it arrives,
 * then a new arrow rises in from the bottom edge.
 */
export default {
  name: "Upload",
  sourceHash: "e495e777d9ff",
  content: `<clipPath id="{id}-clip">
    <rect y="4" width="32" height="28" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M6 18 7.41 19.41 15 11.83 15 30 17 30 17 11.83 24.59 19.41 26 18 16 8 6 18z" />
  </g>
  <path class="bracket" d="M6,8V4H26V8h2V4a2,2,0,0,0-2-2H6A2,2,0,0,0,4,4V8Z" />`,
  css: `  ${PRODUCTIVE} .arrow {
    animation: nudge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .arrow {
    animation: pass ${DURATION.slow02};
  }

  ${EXPRESSIVE} .bracket {
    animation: catch ${DURATION.slow02};
  }

  @keyframes nudge {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(-3px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes pass {
    0% {
      transform: translateY(0);
      animation-timing-function: ${exit.expressive};
    }
    40% {
      transform: translateY(-24px);
      animation-timing-function: step-end;
    }
    40.1% {
      transform: translateY(24px);
      animation-timing-function: ${entrance.expressive};
    }
    85% {
      transform: translateY(-1px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes catch {
    0%,
    36% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    46% {
      transform: translateY(-1.5px);
      animation-timing-function: ${standard.expressive};
    }
    70%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
