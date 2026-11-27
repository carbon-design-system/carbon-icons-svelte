import { DURATION, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

/**
 * The prompt blinks like a cursor. Loops while a command runs.
 * Productive: one blink.
 * Expressive: two blinks.
 */
export default {
  name: "Terminal",
  sourceHash: "c4d2ef09685b",
  loop: true,
  content: `<path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4Zm0,2v4H6V6ZM6,26V12H26V26Z" transform="translate(0 .01)" />
  <path class="prompt" d="M10.76 16.18 13.58 19.01 10.76 21.84 12.17 23.25 16.41 19.01 12.17 14.77 10.76 16.18z" />`,
  css: `  ${PRODUCTIVE} .prompt {
    animation: blink ${DURATION.slow01} step-end;
  }

  ${EXPRESSIVE} .prompt {
    animation: blink-twice ${DURATION.slow02} step-end;
  }

  @keyframes blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes blink-twice {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    75% {
      opacity: 1;
    }
  }`,
} satisfies AnimatedIcon;
