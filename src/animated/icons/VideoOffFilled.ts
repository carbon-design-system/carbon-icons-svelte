import { drawIn, slash } from "../families.js";

export default drawIn({
  name: "VideoOffFilled",
  sourceHash: "60144ea098af",
  rest: `<path d="M20.31,6H4A2,2,0,0,0,2,8V24a2.85,2.85,0,0,0,0,.29Z" />
    <path d="M29.46,8.11a1,1,0,0,0-1,.08L23,12.06V10.44l7-7L28.56,2,2,28.56,3.44,30l4-4H21a2,2,0,0,0,2-2V19.94l5.42,3.87A1,1,0,0,0,30,23V9A1,1,0,0,0,29.46,8.11Z" />`,
  content: `<mask id="{id}-slash" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    ${slash("M31 1 1 31")}
  </mask>
  <g class="accent">
    <path d="M20.31,6H4A2,2,0,0,0,2,8V24a2.85,2.85,0,0,0,0,.29Z" />
    <path mask="url(#{id}-slash)" d="M29.46,8.11a1,1,0,0,0-1,.08L23,12.06V10.44l7-7L28.56,2,2,28.56,3.44,30l4-4H21a2,2,0,0,0,2-2V19.94l5.42,3.87A1,1,0,0,0,30,23V9A1,1,0,0,0,29.46,8.11Z" />
  </g>`,
  accent: "flinch",
});
