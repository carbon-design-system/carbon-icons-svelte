import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The rays grow out from the centre. Four rays carry a `transform`
 * attribute, which a CSS `transform` would replace, so each ray is wrapped
 * in a `<g>` that animates.
 * Productive: all rays pulse out together.
 * Expressive: the rays dim, then light up one by one clockwise from the top.
 */
export default {
  name: "Light",
  sourceHash: "5bcea64347b3",
  content: `<g class="ray" style="--i: 0"><path d="M15 2H17V7H15z" /></g>
  <g class="ray" style="--i: 1"><path d="M21.668 6.854H26.625999999999998V8.854H21.668z" transform="rotate(-45 24.147 7.853)" /></g>
  <g class="ray" style="--i: 2"><path d="M25 15H30V17H25z" /></g>
  <g class="ray" style="--i: 3"><path d="M23.147 21.668H25.147V26.625999999999998H23.147z" transform="rotate(-45 24.147 24.146)" /></g>
  <g class="ray" style="--i: 4"><path d="M15 25H17V30H15z" /></g>
  <g class="ray" style="--i: 5"><path d="M5.375 23.147H10.333V25.147H5.375z" transform="rotate(-45 7.853 24.146)" /></g>
  <g class="ray" style="--i: 6"><path d="M2 15H7V17H2z" /></g>
  <g class="ray" style="--i: 7"><path d="M6.854 5.375H8.854V10.333H6.854z" transform="rotate(-45 7.854 7.853)" /></g>
  <path d="M16,12a4,4,0,1,1-4,4,4.0045,4.0045,0,0,1,4-4m0-2a6,6,0,1,0,6,6,6,6,0,0,0-6-6Z" />`,
  css: `  .ray {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .ray {
      animation: pulse ${DURATION.slow01};
    }

    ${EXPRESSIVE} .ray {
      animation: radiate ${DURATION.moderate01} ${entrance.expressive} calc(var(--i) * ${DURATION.fast01}) backwards;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.12);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes radiate {
    from {
      opacity: 0.15;
      transform: scale(0.8);
    }
  }`,
} satisfies AnimatedIcon;
