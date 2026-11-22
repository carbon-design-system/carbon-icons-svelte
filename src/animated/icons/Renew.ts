import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/**
 * Turns half a revolution the way the arrows point. The icon looks the same
 * after 180°, so it ends where it started.
 * Productive: a plain half turn.
 * Expressive: overshoots by 15° and settles back.
 */
export default {
  name: "Renew",
  sourceHash: "693d20bcc9f5",
  content: `<g class="arrows">
    <path d="M12,10H6.78A11,11,0,0,1,27,16h2A13,13,0,0,0,6,7.68V4H4v8h8Z" />
    <path d="M20,22h5.22A11,11,0,0,1,5,16H3a13,13,0,0,0,23,8.32V28h2V20H20Z" />
  </g>`,
  css: `  .arrows {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .arrows {
      animation: spin ${DURATION.slow01} ${standard.productive};
    }

    ${EXPRESSIVE} .arrows {
      animation: spin-overshoot ${DURATION.slow02};
    }
  }

  @keyframes spin {
    to {
      transform: rotate(-180deg);
    }
  }

  @keyframes spin-overshoot {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      transform: rotate(-195deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(-180deg);
    }
  }`,
} satisfies AnimatedIcon;
