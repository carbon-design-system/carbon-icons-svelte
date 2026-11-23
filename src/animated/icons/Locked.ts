import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit, standard } = EASING;

/**
 * The shackle lifts as far as the canvas allows (2 units) and drops back.
 * Productive: the shackle lifts and drops.
 * Expressive: the shackle and body pull apart (body down 1), hold, then
 * snap together, and the body rebounds. Opening is slow and closing is
 * fast, like a latch.
 */
export default {
  name: "Locked",
  sourceHash: "71a315614d8d",
  content: `<path class="shackle" d="M22,14V8A6,6,0,0,0,10,8v6h2V8a4,4,0,0,1,8,0v6Z" />
  <path class="body" d="M24,14H8a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V16A2,2,0,0,0,24,14ZM24,28H8V16H24Z" />`,
  css: `  ${PRODUCTIVE} .shackle {
    animation: lift ${DURATION.slow01};
  }

  ${EXPRESSIVE} .shackle {
    animation: latch ${DURATION.slow02};
  }

  ${EXPRESSIVE} .body {
    animation: jolt ${DURATION.slow02};
  }

  @keyframes lift {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    45% {
      transform: translateY(-2px);
      animation-timing-function: ${exit.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes latch {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    30%,
    46% {
      transform: translateY(-2px);
      animation-timing-function: ${exit.expressive};
    }
    58%,
    100% {
      transform: translateY(0);
    }
  }

  @keyframes jolt {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    30%,
    46% {
      transform: translateY(1px);
      animation-timing-function: ${exit.expressive};
    }
    58% {
      transform: translateY(-0.75px);
      animation-timing-function: ${standard.expressive};
    }
    82%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
