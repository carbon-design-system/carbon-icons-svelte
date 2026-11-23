import { DURATION, EASING, EXPRESSIVE, LOOP_EXPRESSIVE, LOOP_PRODUCTIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { standard } = EASING;

/**
 * Flips over and back, two half turns, while the sand fades and returns.
 * The frame isn't symmetric when turned 180°, so every cycle makes a whole
 * turn and ends where it started. It shrinks slightly while turning so its
 * corners stay inside the canvas. Loops while waiting.
 * Productive: one quick flip and back.
 * Expressive: flips, holds upside down, and flips back.
 */
export default {
  name: "Hourglass",
  sourceHash: "24417cede764",
  loop: true,
  content: `<g class="glass">
    <g class="sand">
      <path d="M15 19H17V21H15z" />
      <path d="M15 23H17V25H15z" />
    </g>
    <path d="M23,11.67V4h3V2H6V4H9v7.67a2,2,0,0,0,.4,1.2L11.75,16,9.4,19.13a2,2,0,0,0-.4,1.2V28H6v2H26V28H23V20.33a2,2,0,0,0-.4-1.2L20.25,16l2.35-3.13A2,2,0,0,0,23,11.67ZM21,4v7H11V4Zm0,16.33V28H11V20.33L14.25,16,12,13h8l-2.25,3Z" />
  </g>`,
  css: `  .glass {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  ${PRODUCTIVE} .glass {
    animation:
      flip ${DURATION.slow01} ${standard.productive},
      shrink ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .glass {
    animation:
      flip-hold ${DURATION.slow02} ${standard.expressive},
      shrink ${DURATION.slow02} ${standard.expressive};
  }

  ${EXPRESSIVE} .sand {
    animation: sand ${DURATION.slow02} ${standard.expressive};
  }

  ${LOOP_PRODUCTIVE} .glass {
    animation:
      flip-hold ${DURATION.slow02} ${standard.productive} infinite,
      shrink ${DURATION.slow02} ${standard.productive} infinite;
  }

  ${LOOP_PRODUCTIVE} .sand {
    animation: sand ${DURATION.slow02} ${standard.productive} infinite;
  }

  ${LOOP_EXPRESSIVE} .glass {
    animation:
      flip-hold ${DURATION.slow02} ${standard.expressive} infinite,
      shrink ${DURATION.slow02} ${standard.expressive} infinite;
  }

  ${LOOP_EXPRESSIVE} .sand {
    animation: sand ${DURATION.slow02} ${standard.expressive} infinite;
  }

  @keyframes flip {
    to {
      rotate: 360deg;
    }
  }

  @keyframes flip-hold {
    0% {
      rotate: 0deg;
    }
    40%,
    60% {
      rotate: 180deg;
    }
    100% {
      rotate: 360deg;
    }
  }

  @keyframes shrink {
    12%,
    88% {
      scale: 0.9;
    }
  }

  @keyframes sand {
    25%,
    75% {
      opacity: 0;
    }
  }`,
} satisfies AnimatedIcon;
