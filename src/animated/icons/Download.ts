import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit, standard } = EASING;

/**
 * The clip is on a wrapper so it stays put while the arrow moves. Mirrors `Upload`.
 * Productive: the arrow dips 3 units into the tray and back.
 * Expressive: the arrow falls into the tray, which dips as it lands, then a
 * new arrow drops in from the top.
 */
export default {
  name: "Download",
  sourceHash: "9a31c81c721f",
  content: `<clipPath id="{id}-clip">
    <rect width="32" height="24" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14z" />
  </g>
  <path class="tray" d="M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .arrow {
      animation: nudge ${DURATION.slow01};
    }

    ${EXPRESSIVE} .arrow {
      animation: pass ${DURATION.slow02};
    }

    ${EXPRESSIVE} .tray {
      animation: catch ${DURATION.slow02};
    }
  }

  @keyframes nudge {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(3px);
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
      transform: translateY(24px);
      animation-timing-function: step-end;
    }
    40.1% {
      transform: translateY(-24px);
      animation-timing-function: ${entrance.expressive};
    }
    85% {
      transform: translateY(1px);
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
      transform: translateY(1.5px);
      animation-timing-function: ${standard.expressive};
    }
    70%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
