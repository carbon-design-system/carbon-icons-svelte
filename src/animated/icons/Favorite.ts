import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Scales from the heart's visual centre, not the canvas centre.
 * Productive: one gentle beat.
 * Expressive: a heartbeat; a strong beat, a slight under-scale, a smaller
 * second beat, then rest.
 */
export default {
  name: "Favorite",
  sourceHash: "0b55ba71b550",
  content: `<path class="heart" d="M22.45,6a5.47,5.47,0,0,1,3.91,1.64,5.7,5.7,0,0,1,0,8L16,26.13,5.64,15.64a5.7,5.7,0,0,1,0-8,5.48,5.48,0,0,1,7.82,0L16,10.24l2.53-2.58A5.44,5.44,0,0,1,22.45,6m0-2a7.47,7.47,0,0,0-5.34,2.24L16,7.36,14.89,6.24a7.49,7.49,0,0,0-10.68,0,7.72,7.72,0,0,0,0,10.82L16,29,27.79,17.06a7.72,7.72,0,0,0,0-10.82A7.49,7.49,0,0,0,22.45,4Z" />`,
  css: `  .heart {
    transform-box: view-box;
    transform-origin: 16px 16.5px;
  }

  ${PRODUCTIVE} .heart {
    animation: beat ${DURATION.slow01};
  }

  ${EXPRESSIVE} .heart {
    animation: heartbeat ${DURATION.slow02};
  }

  @keyframes beat {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.1);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes heartbeat {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    18% {
      transform: scale(1.16);
      animation-timing-function: ${standard.expressive};
    }
    38% {
      transform: scale(0.96);
      animation-timing-function: ${standard.expressive};
    }
    58% {
      transform: scale(1.08);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
} satisfies AnimatedIcon;
