import { DURATION, EASING, EXPRESSIVE, LOOP_EXPRESSIVE, LOOP_PRODUCTIVE, PRODUCTIVE, type AnimatedIcon } from "./shared.js";

const { entrance, exit, standard } = EASING;

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

  :global(svg[data-playing]) .rest {
    display: none;
  }

  :global(svg[data-playing]) .animated {
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

/**
 * Glyphs that look the same every 90°, like `Add` and `Close`, turn a
 * quarter and end where they started.
 *
 * Productive: a plain quarter turn.
 * Expressive: overshoots by 10° and settles back.
 */
export const quarterTurn = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".glyph", [16, 16])}

  ${PRODUCTIVE} .glyph {
    animation: turn ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .glyph {
    animation: turn-overshoot ${DURATION.slow02};
  }

  @keyframes turn {
    to {
      transform: rotate(90deg);
    }
  }

  @keyframes turn-overshoot {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    70% {
      transform: rotate(100deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(90deg);
    }
  }`,
});

/**
 * Stars turn one point (72°; they have five), so they end where they
 * started. They shrink slightly mid-turn so their points stay inside the
 * canvas. `rotate` and `scale` are separate properties, so each has its own
 * easing.
 *
 * Productive: a plain turn.
 * Expressive: overshoots by 8° and settles back.
 */
export const starTurn = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".star", [16, 17.48])}

  ${PRODUCTIVE} .star {
    animation: turn ${DURATION.slow01} ${standard.productive},
      shrink ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .star {
    animation: turn-overshoot ${DURATION.slow02},
      shrink ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes turn {
    to {
      rotate: 72deg;
    }
  }

  @keyframes turn-overshoot {
    0% {
      rotate: 0deg;
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      rotate: 80deg;
      animation-timing-function: ${standard.expressive};
    }
    100% {
      rotate: 72deg;
    }
  }

  @keyframes shrink {
    50% {
      scale: 0.9;
    }
  }`,
});

/**
 * Hearts beat, scaling from their visual centre, not the canvas centre.
 *
 * Productive: one gentle beat.
 * Expressive: a strong beat, a slight under-scale, a smaller second beat,
 * then rest.
 */
export const heartbeat = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".heart", [16, 16.5])}

  ${PRODUCTIVE} .heart {
    animation: beat ${DURATION.slow01};
  }

  ${EXPRESSIVE} .heart {
    animation: heartbeat ${DURATION.slow02};
  }

  @keyframes beat {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.1);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes heartbeat {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    18% {
      transform: scale(1.16);
      animation-timing-function: ${standard.expressive};
    }
    38% {
      transform: scale(0.96);
      animation-timing-function: ${standard.expressive};
    }
    58% {
      transform: scale(1.08);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
});

/**
 * Overflow menu dots pulse one after another, each from its own centre,
 * set inline as its `transform-origin`.
 *
 * Productive: a quick ripple.
 * Expressive: a slower, bigger ripple that settles.
 */
export const pulseDots = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  .dot {
    transform-box: view-box;
  }

  ${PRODUCTIVE} .dot {
    animation: pulse ${DURATION.moderate02} ${standard.productive} calc(var(--i) * ${DURATION.fast01});
  }

  ${EXPRESSIVE} .dot {
    animation: pulse-hard ${DURATION.slow01} ${standard.expressive} calc(var(--i) * ${DURATION.fast02});
  }

  @keyframes pulse {
    50% {
      transform: scale(1.3);
    }
  }

  @keyframes pulse-hard {
    40% {
      transform: scale(1.5);
    }
    70% {
      transform: scale(0.92);
    }
  }`,
});

/**
 * Paired arrows push apart along their axis and come back together.
 *
 * Productive: 2 units apart and back.
 * Expressive: 3 units apart, springs back past rest, and settles.
 */
export const pushApart = (icon: Family & { axis: "x" | "y" }): AnimatedIcon => {
  const move = (units: number) => `translate${icon.axis.toUpperCase()}(${units}px)`;
  const keyframes = (name: string, sign: 1 | -1) => `  @keyframes ${name} {
    0% {
      transform: ${move(0)};
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: ${move(sign * 2)};
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: ${move(0)};
    }
  }

  @keyframes ${name}-spring {
    0% {
      transform: ${move(0)};
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: ${move(sign * 3)};
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: ${move(sign * -0.75)};
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: ${move(0)};
    }
  }`;

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `  ${PRODUCTIVE} .back {
    animation: back ${DURATION.slow01};
  }

  ${PRODUCTIVE} .forward {
    animation: forward ${DURATION.slow01};
  }

  ${EXPRESSIVE} .back {
    animation: back-spring ${DURATION.slow02};
  }

  ${EXPRESSIVE} .forward {
    animation: forward-spring ${DURATION.slow02};
  }

${keyframes("back", -1)}

${keyframes("forward", 1)}`,
  };
};

/**
 * The dot of an "i" hops while the ring or square stays still. In a filled
 * icon the "i" is a hole, so it moves inside a mask.
 *
 * Productive: the dot hops.
 * Expressive: the dot hops higher, the stem dips as it lands, and the dot
 * bounces once.
 */
export const hopDot = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `  ${PRODUCTIVE} .dot {
    animation: hop ${DURATION.slow01};
  }

  ${EXPRESSIVE} .dot {
    animation: hop-bounce ${DURATION.slow02};
  }

  ${EXPRESSIVE} .stem {
    animation: dip ${DURATION.slow02};
  }${restCss(icon)}

  @keyframes hop {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    45% {
      transform: translateY(-2px);
      animation-timing-function: ${exit.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes hop-bounce {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    28% {
      transform: translateY(-3px);
      animation-timing-function: ${exit.expressive};
    }
    50% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    68% {
      transform: translateY(-1px);
      animation-timing-function: ${exit.expressive};
    }
    84%,
    100% {
      transform: translateY(0);
    }
  }

  @keyframes dip {
    0%,
    48% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    58% {
      transform: translateY(1px);
      animation-timing-function: ${standard.expressive};
    }
    80%,
    100% {
      transform: translateY(0);
    }
  }`,
});

/**
 * Progress spinners turn as a whole. Their drawing fits a circle, so a full
 * turn never leaves the canvas and always ends where it started.
 *
 * Productive: one turn, or a steady spin while looping. A steady spin is
 * linear, like Carbon's `Loading`, so it doesn't pulse.
 * Expressive: one turn that overshoots, or a spin that speeds up and slows
 * down each turn while looping.
 */
export const spinner = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  loop: true,
  css: `${origin(".spinner", [16, 16])}

  ${PRODUCTIVE} .spinner {
    animation: spin ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .spinner {
    animation: spin-overshoot ${DURATION.slow02};
  }

  ${LOOP_PRODUCTIVE} .spinner {
    animation: spin ${DURATION.slow02} linear infinite;
  }

  ${LOOP_EXPRESSIVE} .spinner {
    animation: spin ${DURATION.slow02} ${standard.expressive} infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-overshoot {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      transform: rotate(375deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(360deg);
    }
  }`,
});

/**
 * Pending dots swell one after another, left to right. The stagger is in
 * each dot's keyframes, not in `animation-delay`, so all dots share one
 * cycle and a loop stops cleanly at its end. Each dot's pivot is set
 * inline as its `transform-origin`, and its class is `dot-0` to `dot-2`.
 *
 * Productive: a quick wave, or a steady wave while looping.
 * Expressive: each dot also hops as it swells.
 */
export const pendingDots = (icon: Family): AnimatedIcon => {
  const keyframes = (i: number, hop: boolean) => {
    const peak = 20 + i * 25;
    const lift = hop ? " translateY(-1.5px)" : "";
    return `  @keyframes dot-${i}${hop ? "-hop" : ""} {
    0%,
    ${peak - 18}%,
    ${peak + 18}%,
    100% {
      transform: scale(1);
    }
    ${peak}% {
      transform: scale(1.4)${lift};
    }
  }`;
  };
  const rules = (selector: string, duration: string, easing: string, hop: boolean, infinite: boolean) =>
    [0, 1, 2]
      .map(
        (i) => `  ${selector} .dot-${i} {
    animation: dot-${i}${hop ? "-hop" : ""} ${duration} ${easing}${infinite ? " infinite" : ""};
  }`
      )
      .join("\n\n");

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: withRest(icon),
    loop: true,
    css: `  .dot-0,
  .dot-1,
  .dot-2 {
    transform-box: view-box;
  }${restCss(icon)}

${rules(PRODUCTIVE, DURATION.slow01, standard.productive, false, false)}

${rules(EXPRESSIVE, DURATION.slow02, standard.expressive, true, false)}

${rules(LOOP_PRODUCTIVE, DURATION.slow02, standard.productive, false, true)}

${rules(LOOP_EXPRESSIVE, DURATION.slow02, standard.expressive, true, true)}

${[0, 1, 2].map((i) => keyframes(i, false)).join("\n\n")}

${[0, 1, 2].map((i) => keyframes(i, true)).join("\n\n")}`,
  };
};

/**
 * The shackle lifts as far as the canvas allows (2 units) and drops back.
 * Productive: the shackle lifts and drops.
 * Expressive: the shackle and body pull apart (body down 1), hold, then
 * snap together, and the body rebounds. Opening is slow and closing is
 * fast, like a latch.
 */
export const latch = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  ${PRODUCTIVE} .shackle {
    animation: lift ${DURATION.slow01};
  }

  ${EXPRESSIVE} .shackle {
    animation: latch ${DURATION.slow02};
  }

  ${EXPRESSIVE} .body {
    animation: jolt ${DURATION.slow02};
  }

  @keyframes lift {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    45% {
      transform: translateY(-2px);
      animation-timing-function: ${exit.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes latch {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    30%,
    46% {
      transform: translateY(-2px);
      animation-timing-function: ${exit.expressive};
    }
    58%,
    100% {
      transform: translateY(0);
    }
  }

  @keyframes jolt {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    30%,
    46% {
      transform: translateY(1px);
      animation-timing-function: ${exit.expressive};
    }
    58% {
      transform: translateY(-0.75px);
      animation-timing-function: ${standard.expressive};
    }
    82%,
    100% {
      transform: translateY(0);
    }
  }`,
});

/**
 * An arrow passes through what it points at: it falls into a tray, rises
 * into a bracket, or travels through a cloud. A clip on a wrapper hides it
 * where it goes in, and the canvas edge where it goes out. `sign` is 1 for
 * down and -1 for up; `out` and `back` are where the arrow leaves and
 * where the next one comes in from, in units.
 *
 * Productive: the arrow dips `dip` units (3 by default) toward its target and
 * back, staying inside its clip.
 * Expressive: the arrow passes through, the `base` reacts as it goes,
 * and a new arrow comes in from the other side.
 */
export const passThrough = (
  icon: Family & { base: string; sign: 1 | -1; out: number; back: number; dip?: number }
): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  ${PRODUCTIVE} .arrow {
    animation: nudge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .arrow {
    animation: pass ${DURATION.slow02};
  }

  ${EXPRESSIVE} .${icon.base} {
    animation: catch ${DURATION.slow02};
  }

  @keyframes nudge {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(${icon.sign * (icon.dip ?? 3)}px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes pass {
    0% {
      transform: translateY(0);
      animation-timing-function: ${exit.expressive};
    }
    40% {
      transform: translateY(${icon.out}px);
      animation-timing-function: step-end;
    }
    40.1% {
      transform: translateY(${icon.back}px);
      animation-timing-function: ${entrance.expressive};
    }
    85% {
      transform: translateY(${icon.sign}px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes catch {
    0%,
    36% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    46% {
      transform: translateY(${icon.sign * 1.5}px);
      animation-timing-function: ${standard.expressive};
    }
    70%,
    100% {
      transform: translateY(0);
    }
  }`,
});

/**
 * Sound and signal waves fade in and grow from their source, one after
 * another (`--i`), with the parts classed `part`.
 *
 * Productive: the waves pulse outward together.
 * Expressive: the waves fade in and grow from the source in turn.
 */
export const waves = (
  icon: Family & { part: string; origin: [number, number]; from: number; emit: keyof typeof DURATION }
): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  .${icon.part} {
    transform-box: view-box;
    transform-origin: ${icon.origin[0]}px ${icon.origin[1]}px;
  }

  ${PRODUCTIVE} .${icon.part} {
    animation: pulse ${DURATION.slow01};
  }

  ${EXPRESSIVE} .${icon.part} {
    animation: emit ${DURATION[icon.emit]} ${entrance.expressive} calc(var(--i) * ${DURATION.fast02}) backwards;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.08);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes emit {
    from {
      opacity: 0.15;
      transform: scale(${icon.from});
    }
  }`,
});

/**
 * Push pins hop off the surface along their needle, `direction` being the
 * unit vector away from the point, and land again. They reach the canvas
 * edges, so they move 2 units at most.
 *
 * Productive: a hop.
 * Expressive: a hop that lands with a press into the surface, then settles.
 */
export const hopAlong = (icon: Family & { direction: [number, number] }): AnimatedIcon => {
  const at = (units: number) =>
    `translate(${Math.round(icon.direction[0] * units * 100) / 100}px, ${Math.round(icon.direction[1] * units * 100) / 100}px)`;

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `  ${PRODUCTIVE} .pin {
    animation: hop ${DURATION.slow01};
  }

  ${EXPRESSIVE} .pin {
    animation: hop-press ${DURATION.slow02};
  }

  @keyframes hop {
    0% {
      transform: ${at(0)};
      animation-timing-function: ${entrance.productive};
    }
    45% {
      transform: ${at(2)};
      animation-timing-function: ${exit.productive};
    }
    100% {
      transform: ${at(0)};
    }
  }

  @keyframes hop-press {
    0% {
      transform: ${at(0)};
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: ${at(2)};
      animation-timing-function: ${exit.expressive};
    }
    50% {
      transform: ${at(-0.75)};
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: ${at(0)};
    }
  }`,
  };
};
