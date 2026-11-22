import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The arrow rises into the bracket, which lifts as it arrives, then a new
 * arrow rises in from the bottom edge. Mirrors `Download`.
 */
export default {
  name: "Upload",
  sourceHash: "e495e777d9ff",
  content: `<clipPath id="{id}-clip">
    <rect y="8" width="32" height="24" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M6 18 7.41 19.41 15 11.83 15 30 17 30 17 11.83 24.59 19.41 26 18 16 8 6 18z" />
  </g>
  <path class="bracket" d="M6,8V4H26V8h2V4a2,2,0,0,0-2-2H6A2,2,0,0,0,4,4V8Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .arrow {
      animation: rise 850ms;
    }

    ${PLAYING} .bracket {
      animation: catch 850ms;
    }
  }

  @keyframes rise {
    0% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.45);
    }
    38% {
      transform: translateY(-24px);
      animation-timing-function: step-end;
    }
    38.1% {
      transform: translateY(24px);
      animation-timing-function: cubic-bezier(0.2, 0.75, 0.3, 1.08);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes catch {
    0%,
    30% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.2, 0, 0.3, 1);
    }
    40% {
      transform: translateY(-1.5px);
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    66%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
