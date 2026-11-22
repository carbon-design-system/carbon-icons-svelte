import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The arrow falls into the tray, which dips as it lands, then a new arrow
 * drops in from the top. The clip is on a wrapper so it stays put while the
 * arrow moves. Mirrors `Upload`.
 */
export default {
  name: "Download",
  sourceHash: "9a31c81c721f",
  content: `<clipPath id="{id}-clip">
    <rect width="32" height="24" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14z" />
  </g>
  <path class="tray" d="M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .arrow {
      animation: drop 850ms;
    }

    ${PLAYING} .tray {
      animation: catch 850ms;
    }
  }

  @keyframes drop {
    0% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.55, 0, 0.9, 0.45);
    }
    38% {
      transform: translateY(24px);
      animation-timing-function: step-end;
    }
    38.1% {
      transform: translateY(-24px);
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
      transform: translateY(1.5px);
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    66%,
    100% {
      transform: translateY(0);
    }
  }`,
} satisfies AnimatedIcon;
