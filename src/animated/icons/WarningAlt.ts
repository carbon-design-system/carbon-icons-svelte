import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Wobbles side to side on its base, like something that just got knocked,
 * and settles. Rotating about the base keeps the corners inside the canvas,
 * where a sideways shake would hit the edges.
 */
export default {
  name: "WarningAlt",
  sourceHash: "6ed60658ed17",
  content: `<g class="sign">
    <path d="M16,23a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,23Z" />
    <path d="M15 12H17V21H15z" />
    <path d="M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z" />
  </g>`,
  css: `  .sign {
    transform-box: view-box;
    transform-origin: 16px 30px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .sign {
      animation: wobble 550ms ease-in-out;
    }
  }

  @keyframes wobble {
    16% {
      transform: rotate(-7deg);
    }
    36% {
      transform: rotate(6deg);
    }
    56% {
      transform: rotate(-4deg);
    }
    76% {
      transform: rotate(2deg);
    }
  }`,
} satisfies AnimatedIcon;
