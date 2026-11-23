import { restCss, withRest } from "../families.js";
import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

/** Carbon's path. */
const gift = "M26,10H23.2383A4.4867,4.4867,0,0,0,16,4.7065,4.4873,4.4873,0,0,0,8.7617,10H6a2.0025,2.0025,0,0,0-2,2v4a2.0025,2.0025,0,0,0,2,2V28a2.0025,2.0025,0,0,0,2,2H24a2.0025,2.0025,0,0,0,2-2V18a2.0025,2.0025,0,0,0,2-2V12A2.0025,2.0025,0,0,0,26,10ZM17,7.5A2.5,2.5,0,1,1,19.5,10H17ZM12.5,5A2.503,2.503,0,0,1,15,7.5V10H12.5a2.5,2.5,0,0,1,0-5ZM6,12h9v4H6Zm2,6h7V28H8ZM24.0012,28H17V18h7ZM17,16V12h9l.0012,4Z";

const parts = {
  rest: `<path d="${gift}" />`,
  content: `<clipPath id="{id}-lid">
    <rect width="32" height="18" />
  </clipPath>
  <clipPath id="{id}-box">
    <rect y="18" width="32" height="14" />
  </clipPath>
  <g class="lid">
    <path clip-path="url(#{id}-lid)" d="${gift}" />
  </g>
  <path clip-path="url(#{id}-box)" d="${gift}" />`,
};

/**
 * The lid lifts off the box. Carbon draws the gift as one path, so it's
 * drawn twice, clipped above and below the lid's bottom edge. The lid's
 * clip moves with it. At rest, Carbon's path shows instead, so the seam
 * never shows.
 * Productive: the lid lifts and drops back.
 * Expressive: the lid lifts, tips one way and the other, and lands.
 */
export default {
  name: "Gift",
  sourceHash: "c8630a0ce5f2",
  content: withRest(parts),
  css: `  .lid {
    transform-box: view-box;
    transform-origin: 16px 14px;
  }${restCss(parts)}

  ${PRODUCTIVE} .lid {
    animation: lift ${DURATION.slow01};
  }

  ${EXPRESSIVE} .lid {
    animation: open ${DURATION.slow02};
  }

  @keyframes lift {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(-2px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes open {
    0% {
      transform: translateY(0) rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: translateY(-2px) rotate(-4deg);
      animation-timing-function: ${standard.expressive};
    }
    55% {
      transform: translateY(-2px) rotate(3deg);
      animation-timing-function: ${standard.expressive};
    }
    80% {
      transform: translateY(0.4px) rotate(0);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0) rotate(0);
    }
  }`,
} satisfies AnimatedIcon;
