import { PLAYING, type AnimatedIcon } from "../shared.js";

/**
 * Draws itself in. The check is a filled shape, so it can't be drawn with a
 * stroke. A stroke along its centreline masks it instead, which reveals
 * Carbon's exact fill. The stroke overshoots both ends and is wide enough
 * to cover the fill.
 */
export default {
  name: "Checkmark",
  sourceHash: "e0acef5810ff",
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <path class="ink" d="M3 12.586 13 22.586 29 6.586" fill="none" stroke="#fff" stroke-width="4" pathLength="1" stroke-dasharray="1 1" />
  </mask>
  <path mask="url(#{id}-ink)" d="M13 24 4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z" />`,
  css: `  @media (prefers-reduced-motion: no-preference) {
    ${PLAYING} .ink {
      animation: draw 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
    }
  }

  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }`,
} satisfies AnimatedIcon;
