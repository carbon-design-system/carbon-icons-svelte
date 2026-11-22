import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Carbon draws both hands as one path; they're split in two. The long hand
 * makes two turns while the short hand makes one, so both end where they
 * started. (A 30° hour step would snap back when the animation ends.)
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

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .long {
      animation: sweep 1200ms cubic-bezier(0.65, 0, 0.35, 1);
    }

    ${PLAYING} .short {
      animation: hour 1200ms cubic-bezier(0.65, 0, 0.35, 1);
    }
  }

  @keyframes sweep {
    to {
      transform: rotate(720deg);
    }
  }

  @keyframes hour {
    to {
      transform: rotate(360deg);
    }
  }`,
} satisfies AnimatedIcon;
