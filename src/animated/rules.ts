/**
 * Rule-based animated icons: the whole icon moves, so they're generated
 * from the `@carbon/icons` descriptor instead of being split by hand.
 *
 * The list is explicit, not a name pattern, because an icon only fits a rule
 * if its drawing does. Left out on purpose:
 *
 * - Glyphs (`CaretDownGlyph`): their viewBox hugs the shape, so there's no
 *   room to move inside it.
 * - Icons with a number or badge (`Forward_10`, `RepeatOne`, `UpdateNow`):
 *   turning would turn the text.
 * - Icons drawn inside a circle (`SkipForwardOutline`): the circle would move too.
 * - `Rotate*`: the square turns on its own, so they're hand-built.
 */

import type { IconOutput } from "@carbon/icons";
import { renderContent } from "../template.js";
import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, hashSource, type AnimatedIcon } from "./shared.js";

const { entrance, standard } = EASING;

type Rule =
  /**
   * Moves the way it points. `x` and `y` are -1, 0 or 1. `room` caps the
   * distance for icons that already reach the edge they move toward.
   */
  | { kind: "nudge"; x: number; y: number; room?: number }
  /** Turns a full revolution the way its arrows go: 1 is clockwise. */
  | { kind: "turn"; direction: 1 | -1 };

const nudge = (x: number, y: number, room?: number): Rule => ({ kind: "nudge", x, y, room });
const turn = (direction: 1 | -1): Rule => ({ kind: "turn", direction });

const RIGHT = nudge(1, 0);
const LEFT = nudge(-1, 0);
const UP = nudge(0, -1);
const DOWN = nudge(0, 1);

export const RULES: Record<string, Rule> = {
  ArrowDown: DOWN,
  ArrowDownLeft: nudge(-1, 1),
  ArrowDownRight: nudge(1, 1),
  ArrowLeft: LEFT,
  ArrowRight: RIGHT,
  ArrowShiftDown: nudge(0, 1, 2),
  ArrowUp: UP,
  ArrowUpLeft: nudge(-1, -1),
  ArrowUpRight: nudge(1, -1),
  CaretDown: DOWN,
  CaretLeft: LEFT,
  CaretRight: RIGHT,
  CaretUp: UP,
  ChevronDown: DOWN,
  ChevronLeft: LEFT,
  ChevronUp: UP,
  DoubleChevronLeft: LEFT,
  DoubleChevronRight: RIGHT,
  JumpLink: DOWN,
  PageFirst: LEFT,
  PageLast: RIGHT,
  Recycle: turn(1),
  Redo: RIGHT,
  RenewAlt: turn(-1),
  Repeat: turn(1),
  Reset: turn(-1),
  Restart: turn(1),
  SkipBack: nudge(-1, 0, 2),
  SkipBackFilled: nudge(-1, 0, 2),
  SkipForward: nudge(1, 0, 2),
  SkipForwardFilled: nudge(1, 0, 2),
  Undo: LEFT,
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Diagonals cover the same distance as straight nudges. */
const toward = ({ x, y }: { x: number; y: number }, distance: number) => {
  const scale = distance / Math.hypot(x, y);
  return `translate(${round(x * scale)}px, ${round(y * scale)}px)`;
};

const nudgeCss = (rule: { x: number; y: number; room?: number }) => {
  const near = Math.min(3, rule.room ?? 3);
  const far = Math.min(4, rule.room ?? 4);

  return `  ${PRODUCTIVE} .icon {
    animation: nudge ${DURATION.slow01};
  }

  ${EXPRESSIVE} .icon {
    animation: nudge-spring ${DURATION.slow02};
  }

  @keyframes nudge {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.productive};
    }
    40% {
      transform: ${toward(rule, near)};
      animation-timing-function: ${standard.productive};
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes nudge-spring {
    0% {
      transform: translate(0, 0);
      animation-timing-function: ${entrance.expressive};
    }
    35% {
      transform: ${toward(rule, far)};
      animation-timing-function: ${standard.expressive};
    }
    65% {
      transform: ${toward(rule, -1)};
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translate(0, 0);
    }
  }`;
};

// A full turn ends where it started whatever the icon's symmetry. Shrinking
// mid-turn keeps the corners of wide icons like `Repeat` inside the canvas.
const turnCss = ({ direction }: { direction: 1 | -1 }) => `  .icon {
    transform-box: view-box;
    transform-origin: 16px 16px;
  }

  ${PRODUCTIVE} .icon {
    animation:
      turn ${DURATION.slow01} ${standard.productive},
      shrink ${DURATION.slow01} ${standard.productive};
  }

  ${EXPRESSIVE} .icon {
    animation:
      turn-overshoot ${DURATION.slow02},
      shrink-hold ${DURATION.slow02} ${standard.expressive};
  }

  @keyframes turn {
    to {
      rotate: ${direction * 360}deg;
    }
  }

  @keyframes turn-overshoot {
    0% {
      rotate: 0deg;
      animation-timing-function: ${entrance.expressive};
    }
    75% {
      rotate: ${direction * 375}deg;
      animation-timing-function: ${standard.expressive};
    }
    100% {
      rotate: ${direction * 360}deg;
    }
  }

  @keyframes shrink {
    50% {
      scale: 0.9;
    }
  }

  @keyframes shrink-hold {
    12%,
    88% {
      scale: 0.9;
    }
  }`;

export const ruleIcons = (lookup: (name: string) => IconOutput | undefined): AnimatedIcon[] =>
  Object.entries(RULES).map(([name, rule]) => {
    const descriptor = lookup(name)?.descriptor;

    if (!descriptor) {
      throw new Error(`Animated icon has no static icon: ${name}`);
    }

    if (descriptor.attrs.viewBox !== "0 0 32 32") {
      throw new Error(`Rule-based animated icon needs a 32×32 viewBox: ${name}`);
    }

    return {
      name,
      sourceHash: hashSource(descriptor),
      content: `<g class="icon">${renderContent(descriptor)}</g>`,
      css: rule.kind === "nudge" ? nudgeCss(rule) : turnCss(rule),
    };
  });
