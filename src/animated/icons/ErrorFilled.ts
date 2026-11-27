import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "ErrorFilled",
  sourceHash: "c0585d77441b",
  rest: `<path fill="none" d="M14.9 7.2H17.1V24.799H14.9z" data-icon-path="inner-path" transform="rotate(-45 16 16)" />
    <path d="M16,2A13.914,13.914,0,0,0,2,16,13.914,13.914,0,0,0,16,30,13.914,13.914,0,0,0,30,16,13.914,13.914,0,0,0,16,2Zm5.4449,21L9,10.5557,10.5557,9,23,21.4448Z" />`,
  content: `<mask id="{id}-hole" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    ${ink("M9.7779 9.7779 22.2224 22.2224", 2.2, "#000")}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-hole)" d="M16,2A13.914,13.914,0,0,0,2,16,13.914,13.914,0,0,0,16,30,13.914,13.914,0,0,0,30,16,13.914,13.914,0,0,0,16,2Z" />
  </g>`,
  accent: "shake",
});
