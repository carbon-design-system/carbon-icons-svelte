import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Draws itself in. The check is a filled shape, so it can't be drawn with a
 * stroke. A stroke along its centreline masks it instead, which reveals
 * Carbon's exact fill. The stroke overshoots both ends and is wide enough
 * to cover the fill.
 * Productive: draws in.
 * Expressive: draws in, then pops to 1.1× and settles.
 */
export default {
  name: "Checkmark",
  sourceHash: "e0acef5810ff",
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <path class="ink" d="M3 12.586 13 22.586 29 6.586" fill="none" stroke="#fff" stroke-width="4" pathLength="1" stroke-dasharray="1 1" />
  </mask>
  <path class="check" mask="url(#{id}-ink)" d="M13 24 4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z" />`,
  css: `  .check {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .ink {
      animation: draw ${DURATION.slow01} ${entrance.productive} both;
    }

    ${EXPRESSIVE} .ink {
      animation: draw-hold ${DURATION.slow02} both;
    }

    ${EXPRESSIVE} .check {
      animation: pop ${DURATION.slow02};
    }
  }

  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes draw-hold {
    0% {
      stroke-dashoffset: 1;
      animation-timing-function: ${entrance.expressive};
    }
    55%,
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes pop {
    0%,
    50% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    72% {
      transform: scale(1.1);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
} satisfies AnimatedIcon;
