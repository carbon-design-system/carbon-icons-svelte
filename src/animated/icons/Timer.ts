import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * The hand sweeps a full turn around the dial. In expressive mode the
 * button presses first, and the hand overshoots and settles. Loops while
 * counting down.
 * Productive: one sweep.
 * Expressive: the button presses, then the hand sweeps past the top and
 * settles.
 */
export default {
  name: "Timer",
  sourceHash: "a08be81f3435",
  loop: true,
  content: `<path class="hand" d="M15 11H17V20H15z" />
  <path class="button" d="M13 2H19V4H13z" />
  <path d="M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z" />`,
  css: `  .hand {
    transform-box: view-box;
    transform-origin: 16px 17px;
  }

  ${PRODUCTIVE} .hand {
    animation: sweep ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .hand {
    animation: sweep-settle ${DURATION.slow02};
  }

  ${EXPRESSIVE} .button {
    animation: press ${DURATION.slow02};
  }

  @keyframes sweep {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sweep-settle {
    0%,
    15% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    80% {
      transform: rotate(372deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes press {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    10% {
      transform: translateY(1px);
      animation-timing-function: ${standard.expressive};
    }
    25%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
