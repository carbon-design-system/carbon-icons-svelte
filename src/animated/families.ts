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

export const withRest = ({ rest, content }: Pick<Family, "rest" | "content">) =>
  rest
    ? `<g class="rest">\n    ${rest}\n  </g>\n  <g class="animated">\n    ${content.replaceAll("\n", "\n  ")}\n  </g>`
    : content;

export const restCss = ({ rest }: Pick<Family, "rest">) =>
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
 * Hides a 2-unit "off" slash so `ink` can draw it back in along `d`. A
 * shape traced on the slash's edges would leave a faint outline, where its
 * anti-aliased edges meet the slash's, so a wider stroke along `cut` hides
 * it and a wider ink still reveals it. `cut` stops at the slash's ends when
 * something sits past them, like `Error`'s ring.
 */
export const slash = (d: string, cut = d) =>
  `<path d="${cut}" fill="none" stroke="#000" stroke-width="3.4" />
    ${ink(d, 5)}`;

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
 * quarter and end where they started. In a filled circle the glyph is a
 * hole, so it turns inside a mask. A badge plus, like `DocumentAdd`'s,
 * turns about its own centre (`pivot`).
 *
 * Productive: a plain quarter turn.
 * Expressive: overshoots by 10° and settles back.
 */
export const quarterTurn = (icon: Family & { pivot?: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `${origin(".glyph", icon.pivot ?? [16, 16])}${restCss(icon)}

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
 * A bar (`.bar`) squeezes in from both ends and comes back, about `pivot`
 * (the centre by default). In a filled circle the bar is a hole, so it
 * squeezes inside a mask.
 *
 * Productive: squeezes to 70%.
 * Expressive: squeezes to 60%, overshoots and settles.
 */
export const squeeze = (icon: Family & { pivot?: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `${origin(".bar", icon.pivot ?? [16, 16])}${restCss(icon)}

  ${PRODUCTIVE} .bar {
    animation: squeeze ${DURATION.slow01};
  }

  ${EXPRESSIVE} .bar {
    animation: squeeze-spring ${DURATION.slow02};
  }

  @keyframes squeeze {
    0% {
      transform: scaleX(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scaleX(0.7);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scaleX(1);
    }
  }

  @keyframes squeeze-spring {
    0% {
      transform: scaleX(1);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: scaleX(0.6);
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: scaleX(1.08);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scaleX(1);
    }
  }`,
});

/**
 * Rays (`.ray`) grow out from the centre, in turn by `--i`. Diagonal rays
 * carry a `transform` attribute, which a CSS `transform` would replace, so
 * each ray is wrapped in a `<g>` that animates.
 *
 * Productive: all rays pulse out together.
 * Expressive: the rays dim, then light up one by one clockwise from the top.
 */
export const radiate = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".ray", [16, 16])}

  ${PRODUCTIVE} .ray {
    animation: pulse ${DURATION.slow01};
  }

  ${EXPRESSIVE} .ray {
    animation: radiate ${DURATION.moderate01} ${entrance.expressive} calc(var(--i) * ${DURATION.fast01}) backwards;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.12);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes radiate {
    from {
      opacity: 0.15;
      transform: scale(0.8);
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
 * Paired parts push apart along their axis and come back together: `.back`
 * moves toward the start of the axis, `.forward` toward the end. Swap them
 * to squeeze the parts together instead.
 *
 * Productive: 2 units apart and back.
 * Expressive: 3 units apart, springs back past rest by `settle` (0.75 by
 * default; less for parts that touch the canvas edge), and settles.
 */
export const pushApart = (icon: Family & { axis: "x" | "y"; settle?: number }): AnimatedIcon => {
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
      transform: ${move(sign * -(icon.settle ?? 0.75))};
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
export const pendingDots = (icon: Family & { loop?: boolean }): AnimatedIcon => {
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
    loop: icon.loop ?? true,
    css: `  .dot-0,
  .dot-1,
  .dot-2 {
    transform-box: view-box;
  }${restCss(icon)}

${rules(PRODUCTIVE, DURATION.slow01, standard.productive, false, false)}

${rules(EXPRESSIVE, DURATION.slow02, standard.expressive, true, false)}

${
  icon.loop === false
    ? ""
    : `${rules(LOOP_PRODUCTIVE, DURATION.slow02, standard.productive, false, true)}

${rules(LOOP_EXPRESSIVE, DURATION.slow02, standard.expressive, true, true)}

`
}${[0, 1, 2].map((i) => keyframes(i, false)).join("\n\n")}

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
  content: withRest(icon),
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
  }${restCss(icon)}`,
});

/**
 * An arrow passes through what it points at: it falls into a tray, rises
 * into a bracket, or travels through a cloud. A clip on a wrapper hides it
 * where it goes in, and the canvas edge where it goes out. `sign` is 1 for
 * down or right, and -1 for up or left, along `axis` ("y" by default);
 * `out` and `back` are where the arrow leaves and where the next one comes
 * in from, in units.
 *
 * Productive: the arrow dips `dip` units (3 by default) toward its target and
 * back, staying inside its clip.
 * Expressive: the arrow passes through, the `base` reacts as it goes,
 * and a new arrow comes in from the other side. Without a `base`, like
 * `DocumentDownload`'s arrow beside its page, nothing else moves.
 */
export const passThrough = (
  icon: Family & { base?: string; sign: 1 | -1; out: number; back: number; dip?: number; axis?: "x" | "y" }
): AnimatedIcon => {
  const move = `translate${(icon.axis ?? "y").toUpperCase()}`;
  const baseRule = icon.base
    ? `

  ${EXPRESSIVE} .${icon.base} {
    animation: catch ${DURATION.slow02};
  }`
    : "";
  const baseKeyframes = icon.base
    ? `

  @keyframes catch {
    0%,
    36% {
      transform: ${move}(0);
      animation-timing-function: ${entrance.expressive};
    }
    46% {
      transform: ${move}(${icon.sign * 1.5}px);
      animation-timing-function: ${standard.expressive};
    }
    70%,
    100% {
      transform: ${move}(0);
    }
  }`
    : "";

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `  ${PRODUCTIVE} .arrow {
    animation: nudge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .arrow {
    animation: pass ${DURATION.slow02};
  }${baseRule}

  @keyframes nudge {
    0% {
      transform: ${move}(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: ${move}(${icon.sign * (icon.dip ?? 3)}px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: ${move}(0);
    }
  }

  @keyframes pass {
    0% {
      transform: ${move}(0);
      animation-timing-function: ${exit.expressive};
    }
    40% {
      transform: ${move}(${icon.out}px);
      animation-timing-function: step-end;
    }
    40.1% {
      transform: ${move}(${icon.back}px);
      animation-timing-function: ${entrance.expressive};
    }
    85% {
      transform: ${move}(${icon.sign}px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: ${move}(0);
    }
  }${baseKeyframes}`,
  };
};

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

/**
 * Media controls press in like a button and spring back, from the centre.
 *
 * Productive: a small press.
 * Expressive: a deeper press that springs back past rest.
 */
export const press = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".press", [16, 16])}

  ${PRODUCTIVE} .press {
    animation: press ${DURATION.slow01};
  }

  ${EXPRESSIVE} .press {
    animation: press-spring ${DURATION.slow02};
  }

  @keyframes press {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(0.9);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes press-spring {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: scale(0.86);
      animation-timing-function: ${standard.expressive};
    }
    60% {
      transform: scale(1.04);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
});

const diagonal = (dx: number, dy: number, units: number) =>
  `translate(${Math.round(dx * units * 100) / 100}px, ${Math.round(dy * units * 100) / 100}px)`;

/**
 * Corner arrows (`.ne` top right, `.sw` bottom left) pull in toward the
 * centre and spring back. They already reach the canvas corners, so they
 * can't move out; for `Maximize` the pull reads as a wind-up.
 *
 * Productive: in 2 units and back.
 * Expressive: in 3 units, back, a smaller bounce in, and rest.
 */
export const cornersIn = (icon: Family): AnimatedIcon => {
  const frames = (name: string, dx: number, dy: number) => `  @keyframes ${name} {
    0% {
      transform: ${diagonal(dx, dy, 0)};
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: ${diagonal(dx, dy, 2)};
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: ${diagonal(dx, dy, 0)};
    }
  }

  @keyframes ${name}-bounce {
    0% {
      transform: ${diagonal(dx, dy, 0)};
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: ${diagonal(dx, dy, 3)};
      animation-timing-function: ${exit.expressive};
    }
    55% {
      transform: ${diagonal(dx, dy, 0)};
      animation-timing-function: ${entrance.expressive};
    }
    72% {
      transform: ${diagonal(dx, dy, 1)};
      animation-timing-function: ${exit.expressive};
    }
    90%,
    100% {
      transform: ${diagonal(dx, dy, 0)};
    }
  }`;

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `  ${PRODUCTIVE} .ne {
    animation: in-sw ${DURATION.slow01};
  }

  ${PRODUCTIVE} .sw {
    animation: in-ne ${DURATION.slow01};
  }

  ${EXPRESSIVE} .ne {
    animation: in-sw-bounce ${DURATION.slow02};
  }

  ${EXPRESSIVE} .sw {
    animation: in-ne-bounce ${DURATION.slow02};
  }

${frames("in-sw", -0.7071, 0.7071)}

${frames("in-ne", 0.7071, -0.7071)}`,
  };
};

/**
 * Magnifiers zoom: the lens grows (`scale` above 1) or shrinks around its
 * centre, keeping the handle inside the canvas. With another `origin`, an
 * icon grows out from that point, like `Share` from its source node.
 *
 * Productive: grows or shrinks and comes back.
 * Expressive: further, then past rest, and settles.
 */
export const zoom = (icon: Family & { scale: number; origin?: [number, number] }): AnimatedIcon => {
  const further = Math.round((1 + (icon.scale - 1) * 1.4) * 100) / 100;
  const past = Math.round((1 - (icon.scale - 1) * 0.3) * 100) / 100;

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `${origin(".lens", icon.origin ?? [13, 13])}

  ${PRODUCTIVE} .lens {
    animation: zoom ${DURATION.slow01};
  }

  ${EXPRESSIVE} .lens {
    animation: zoom-spring ${DURATION.slow02};
  }

  @keyframes zoom {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(${icon.scale});
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes zoom-spring {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: scale(${further});
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: scale(${past});
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scale(1);
    }
  }`,
  };
};

/**
 * The front sheet (`.front`) moves toward the back sheet and returns.
 *
 * Productive: halfway, 3 units.
 * Expressive: all the way onto the back sheet, then springs out past rest
 * and settles. Offset by (-6, -6), its border covers the back sheet.
 */
export const stack = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  ${PRODUCTIVE} .front {
    animation: stack ${DURATION.slow01};
  }

  ${EXPRESSIVE} .front {
    animation: duplicate ${DURATION.slow02};
  }

  @keyframes stack {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translate(-3px, -3px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes duplicate {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${standard.expressive};
    }
    32%,
    42% {
      transform: translate(-6px, -6px);
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      transform: translate(1px, 1px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translate(0, 0);
    }
  }`,
});

/**
 * Chain links (`.top` and `.bottom`) pull apart along their diagonal and
 * come back together, as far as the canvas allows. Any `.spark` lines fade
 * as they part.
 *
 * Productive: apart and back.
 * Expressive: apart, back past rest into each other, and settle.
 */
export const pullApart = (icon: Family & { distance: number }): AnimatedIcon => {
  const frames = (name: string, dx: number, dy: number) => `  @keyframes ${name} {
    0% {
      transform: ${diagonal(dx, dy, 0)};
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: ${diagonal(dx, dy, icon.distance)};
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: ${diagonal(dx, dy, 0)};
    }
  }

  @keyframes ${name}-snap {
    0% {
      transform: ${diagonal(dx, dy, 0)};
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: ${diagonal(dx, dy, icon.distance)};
      animation-timing-function: ${exit.expressive};
    }
    60% {
      transform: ${diagonal(dx, dy, -0.5)};
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: ${diagonal(dx, dy, 0)};
    }
  }`;

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `  ${PRODUCTIVE} .top {
    animation: apart-ne ${DURATION.slow01};
  }

  ${PRODUCTIVE} .bottom {
    animation: apart-sw ${DURATION.slow01};
  }

  ${EXPRESSIVE} .top {
    animation: apart-ne-snap ${DURATION.slow02};
  }

  ${EXPRESSIVE} .bottom {
    animation: apart-sw-snap ${DURATION.slow02};
  }

  ${PRODUCTIVE} .spark {
    animation: spark ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .spark {
    animation: spark ${DURATION.slow02} ${standard.expressive};
  }

${frames("apart-ne", 0.7071, -0.7071)}

${frames("apart-sw", -0.7071, 0.7071)}

  @keyframes spark {
    40% {
      opacity: 0.2;
    }
  }`,
  };
};

/**
 * An envelope's flap (`.flap`) flips open about the envelope's top edge and
 * closes. Passing through flat is how a real flap looks edge on. It opens
 * to 85-90% so its tip stays inside the canvas.
 *
 * Productive: opens and closes.
 * Expressive: opens a little further, holds, and closes.
 */
export const flap = (icon: Family & { hinge: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `${origin(".flap", icon.hinge)}${restCss(icon)}

  ${PRODUCTIVE} .flap {
    animation: open ${DURATION.slow01};
  }

  ${EXPRESSIVE} .flap {
    animation: open-hold ${DURATION.slow02};
  }

  @keyframes open {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${entrance.productive};
    }
    45% {
      transform: scaleY(-0.85);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scaleY(1);
    }
  }

  @keyframes open-hold {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${entrance.expressive};
    }
    35%,
    55% {
      transform: scaleY(-0.9);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scaleY(1);
    }
  }`,
});

/**
 * Paper planes nudge forward, or fly out through the canvas edge and come
 * back in from the opposite one. `direction` is a unit vector; `distance`
 * is how far, in units, the plane travels to clear the canvas.
 *
 * Productive: nudges `nudge` units (4 by default) forward and back. An icon
 * that already reaches the edge it flies toward recoils instead, with a
 * negative `nudge`.
 * Expressive: pulls back, flies out, and returns from the other side.
 */
export const flyOut = (
  icon: Family & { direction: [number, number]; distance: number; nudge?: number }
): AnimatedIcon => {
  const [dx, dy] = icon.direction;
  const round = (n: number) => Math.round(n * 100) / 100;
  const move = (units: number) =>
    dy === 0
      ? units === 0 ? "translateX(0)" : `translateX(${round(dx * units)}px)`
      : units === 0 ? "translate(0, 0)" : `translate(${round(dx * units)}px, ${round(dy * units)}px)`;

  return {
    name: icon.name,
    sourceHash: icon.sourceHash,
    content: icon.content,
    css: `  ${PRODUCTIVE} .plane {
    animation: nudge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .plane {
    animation: fly ${DURATION.slow02};
  }

  @keyframes nudge {
    0% {
      transform: ${move(0)};
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: ${move(icon.nudge ?? 4)};
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: ${move(0)};
    }
  }

  @keyframes fly {
    0% {
      transform: ${move(0)};
      animation-timing-function: ${entrance.expressive};
    }
    15% {
      transform: ${move(-2)};
      animation-timing-function: ${exit.expressive};
    }
    45% {
      transform: ${move(icon.distance)};
      animation-timing-function: step-end;
    }
    45.1% {
      transform: ${move(-icon.distance)};
      animation-timing-function: ${entrance.expressive};
    }
    100% {
      transform: ${move(0)};
    }
  }`,
  };
};

/** A "new" badge (`.badge`) pops about its centre, or pops in in expressive mode. */
const badgeCss = (center: [number, number]) => `${origin(".badge", center)}

  ${PRODUCTIVE} .badge {
    animation: badge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .badge {
    animation: badge-in ${DURATION.slow02};
  }

  @keyframes badge {
    0% {
      transform: scale(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scale(1.2);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes badge-in {
    0% {
      transform: scale(0);
      animation-timing-function: ${entrance.expressive};
    }
    40% {
      transform: scale(1.2);
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: scale(0.95);
      animation-timing-function: ${standard.expressive};
    }
    85%,
    100% {
      transform: scale(1);
    }
  }`;

/**
 * Rings. Carbon draws the bell as one path; the clapper is split out so it
 * can swing on its own, and the bell's bottom edge is closed where it joined.
 * Both swing from the top of the stem. A "new" badge centred on `badge`
 * pops as the bell rings.
 *
 * Productive: one short swing each way; the clapper moves with the bell.
 * Expressive: swings three times and dies out. The clapper starts later and
 * swings further, so it lags behind the bell. Past about 8°, the rim leaves
 * the canvas.
 */
export const ring = (icon: Family & { badge?: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  .bell,
  .clapper {
    transform-box: view-box;
    transform-origin: 16px 1px;
  }

  ${PRODUCTIVE} .bell,
  ${PRODUCTIVE} .clapper {
    animation: swing ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .bell {
    animation: ring ${DURATION.slow02} ${standard.expressive};
  }

  ${EXPRESSIVE} .clapper {
    animation: ring-clapper ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes swing {
    35% {
      transform: rotate(6deg);
    }
    70% {
      transform: rotate(-4deg);
    }
  }

  @keyframes ring {
    14% {
      transform: rotate(8deg);
    }
    32% {
      transform: rotate(-7deg);
    }
    50% {
      transform: rotate(5deg);
    }
    68% {
      transform: rotate(-3deg);
    }
    84% {
      transform: rotate(1deg);
    }
  }

  @keyframes ring-clapper {
    0%,
    5% {
      transform: rotate(0);
    }
    19% {
      transform: rotate(12deg);
    }
    37% {
      transform: rotate(-10deg);
    }
    55% {
      transform: rotate(7deg);
    }
    72% {
      transform: rotate(-4deg);
    }
    88% {
      transform: rotate(1.5deg);
    }
  }${icon.badge ? `\n\n${badgeCss(icon.badge)}` : ""}`,
});

/**
 * A "new" badge or a selected dot (`.badge`) pops on an icon that has no
 * motion of its own, like `EmailNew` or `RadioButtonChecked`. In
 * expressive mode the rest (`.body`), if any, hops as it lands.
 */
export const badgePop = (icon: Family & { badge: [number, number] }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${badgeCss(icon.badge)}

  ${EXPRESSIVE} .body {
    animation: hop ${DURATION.slow02};
  }

  @keyframes hop {
    0%,
    25% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    45% {
      transform: translateY(-1.5px);
      animation-timing-function: ${standard.expressive};
    }
    75%,
    100% {
      transform: translateY(0);
    }
  }`,
});

/**
 * Phones (`.handset`) buzz: a fast shake about the centre.
 *
 * Productive: one short buzz.
 * Expressive: two buzzes, like a phone ringing.
 */
export const buzz = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".handset", [16, 16])}

  ${PRODUCTIVE} .handset {
    animation: buzz ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .handset {
    animation: buzz-twice ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes buzz {
    15% {
      transform: rotate(-5deg);
    }
    35% {
      transform: rotate(5deg);
    }
    55% {
      transform: rotate(-4deg);
    }
    75% {
      transform: rotate(2deg);
    }
  }

  @keyframes buzz-twice {
    7% {
      transform: rotate(-6deg);
    }
    15% {
      transform: rotate(6deg);
    }
    23% {
      transform: rotate(-6deg);
    }
    31% {
      transform: rotate(4deg);
    }
    39%,
    50% {
      transform: rotate(0);
    }
    57% {
      transform: rotate(-6deg);
    }
    65% {
      transform: rotate(6deg);
    }
    73% {
      transform: rotate(-5deg);
    }
    81% {
      transform: rotate(3deg);
    }
    89% {
      transform: rotate(0);
    }
  }`,
});

/**
 * Rises 2 units, all the room above it, and lands.
 * Productive: a small hop.
 * Expressive: hops, squashes on its tip, and rebounds. The squash pivots on
 * the tip so the pin stays planted.
 */
export const hop = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  .pin {
    transform-box: view-box;
    transform-origin: 16px 30px;
  }

  ${PRODUCTIVE} .pin {
    animation: hop ${DURATION.slow01};
  }

  ${EXPRESSIVE} .pin {
    animation: hop-squash ${DURATION.slow02};
  }

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

  @keyframes hop-squash {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    28% {
      transform: translateY(-2px);
      animation-timing-function: ${exit.expressive};
    }
    48% {
      transform: translateY(0) scale(1.08, 0.9);
      animation-timing-function: ${standard.expressive};
    }
    70% {
      transform: scale(0.97, 1.03);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: none;
    }
  }`,
});

/**
 * Carbon draws both hands as one path; they're split in two. Every hand
 * makes whole turns, so it ends where it started. (A 30° hour step would
 * snap back when the animation ends.)
 * Productive: the long hand makes one turn.
 * Expressive: the long hand makes two turns while the short hand makes one.
 */
export const clockHands = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  loop: true,
  css: `  .short,
  .long {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }${restCss(icon)}

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
});

/**
 * Thumbs bump, pivoting at the wrist (`pivot`), by `angle` degrees. Past
 * about 9°, the cuff swings out of the canvas.
 *
 * Productive: one bump and back.
 * Expressive: a bigger bump that swings back past rest and settles.
 */
export const bump = (icon: Family & { pivot: [number, number]; angle: number }): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".hand", icon.pivot)}

  ${PRODUCTIVE} .hand {
    animation: bump ${DURATION.slow01};
  }

  ${EXPRESSIVE} .hand {
    animation: bump-swing ${DURATION.slow02};
  }

  @keyframes bump {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: rotate(${icon.angle}deg);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: rotate(0);
    }
  }

  @keyframes bump-swing {
    0% {
      transform: rotate(0);
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: rotate(${Math.round(icon.angle * 1.25 * 100) / 100}deg);
      animation-timing-function: ${standard.expressive};
    }
    60% {
      transform: rotate(${Math.round(icon.angle * -0.3 * 10) / 10}deg);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: rotate(0);
    }
  }`,
});

/**
 * Bookmarks stretch down from their top edge, like a ribbon pulled, and
 * spring back. They reach the canvas bottom, so they stretch 7% at most.
 *
 * Productive: a stretch and back.
 * Expressive: a stretch, a bounce past rest, and settle.
 */
export const ribbon = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".ribbon", [16, 2])}

  ${PRODUCTIVE} .ribbon {
    animation: stretch ${DURATION.slow01};
  }

  ${EXPRESSIVE} .ribbon {
    animation: stretch-bounce ${DURATION.slow02};
  }

  @keyframes stretch {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: scaleY(1.07);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: scaleY(1);
    }
  }

  @keyframes stretch-bounce {
    0% {
      transform: scaleY(1);
      animation-timing-function: ${entrance.expressive};
    }
    30% {
      transform: scaleY(1.07);
      animation-timing-function: ${standard.expressive};
    }
    55% {
      transform: scaleY(0.96);
      animation-timing-function: ${standard.expressive};
    }
    78% {
      transform: scaleY(1.02);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: scaleY(1);
    }
  }`,
});

/**
 * Flags flutter: the cloth skews from the pole while the pole stays still.
 * The pole and cloth are one path in Carbon, so they're split, and Carbon's
 * path is shown at rest.
 *
 * Productive: one flap.
 * Expressive: a flutter that dies out.
 */
export const flutter = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: withRest(icon),
  css: `${origin(".cloth", [6, 11])}${restCss(icon)}

  ${PRODUCTIVE} .cloth {
    animation: flap ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .cloth {
    animation: flutter ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes flap {
    40% {
      transform: skewY(-5deg);
    }
  }

  @keyframes flutter {
    18% {
      transform: skewY(-6deg);
    }
    40% {
      transform: skewY(4deg);
    }
    62% {
      transform: skewY(-2.5deg);
    }
    82% {
      transform: skewY(1deg);
    }
  }`,
});

/**
 * A paperclip wiggles about its centre.
 *
 * Productive: one wiggle each way.
 * Expressive: four wiggles that die out.
 */
export const wiggle = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".clip", [16, 16])}

  ${PRODUCTIVE} .clip {
    animation: wiggle ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .clip {
    animation: wiggle-hard ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes wiggle {
    35% {
      transform: rotate(-6deg);
    }
    70% {
      transform: rotate(4deg);
    }
  }

  @keyframes wiggle-hard {
    16% {
      transform: rotate(-8deg);
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
 * A bulb (`.glow`) flickers on. Opacity only, so nothing moves.
 *
 * Productive: one flicker.
 * Expressive: a few flickers, like a bulb catching.
 */
export const flicker = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  ${PRODUCTIVE} .glow {
    animation: flicker ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .glow {
    animation: flicker-catch ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes flicker {
    30% {
      opacity: 0.3;
    }
  }

  @keyframes flicker-catch {
    12% {
      opacity: 0.25;
    }
    24% {
      opacity: 1;
    }
    36% {
      opacity: 0.4;
    }
    52% {
      opacity: 1;
    }
    64% {
      opacity: 0.7;
    }
  }`,
});

/**
 * A person's head (`.head`) nods.
 *
 * Productive: one nod.
 * Expressive: a nod and a smaller second one.
 */
export const nod = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  ${PRODUCTIVE} .head {
    animation: nod ${DURATION.slow01};
  }

  ${EXPRESSIVE} .head {
    animation: nod-twice ${DURATION.slow02};
  }

  @keyframes nod {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(2px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes nod-twice {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    25% {
      transform: translateY(2px);
      animation-timing-function: ${standard.expressive};
    }
    50% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    72% {
      transform: translateY(1px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }`,
});

/**
 * Sort icons: the arrow (`.arrow`) pushes down, and in expressive mode the
 * bars (`.bar`) line up in turn (`--i`), growing out from their right
 * ends. The bars are solid, so scaling them along their length keeps their
 * weight.
 *
 * Productive: the arrow dips.
 * Expressive: the arrow dips past rest and settles while the bars grow in.
 */
export const sort = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `${origin(".bar", [16, 16])}

  ${PRODUCTIVE} .arrow {
    animation: dip ${DURATION.slow01};
  }

  ${EXPRESSIVE} .arrow {
    animation: dip-spring ${DURATION.slow02};
  }

  ${EXPRESSIVE} .bar {
    animation: line-up ${DURATION.slow01} ${entrance.expressive} calc(var(--i) * ${DURATION.fast02}) backwards;
  }

  @keyframes dip {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: translateY(3px);
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes dip-spring {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: translateY(3px);
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: translateY(-0.75px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes line-up {
    from {
      transform: scaleX(0.4);
    }
  }`,
});

/**
 * An error badge (`.shake`) shakes side to side, like `ErrorFilled` does
 * once its slash is drawn.
 *
 * Productive: one shake.
 * Expressive: four shakes that die out.
 */
export const shake = (icon: Family): AnimatedIcon => ({
  name: icon.name,
  sourceHash: icon.sourceHash,
  content: icon.content,
  css: `  ${PRODUCTIVE} .shake {
    animation: shake ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .shake {
    animation: shake-hard ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes shake {
    25% {
      transform: translateX(-1.5px);
    }
    60% {
      transform: translateX(1.5px);
    }
  }

  @keyframes shake-hard {
    14% {
      transform: translateX(-2px);
    }
    32% {
      transform: translateX(2px);
    }
    50% {
      transform: translateX(-1.5px);
    }
    68% {
      transform: translateX(1px);
    }
    84% {
      transform: translateX(-0.5px);
    }
  }`,
});
