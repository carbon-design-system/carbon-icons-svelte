import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Pulls back, speeds off the right edge, and comes back in from the left.
 * The `<svg>` clips to its viewBox, so no clip path is needed.
 */
export default {
  name: "Send",
  sourceHash: "34721e83f8e4",
  content: `<path class="plane" d="M27.45,15.11l-22-11a1,1,0,0,0-1.08.12,1,1,0,0,0-.33,1L7,16,4,26.74A1,1,0,0,0,5,28a1,1,0,0,0,.45-.11l22-11a1,1,0,0,0,0-1.78Zm-20.9,10L8.76,17H18V15H8.76L6.55,6.89,24.76,16Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .plane {
      animation: fly 750ms;
    }
  }

  @keyframes fly {
    0% {
      transform: translateX(0);
      animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
    }
    14% {
      transform: translateX(-2px);
      animation-timing-function: cubic-bezier(0.6, 0, 0.9, 0.5);
    }
    46% {
      transform: translateX(30px);
      animation-timing-function: step-end;
    }
    46.1% {
      transform: translateX(-30px);
      animation-timing-function: cubic-bezier(0.15, 0.7, 0.25, 1);
    }
    100% {
      transform: translateX(0);
    }
  }`,
} satisfies AnimatedIcon;
