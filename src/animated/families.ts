import { DURATION, EASING, EXPRESSIVE, PLAYING, PRODUCTIVE, type AnimatedIcon } from "./shared.js";

const { entrance, standard } = EASING;

type Family = Pick<AnimatedIcon, "name" | "sourceHash" | "content"> & {
  /**
   * Carbon's own markup, shown at rest instead of `content`. Masks render
   * edges slightly differently in some browsers, so an icon drawn through
   * a mask only uses it while it plays.
   */
  rest?: string;
};

const withRest = ({ rest, content }: Family) =>
  rest
    ? `<g class="rest">\n    ${rest}\n  </g>\n  <g class="animated">\n    ${content.replaceAll("\n", "\n  ")}\n  </g>`
    : content;

const restCss = ({ rest }: Family) =>
  rest
    ? `

  .animated {
    display: none;
  }

  ${PLAYING} .rest {
    display: none;
  }

  ${PLAYING} .animated {
    display: inline;
  }`
    : "";

const origin = (selector: string, [x, y]: [number, number]) => `  ${selector} {
    transform-box: view-box;
    transform-origin: ${x}px ${y}px;
  }`;

/**
 * A stroke along a glyph's centreline, for a `<mask>`. Drawn in white, its
 * dash reveals the glyph's fill. Drawn in black at the glyph's exact width,
 * it cuts the glyph's hole in a filled icon: Carbon's check and slash holes
 * are constant-width strokes with square ends.
 */
export const ink = (d: string, width: number, color = "#fff") =>
  `<path class="ink" d="${d}" fill="none" stroke="${color}" stroke-width="${width}" pathLength="1" stroke-dasharray="1 1" />`;

/**
 * Warning signs wobble on their base, or swing from their top edge when
 * hung upside down. Rotating about an edge keeps the corners inside the
 * canvas, where a sideways shake would hit the edges.
 *
 * Productive: one wobble each way.
 * Expressive: four wobbles that die out.
 */
export const wobbleSign = (icon: Family & { pivot: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".sign", icon.pivot)}

  ${PRODUCTIVE} .sign {
    animation: rock ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .sign {
    animation: wobble ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes rock {
    35% {
      transform: rotate(-5deg);
    }
    70% {
      transform: rotate(3deg);
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
});

/**
 * The `!` in a round or square warning rocks on its dot while the shape stays
 * still. In a filled icon the `!` is a hole, so it rocks inside a mask.
 *
 * Productive: one rock each way.
 * Expressive: four rocks that die out.
 */
export const rockMark = (icon: Family & { pivot: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `${origin(".mark", icon.pivot)}${restCss(icon)}

  ${PRODUCTIVE} .mark {
    animation: rock ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .mark {
    animation: rock-hard ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes rock {
    35% {
      transform: rotate(-8deg);
    }
    70% {
      transform: rotate(5deg);
    }
  }

  @keyframes rock-hard {
    15% {
      transform: rotate(-12deg);
    }
    35% {
      transform: rotate(9deg);
    }
    55% {
      transform: rotate(-6deg);
    }
    75% {
      transform: rotate(3deg);
    }
  }`,
});

/**
 * Accents that follow the draw in expressive mode, on a `.accent` group.
 * - `pop`: a check lands, so the icon swells and settles.
 * - `shake`: an error, so the icon shakes side to side.
 * - `flinch`: something is turned off, so the icon recoils.
 */
const ACCENTS = {
  pop: `@keyframes accent {
    0%,
    50% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    72% {
      transform: scale(1.08);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
  shake: `@keyframes accent {
    0%,
    55% {
      transform: translateX(0);
      animation-timing-function: ${standard.expressive};
    }
    66% {
      transform: translateX(-1.5px);
      animation-timing-function: ${standard.expressive};
    }
    77% {
      transform: translateX(1.5px);
      animation-timing-function: ${standard.expressive};
    }
    88% {
      transform: translateX(-0.75px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateX(0);
    }
  }`,
  flinch: `@keyframes accent {
    0%,
    50% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    64% {
      transform: scale(0.94);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
};

/**
 * A check, error slash or "off" slash draws itself in along an `ink` stroke
 * in a mask, then the icon reacts.
 *
 * Productive: the glyph draws in.
 * Expressive: the glyph draws in, then the `accent` plays.
 */
export const drawIn = (icon: Family & { accent: keyof typeof ACCENTS }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `${origin(".accent", [16, 16])}${restCss(icon)}

  ${PRODUCTIVE} .ink {
    animation: draw ${DURATION.slow01} ${entrance.productive} both;
  }

  ${EXPRESSIVE} .ink {
    animation: draw-hold ${DURATION.slow02} both;
  }

  ${EXPRESSIVE} .accent {
    animation: accent ${DURATION.slow02};
  }

  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes draw-hold {
    0% {
      stroke-dashoffset: 1;
      animation-timing-function: ${entrance.expressive};
    }
    50%,
    100% {
      stroke-dashoffset: 0;
    }
  }

  ${ACCENTS[icon.accent]}`,
});
