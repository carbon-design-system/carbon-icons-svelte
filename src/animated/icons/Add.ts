import { PLAYING, type AnimatedIcon } from "../shared.js";

/** Turns a quarter. The plus looks the same every 90°, so it ends where it started. */
export default {
  name: "Add",
  sourceHash: "cb9b320a5f82",
  content: `<path class="plus" d="M17 15 17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z" />`,
  css: `  .plus {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .plus {
      animation: turn 500ms cubic-bezier(0.3, 1.4, 0.5, 1);
    }
  }

  @keyframes turn {
    to {
      transform: rotate(90deg);
    }
  }`,
} satisfies AnimatedIcon;
