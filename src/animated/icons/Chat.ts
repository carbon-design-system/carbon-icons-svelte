import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The bubble pops from its tail, and in expressive mode its lines retract
 * and type back out, one after the other.
 * Productive: the bubble pops.
 * Expressive: a bigger pop that settles, with the lines retyping.
 */
export default {
  name: "Chat",
  sourceHash: "7deffeb641cc",
  content: `<g class="bubble">
    <path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z" />
    <path class="line" style="transform-origin: 8px 11px" d="M8 10H24V12H8z" />
    <path class="line second" style="transform-origin: 8px 17px" d="M8 16H18V18H8z" />
  </g>`,
  css: `  .bubble {
    transform-box: view-box;
    transform-origin: 17px 29.5px;
  }

  .line {
    transform-box: view-box;
  }

  ${PRODUCTIVE} .bubble {
    animation: pop ${DURATION.slow01};
  }

  ${EXPRESSIVE} .bubble {
    animation: pop-spring ${DURATION.slow02};
  }

  ${EXPRESSIVE} .line {
    animation: retype ${DURATION.slow02} ${standard.expressive};
  }

  ${EXPRESSIVE} .second {
    animation-name: retype-second;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.06);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes pop-spring {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: scale(1.1);
      animation-timing-function: ${standard.expressive};
    }
    60% {
      transform: scale(0.97);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes retype {
    0%,
    15% {
      transform: scaleX(1);
    }
    40% {
      transform: scaleX(0.4);
    }
    70%,
    100% {
      transform: scaleX(1);
    }
  }

  @keyframes retype-second {
    0%,
    25% {
      transform: scaleX(1);
    }
    50% {
      transform: scaleX(0.4);
    }
    80%,
    100% {
      transform: scaleX(1);
    }
  }`,
} satisfies AnimatedIcon;
