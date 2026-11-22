import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Turns half a revolution the way the arrows point, with a slight overshoot.
 * The icon looks the same after 180°, so it ends where it started.
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
    ${PLAYING} .arrows {
      animation: spin 700ms cubic-bezier(0.3, 1.25, 0.5, 1);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(-180deg);
    }
  }`,
} satisfies AnimatedIcon;
