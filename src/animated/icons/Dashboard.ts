import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The bars grow up from the bottom of the panel, in turn. They're solid,
 * so stretching them keeps their weight.
 * Productive: the bars rise a little and come back.
 * Expressive: the bars grow in from the bottom, one after the other, and
 * settle.
 */
export default {
  name: "Dashboard",
  sourceHash: "1a12d2906698",
  content: `<path class="bar" style="--i: 0" d="M20 16H22V26H20z" />
  <path class="bar" style="--i: 1" d="M24 21H26V26H24z" />
  <path d="M11,26a5.0059,5.0059,0,0,1-5-5H8a3,3,0,1,0,3-3V16a5,5,0,0,1,0,10Z" />
  <path d="M28,2H4A2.002,2.002,0,0,0,2,4V28a2.0023,2.0023,0,0,0,2,2H28a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,28,2Zm0,9H14V4H28ZM12,4v7H4V4ZM4,28V13H28.0007l.0013,15Z" />`,
  css: `  .bar {
    transform-box: view-box;
    transform-origin: 0 26px;
  }

  ${PRODUCTIVE} .bar {
    animation: rise ${DURATION.slow01};
  }

  ${EXPRESSIVE} .bar {
    animation: grow ${DURATION.slow01} calc(var(--i) * ${DURATION.fast02}) backwards;
  }

  @keyframes rise {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scaleY(1.15);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scaleY(1);
    }
  }

  @keyframes grow {
    0% {
      transform: scaleY(0.2);
      animation-timing-function: ${entrance.expressive};
    }
    65% {
      transform: scaleY(1.08);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scaleY(1);
    }
  }`,
} satisfies AnimatedIcon;
