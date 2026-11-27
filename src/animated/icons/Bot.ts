import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, exit } = EASING;

/**
 * The eyes blink. They're solid squares, so squashing them keeps their
 * look.
 * Productive: one blink.
 * Expressive: two blinks.
 */
export default {
  name: "Bot",
  sourceHash: "f2d0e124c5a6",
  content: `<path class="eye" d="M18 10H20V12H18z" />
  <path class="eye" d="M12 10H14V12H12z" />
  <path d="M26,20H21V18h1a2.0023,2.0023,0,0,0,2-2V12h2V10H24V8a2.0023,2.0023,0,0,0-2-2H20V2H18V6H14V2H12V6H10A2.0023,2.0023,0,0,0,8,8v2H6v2H8v4a2.0023,2.0023,0,0,0,2,2h1v2H6a2.0023,2.0023,0,0,0-2,2v8H6V22H26v8h2V22A2.0023,2.0023,0,0,0,26,20ZM10,8H22v8H10Zm3,10h6v2H13Z" />`,
  css: `  .eye {
    transform-box: view-box;
    transform-origin: 16px 11px;
  }

  ${PRODUCTIVE} .eye {
    animation: blink ${DURATION.slow01};
  }

  ${EXPRESSIVE} .eye {
    animation: blink-twice ${DURATION.slow02};
  }

  @keyframes blink {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${exit.productive};
    }
    35%,
    45% {
      transform: scaleY(0.1);
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
      transform: scaleY(0.1);
      animation-timing-function: ${entrance.expressive};
    }
    46% {
      transform: scaleY(1);
      animation-timing-function: ${exit.expressive};
    }
    62%,
    68% {
      transform: scaleY(0.1);
      animation-timing-function: ${entrance.expressive};
    }
    100% {
      transform: scaleY(1);
    }
  }`,
} satisfies AnimatedIcon;
