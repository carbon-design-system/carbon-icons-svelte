import { restCss, withRest } from "../families.js";
import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

const parts = {
  rest: `<path d="M4,2H2V28a2,2,0,0,0,2,2H30V28H4V25H26V17H4V13H18V5H4ZM24,19v4H4V19ZM16,7v4H4V7Z" />`,
  content: `<path d="M4,2H2V28a2,2,0,0,0,2,2H30V28H4Z" />
  <g class="bar" style="--i: 0">
    <path class="stroke" d="M4,5H18V7H4Z" />
    <path class="stroke" d="M4,11H18V13H4Z" />
    <path class="cap-0" d="M16,5H18V13H16Z" />
  </g>
  <g class="bar" style="--i: 1">
    <path class="stroke" d="M4,17H26V19H4Z" />
    <path class="stroke" d="M4,23H26V25H4Z" />
    <path class="cap-1" d="M24,17H26V25H24Z" />
  </g>`,
};

/**
 * The bars grow out from the axis. Scaling a bar would thin its end, so
 * its long strokes stretch from the axis while its end cap moves with them.
 * The bars are split out of Carbon's path. At rest, Carbon's path shows
 * instead.
 * Productive: the bars stretch a little and come back.
 * Expressive: the bars grow in from the axis, one after the other.
 */
export default {
  name: "ChartBar",
  sourceHash: "944953fa5eb2",
  content: withRest(parts),
  css: `  .stroke {
    transform-box: view-box;
    transform-origin: 4px 0;
  }${restCss(parts)}

  ${PRODUCTIVE} .stroke {
    animation: stretch ${DURATION.slow01};
  }

  ${PRODUCTIVE} .cap-0 {
    animation: stretch-cap-0 ${DURATION.slow01};
  }

  ${PRODUCTIVE} .cap-1 {
    animation: stretch-cap-1 ${DURATION.slow01};
  }

  ${EXPRESSIVE} .stroke {
    animation: grow ${DURATION.slow01} calc(var(--i) * ${DURATION.fast02}) backwards;
  }

  ${EXPRESSIVE} .cap-0 {
    animation: grow-cap-0 ${DURATION.slow01} calc(var(--i) * ${DURATION.fast02}) backwards;
  }

  ${EXPRESSIVE} .cap-1 {
    animation: grow-cap-1 ${DURATION.slow01} calc(var(--i) * ${DURATION.fast02}) backwards;
  }

  @keyframes stretch {
    0% {
      transform: scaleX(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scaleX(1.1);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scaleX(1);
    }
  }

  @keyframes stretch-cap-0 {
    0% {
      transform: translateX(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateX(1.4px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes stretch-cap-1 {
    0% {
      transform: translateX(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateX(2.2px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes grow {
    0% {
      transform: scaleX(0.3);
      animation-timing-function: ${entrance.expressive};
    }
    65% {
      transform: scaleX(1.06);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scaleX(1);
    }
  }

  @keyframes grow-cap-0 {
    0% {
      transform: translateX(-9.8px);
      animation-timing-function: ${entrance.expressive};
    }
    65% {
      transform: translateX(0.84px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes grow-cap-1 {
    0% {
      transform: translateX(-15.4px);
      animation-timing-function: ${entrance.expressive};
    }
    65% {
      transform: translateX(1.32px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateX(0);
    }
  }`,
} satisfies AnimatedIcon;
