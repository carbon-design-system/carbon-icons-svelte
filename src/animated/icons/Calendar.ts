import { restCss, withRest } from "../families.js";
import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

const parts = {
  rest: `<path d="M26,4h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20	V26z M26,10H6V6h4v2h2V6h8v2h2V6h4V10z" />`,
  content: `<path d="M26,4H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20V26z M26,10H6V6h20V10z" />
  <path class="tab" style="--i: 0" d="M10,2h2v6h-2z" />
  <path class="tab" style="--i: 1" d="M20,2h2v6h-2z" />`,
};

/**
 * The binder rings hop, one after the other, like a page about to turn.
 * The rings are split out of Carbon's path as two bars. At rest, Carbon's
 * path shows instead.
 * Productive: the rings lift together, the second just behind.
 * Expressive: the rings hop in turn and bounce as they land.
 */
export default {
  name: "Calendar",
  sourceHash: "b78ef5c7e3a3",
  content: withRest(parts),
  css: `  .tab {
    transform-box: view-box;
  }${restCss(parts)}

  ${PRODUCTIVE} .tab {
    animation: lift ${DURATION.moderate02} calc(var(--i) * ${DURATION.fast01});
  }

  ${EXPRESSIVE} .tab {
    animation: hop ${DURATION.slow01} calc(var(--i) * ${DURATION.fast02});
  }

  @keyframes lift {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    50% {
      transform: translateY(-1.5px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes hop {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    40% {
      transform: translateY(-2px);
      animation-timing-function: ${standard.expressive};
    }
    70% {
      transform: translateY(0.5px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
