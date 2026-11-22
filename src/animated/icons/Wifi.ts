import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * The signal builds outward: the dot, then each arc, 100ms apart. Each one
 * fades in and grows from the dot. Same motion as `VolumeUp`.
 */
export default {
  name: "Wifi",
  sourceHash: "9934f18ccef4",
  content: `<circle class="signal" style="--i: 0" cx="16" cy="25" r="2" />
  <path class="signal" style="--i: 1" d="M10.47,19.2334l1.4136,1.4131a5.9688,5.9688,0,0,1,8.2229-.0093L21.52,19.2236a7.9629,7.9629,0,0,0-11.05.01Z" />
  <path class="signal" style="--i: 2" d="M6.229,14.9927l1.4136,1.4135a11.955,11.955,0,0,1,16.7041-.01L25.76,14.9829a13.9514,13.9514,0,0,0-19.5313.01Z" />
  <path class="signal" style="--i: 3" d="M30,10.7412a19.94,19.94,0,0,0-28,0v.0225L3.4043,12.168a17.9336,17.9336,0,0,1,25.1811-.01L30,10.7432Z" />`,
  css: `  .signal {
    transform-box: view-box;
    transform-origin: 16px 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .signal {
      animation: emit 260ms cubic-bezier(0.2, 0.7, 0.3, 1) calc(var(--i) * 100ms) backwards;
    }
  }

  @keyframes emit {
    from {
      opacity: 0.15;
      transform: scale(0.9);
    }
  }`,
} satisfies AnimatedIcon;
