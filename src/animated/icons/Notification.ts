import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Rings. Carbon draws the bell as one path; the clapper is split out so it
 * can swing on its own, and the bell's bottom edge is closed where it joined.
 * Both swing from the top of the stem. The clapper starts later and swings
 * further, so it lags behind the bell.
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
    ${PLAYING} .bell {
      animation: ring 900ms ease-in-out;
    }

    ${PLAYING} .clapper {
      animation: ring-clapper 900ms ease-in-out 40ms backwards;
    }
  }

  @keyframes ring {
    12% {
      transform: rotate(14deg);
    }
    28% {
      transform: rotate(-11deg);
    }
    44% {
      transform: rotate(7deg);
    }
    60% {
      transform: rotate(-4deg);
    }
    76% {
      transform: rotate(1.5deg);
    }
  }

  @keyframes ring-clapper {
    13% {
      transform: rotate(20deg);
    }
    30% {
      transform: rotate(-15deg);
    }
    46% {
      transform: rotate(10deg);
    }
    62% {
      transform: rotate(-5deg);
    }
    78% {
      transform: rotate(2deg);
    }
  }`,
} satisfies AnimatedIcon;
