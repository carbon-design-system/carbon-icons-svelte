import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { standard } = EASING;

/**
 * Rings. Carbon draws the bell as one path; the clapper is split out so it
 * can swing on its own, and the bell's bottom edge is closed where it joined.
 * Both swing from the top of the stem.
 *
 * Productive: one short swing each way; the clapper moves with the bell.
 * Expressive: swings three times and dies out. The clapper starts later and
 * swings further, so it lags behind the bell. Past about 8°, the rim leaves
 * the canvas.
 */
export default {
  name: "Notification",
  sourceHash: "191996468f4c",
  content: `<path class="clapper" d="M11,24v.7768a5.152,5.152,0,0,0,4.5,5.1987A5.0057,5.0057,0,0,0,21,25V24ZM19,25a3,3,0,0,1-6,0V24h6Z" />
  <path class="bell" d="M28.7071,19.293,26,16.5859V13a10.0136,10.0136,0,0,0-9-9.9492V1H15V3.0508A10.0136,10.0136,0,0,0,6,13v3.5859L3.2929,19.293A1,1,0,0,0,3,20v3a1,1,0,0,0,1,1H28a1,1,0,0,0,1-1V20A1,1,0,0,0,28.7071,19.293ZM27,22H5V20.4141L7.707,17.707A1,1,0,0,0,8,17V13a8,8,0,0,1,16,0v4a1,1,0,0,0,.293.707L27,20.4141Z" />`,
  css: `  .bell,
  .clapper {
    transform-box: view-box;
    transform-origin: 16px 1px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .bell,
    ${PRODUCTIVE} .clapper {
      animation: swing ${DURATION.slow01} ${standard.productive};
    }

    ${EXPRESSIVE} .bell {
      animation: ring ${DURATION.slow02} ${standard.expressive};
    }

    ${EXPRESSIVE} .clapper {
      animation: ring-clapper ${DURATION.slow02} ${standard.expressive};
    }
  }

  @keyframes swing {
    35% {
      transform: rotate(6deg);
    }
    70% {
      transform: rotate(-4deg);
    }
  }

  @keyframes ring {
    14% {
      transform: rotate(8deg);
    }
    32% {
      transform: rotate(-7deg);
    }
    50% {
      transform: rotate(5deg);
    }
    68% {
      transform: rotate(-3deg);
    }
    84% {
      transform: rotate(1deg);
    }
  }

  /* The same swing, starting later and going further. */
  @keyframes ring-clapper {
    0%,
    5% {
      transform: rotate(0);
    }
    19% {
      transform: rotate(12deg);
    }
    37% {
      transform: rotate(-10deg);
    }
    55% {
      transform: rotate(7deg);
    }
    72% {
      transform: rotate(-4deg);
    }
    88% {
      transform: rotate(1.5deg);
    }
  }`,
} satisfies AnimatedIcon;
