import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { standard } = EASING;

/**
 * The bars breathe from their left ends, one after another, top to bottom.
 * Productive: a quick ripple.
 * Expressive: a slower, deeper ripple that overshoots and settles.
 */
export default {
  name: "Menu",
  sourceHash: "c38423a50fa8",
  content: `<path class="bar" style="--i: 0; transform-origin: 4px 7px" d="M4 6H28V8H4z" />
  <path class="bar" style="--i: 3; transform-origin: 4px 25px" d="M4 24H28V26H4z" />
  <path class="bar" style="--i: 1; transform-origin: 4px 13px" d="M4 12H28V14H4z" />
  <path class="bar" style="--i: 2; transform-origin: 4px 19px" d="M4 18H28V20H4z" />`,
  css: `  .bar {
    transform-box: view-box;
  }

  ${PRODUCTIVE} .bar {
    animation: breathe ${DURATION.moderate01} ${standard.productive} calc(var(--i) * ${DURATION.fast01});
  }

  ${EXPRESSIVE} .bar {
    animation: breathe-deep ${DURATION.slow01} ${standard.expressive} calc(var(--i) * ${DURATION.fast01});
  }

  @keyframes breathe {
    50% {
      transform: scaleX(0.7);
    }
  }

  @keyframes breathe-deep {
    40% {
      transform: scaleX(0.55);
    }
    70% {
      transform: scaleX(1.04);
    }
  }`,
} satisfies AnimatedIcon;
