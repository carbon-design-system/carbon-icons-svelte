import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Same motion as `Wifi`.
 * Productive: the sound waves pulse outward together.
 * Expressive: the waves fade in and grow from the speaker, the small wave first.
 */
export default {
  name: "VolumeUp",
  sourceHash: "f091a391d212",
  content: `<path class="wave" style="--i: 1" d="M27.16,8.08,25.63,9.37a10,10,0,0,1-.29,13.23L26.81,24a12,12,0,0,0,.35-15.88Z" />
  <path class="wave" style="--i: 0" d="M21.58,12a6,6,0,0,1-.18,7.94l1.47,1.36a8,8,0,0,0,.23-10.59Z" />
  <path d="M18,30a1,1,0,0,1-.71-.3L9.67,22H3a1,1,0,0,1-1-1H2V11a1,1,0,0,1,1-1H9.67l7.62-7.7a1,1,0,0,1,1.41,0A1,1,0,0,1,19,3V29A1,1,0,0,1,18,30ZM4,20h6.08a1,1,0,0,1,.71.3L17,26.57V5.43L10.79,11.7a1,1,0,0,1-.71.3H4Z" />`,
  css: `  .wave {
    transform-box: view-box;
    transform-origin: 17px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .wave {
      animation: pulse ${DURATION.slow01};
    }

    ${EXPRESSIVE} .wave {
      animation: emit ${DURATION.slow01} ${entrance.expressive} calc(var(--i) * ${DURATION.fast02}) backwards;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.08);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes emit {
    from {
      opacity: 0.15;
      transform: scale(0.85);
    }
  }`,
} satisfies AnimatedIcon;
