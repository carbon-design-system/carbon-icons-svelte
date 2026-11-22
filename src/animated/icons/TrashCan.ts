import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The lid and handle tilt up from the lid's left end, then drop shut with a
 * small bounce. 7° is the most before the handle leaves the canvas.
 */
export default {
  name: "TrashCan",
  sourceHash: "efec8fd2c4e7",
  content: `<path d="M12 12H14V24H12z" />
  <path d="M18 12H20V24H18z" />
  <path d="M6,8V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8H24V28H8V8Z" />
  <g class="lid">
    <path d="M4 6H28V8H4z" />
    <path d="M12 2H20V4H12z" />
  </g>`,
  css: `  .lid {
    transform-box: view-box;
    transform-origin: 4px 8px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .lid {
      animation: tip 800ms;
    }
  }

  @keyframes tip {
    0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    30%,
    52% {
      transform: rotate(-7deg);
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1.6);
    }
    78%,
    100% {
      transform: rotate(0);
    }
  }`,
} satisfies AnimatedIcon;
