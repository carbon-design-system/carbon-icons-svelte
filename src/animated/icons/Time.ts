import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { standard } = EASING;

/**
 * Carbon draws both hands as one path; they're split in two. Every hand
 * makes whole turns, so it ends where it started. (A 30° hour step would
 * snap back when the animation ends.)
 * Productive: the long hand makes one turn.
 * Expressive: the long hand makes two turns while the short hand makes one.
 */
export default {
  name: "Time",
  sourceHash: "d92c36b6ec97",
  content: `<path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" />
  <path class="short" d="M15 16.41 20.59 22 22 20.59 17 15.58 15 15.58z" />
  <path class="long" d="M15 7H17V16.41H15z" />`,
  css: `  .short,
  .long {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  ${PRODUCTIVE} .long {
    animation: turn ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .long {
    animation: turn-twice ${DURATION.slow02} ${standard.expressive};
  }

  ${EXPRESSIVE} .short {
    animation: turn ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes turn {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes turn-twice {
    to {
      transform: rotate(720deg);
    }
  }`,
} satisfies AnimatedIcon;
