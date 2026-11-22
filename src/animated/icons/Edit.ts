import { PLAYING, type AnimatedIcon } from "../shared.js";

/** The pencil scribbles three strokes to the right, pivoting on its tip, then returns. The line stays put. */
export default {
  name: "Edit",
  sourceHash: "c97a4ed911a1",
  content: `<path d="M2 26H30V28H2z" />
  <path class="pencil" d="M25.4,9c0.8-0.8,0.8-2,0-2.8c0,0,0,0,0,0l-3.6-3.6c-0.8-0.8-2-0.8-2.8,0c0,0,0,0,0,0l-15,15V24h6.4L25.4,9z M20.4,4L24,7.6	l-3,3L17.4,7L20.4,4z M6,22v-3.6l10-10l3.6,3.6l-10,10H6z" />`,
  css: `  .pencil {
    transform-box: view-box;
    transform-origin: 5px 23px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .pencil {
      animation: scribble 650ms ease-in-out;
    }
  }

  @keyframes scribble {
    20% {
      transform: translateX(1px) rotate(-6deg);
    }
    40% {
      transform: translateX(2px) rotate(4deg);
    }
    60% {
      transform: translateX(3px) rotate(-4deg);
    }
    80% {
      transform: translateX(1.5px) rotate(2deg);
    }
  }`,
} satisfies AnimatedIcon;
