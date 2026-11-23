import { restCss, withRest } from "../families.js";
import { DURATION, EASING, EXPRESSIVE, PRODUCTIVE, type AnimatedIcon } from "../shared.js";

const { entrance, standard } = EASING;

const parts = {
  rest: `<path d="M28,9H25V3H7V9H4a2,2,0,0,0-2,2V21a2,2,0,0,0,2,2H7v6H25V23h3a2,2,0,0,0,2-2V11A2,2,0,0,0,28,9ZM9,5H23V9H9ZM23,27H9V17H23Zm5-6H25V15H7v6H4V11H28Z" />`,
  content: `<path d="M28,9H25V3H7V9H4a2,2,0,0,0-2,2V21a2,2,0,0,0,2,2H7V21H4V11H28V21H25v2h3a2,2,0,0,0,2-2V11A2,2,0,0,0,28,9ZM9,5H23V9H9Z" />
  <path class="paper" d="M7,15H25V29H7ZM9,17V27H23V17Z" />`,
};

/**
 * The paper feeds out of the printer. It's split out of Carbon's path. At
 * rest, Carbon's path shows instead.
 * Productive: the paper slides out and back.
 * Expressive: the paper feeds out in two steps, like lines printing, and
 * slides back.
 */
export default {
  name: "Printer",
  sourceHash: "e7bb1662a488",
  content: withRest(parts),
  css: `  ${PRODUCTIVE} .paper {
    animation: feed ${DURATION.slow01};
  }

  ${EXPRESSIVE} .paper {
    animation: print ${DURATION.slow02};
  }

  @keyframes feed {
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

  @keyframes print {
    0% {
      transform: translateY(0);
      animation-timing-function: ${entrance.expressive};
    }
    20%,
    35% {
      transform: translateY(1.25px);
      animation-timing-function: ${entrance.expressive};
    }
    55%,
    70% {
      transform: translateY(2.5px);
      animation-timing-function: ${standard.expressive};
    }
    100% {
      transform: translateY(0);
    }
  }${restCss(parts)}`,
} satisfies AnimatedIcon;
