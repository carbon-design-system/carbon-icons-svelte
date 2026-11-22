import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The sound waves fade in and grow from the speaker, the small wave first.
 * Same motion as `Wifi`.
 */
export default {
  name: "VolumeUp",
  sourceHash: "f091a391d212",
  content: `<path class="wave" style="--i: 1" d="M27.16,8.08,25.63,9.37a10,10,0,0,1-.29,13.23L26.81,24a12,12,0,0,0,.35-15.88Z" />
  <path class="wave" style="--i: 0" d="M21.58,12a6,6,0,0,1-.18,7.94l1.47,1.36a8,8,0,0,0,.23-10.59Z" />
  <path d="M18,30a1,1,0,0,1-.71-.3L9.67,22H3a1,1,0,0,1-1-1H2V11a1,1,0,0,1,1-1H9.67l7.62-7.7a1,1,0,0,1,1.41,0A1,1,0,0,1,19,3V29A1,1,0,0,1,18,30ZM4,20h6.08a1,1,0,0,1,.71.3L17,26.57V5.43L10.79,11.7a1,1,0,0,1-.71.3H4Z" />`,
  css: `  .wave {
    transform-box: view-box;
    transform-origin: 17px 16px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .wave {
      animation: emit 300ms cubic-bezier(0.2, 0.7, 0.3, 1) calc(var(--i) * 110ms) backwards;
    }
  }

  @keyframes emit {
    from {
      opacity: 0.15;
      transform: scale(0.85);
    }
  }`,
} satisfies AnimatedIcon;
