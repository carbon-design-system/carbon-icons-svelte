import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The shackle and body pull apart as far as the canvas allows (shackle up 2,
 * body down 1), hold, then snap together, and the body rebounds. Opening is
 * slow and closing is fast, like a latch.
 */
export default {
  name: "Locked",
  sourceHash: "71a315614d8d",
  content: `<path class="shackle" d="M22,14V8A6,6,0,0,0,10,8v6h2V8a4,4,0,0,1,8,0v6Z" />
  <path class="body" d="M24,14H8a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V16A2,2,0,0,0,24,14ZM24,28H8V16H24Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .shackle {
      animation: latch 800ms;
    }

    ${PLAYING} .body {
      animation: jolt 800ms;
    }
  }

  @keyframes latch {
    0% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    30%,
    46% {
      transform: translateY(-2px);
      animation-timing-function: cubic-bezier(0.7, 0, 1, 0.6);
    }
    58%,
    100% {
      transform: translateY(0);
    }
  }

  @keyframes jolt {
    0% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    30%,
    46% {
      transform: translateY(1px);
      animation-timing-function: cubic-bezier(0.7, 0, 1, 0.6);
    }
    58% {
      transform: translateY(-0.75px);
      animation-timing-function: cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    85%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
