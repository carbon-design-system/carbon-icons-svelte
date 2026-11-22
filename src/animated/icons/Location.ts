import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Hops: rises 2 units (all the room above it), drops, squashes on its tip,
 * and rebounds. The squash pivots on the tip so the pin stays planted.
 */
export default {
  name: "Location",
  sourceHash: "34ca3d6aa345",
  content: `<g class="pin">
    <path d="M16,18a5,5,0,1,1,5-5A5.0057,5.0057,0,0,1,16,18Zm0-8a3,3,0,1,0,3,3A3.0033,3.0033,0,0,0,16,10Z" />
    <path d="M16,30,7.5645,20.0513c-.0479-.0571-.3482-.4515-.3482-.4515A10.8888,10.8888,0,0,1,5,13a11,11,0,0,1,22,0,10.8844,10.8844,0,0,1-2.2148,6.5973l-.0015.0025s-.3.3944-.3447.4474ZM8.8125,18.395c.001.0007.2334.3082.2866.3744L16,26.9079l6.91-8.15c.0439-.0552.2783-.3649.2788-.3657A8.901,8.901,0,0,0,25,13,9,9,0,1,0,7,13a8.9054,8.9054,0,0,0,1.8125,5.395Z" />
  </g>`,
  css: `  .pin {
    transform-box: view-box;
    transform-origin: 16px 30px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .pin {
      animation: hop 650ms;
    }
  }

  @keyframes hop {
    0% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    30% {
      transform: translateY(-2px);
      animation-timing-function: cubic-bezier(0.6, 0, 0.9, 0.5);
    }
    52% {
      transform: translateY(0) scale(1.08, 0.9);
      animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    72% {
      transform: scale(0.97, 1.03);
      animation-timing-function: ease-in-out;
    }
    100% {
      transform: none;
    }
  }`,
} satisfies AnimatedIcon;
