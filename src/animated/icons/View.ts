import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit } = EASING;

/**
 * Blinks. Two clips split the eye at its centre line; the top half and the
 * pupil fold down to it, leaving Carbon's lower arc as the closed eye.
 * Squashing the whole eye instead thins every horizontal stroke, and the
 * closed frame fades to nothing at 16px.
 * Productive: one blink.
 * Expressive: two blinks.
 */
export default {
  name: "View",
  sourceHash: "6509ba50a168",
  content: `<clipPath id="{id}-top">
    <rect width="32" height="16" />
  </clipPath>
  <clipPath id="{id}-bottom">
    <rect y="16" width="32" height="16" />
  </clipPath>
  <g clip-path="url(#{id}-top)">
    <g class="fold">
      <path d="M30.94,15.66A16.69,16.69,0,0,0,16,5,16.69,16.69,0,0,0,1.06,15.66a1,1,0,0,0,0,.68A16.69,16.69,0,0,0,16,27,16.69,16.69,0,0,0,30.94,16.34,1,1,0,0,0,30.94,15.66ZM16,25c-5.3,0-10.9-3.93-12.93-9C5.1,10.93,10.7,7,16,7s10.9,3.93,12.93,9C26.9,21.07,21.3,25,16,25Z" />
      <path d="M16,10a6,6,0,1,0,6,6A6,6,0,0,0,16,10Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,16,20Z" />
    </g>
  </g>
  <g clip-path="url(#{id}-bottom)">
    <path d="M30.94,15.66A16.69,16.69,0,0,0,16,5,16.69,16.69,0,0,0,1.06,15.66a1,1,0,0,0,0,.68A16.69,16.69,0,0,0,16,27,16.69,16.69,0,0,0,30.94,16.34,1,1,0,0,0,30.94,15.66ZM16,25c-5.3,0-10.9-3.93-12.93-9C5.1,10.93,10.7,7,16,7s10.9,3.93,12.93,9C26.9,21.07,21.3,25,16,25Z" />
    <path class="fold" d="M16,10a6,6,0,1,0,6,6A6,6,0,0,0,16,10Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,16,20Z" />
  </g>`,
  css: `  .fold {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PRODUCTIVE} .fold {
      animation: blink ${DURATION.slow01};
    }

    ${EXPRESSIVE} .fold {
      animation: blink-twice ${DURATION.slow02};
    }
  }

  @keyframes blink {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${exit.productive};
    }
    35%,
    45% {
      transform: scaleY(0);
      animation-timing-function: ${entrance.productive};
    }
    100% {
      transform: scaleY(1);
    }
  }

  @keyframes blink-twice {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${exit.expressive};
    }
    18%,
    24% {
      transform: scaleY(0);
      animation-timing-function: ${entrance.expressive};
    }
    46% {
      transform: scaleY(1);
      animation-timing-function: ${exit.expressive};
    }
    62%,
    68% {
      transform: scaleY(0);
      animation-timing-function: ${entrance.expressive};
    }
    100% {
      transform: scaleY(1);
    }
  }`,
} satisfies AnimatedIcon;
