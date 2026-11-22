import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit, standard } = EASING;

/**
 * The lid and handle tilt up from the lid's left end. 7° is the most before
 * the handle leaves the canvas.
 * Productive: tilts and closes.
 * Expressive: tilts, holds, drops shut, and rebounds slightly.
 */
export default {
  name: "TrashCan",
  sourceHash: "efec8fd2c4e7",
  content: `<path d="M12 12H14V24H12z" />
  <path d="M18 12H20V24H18z" />
  <path d="M6,8V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8H24V28H8V8Z" />
  <g class="lid">
    <path d="M4 6H28V8H4z" />
    <path d="M12 2H20V4H12z" />
  </g>`,
  css: `  .lid {
    transform-box: view-box;
    transform-origin: 4px 8px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .lid {
      animation: tip ${DURATION.slow01};
    }

    ${EXPRESSIVE} .lid {
      animation: tip-shut ${DURATION.slow02};
    }
  }

  @keyframes tip {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.productive};
    }
    45% {
      transform: rotate(-7deg);
      animation-timing-function: ${exit.productive};
    }
    100% {
      transform: rotate(0);
    }
  }

  @keyframes tip-shut {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    30%,
    50% {
      transform: rotate(-7deg);
      animation-timing-function: ${exit.expressive};
    }
    70% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    82% {
      transform: rotate(-1.5deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(0);
    }
  }`,
} satisfies AnimatedIcon;
