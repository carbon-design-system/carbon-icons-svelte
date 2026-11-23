import { drawIn, slash } from "../families.js";

export default drawIn({
  name: "VideoOff",
  sourceHash: "8957a259078e",
  rest: `<path d="M29.46,8.11a1,1,0,0,0-1,.08L23,12.06V10.44l7-7L28.56,2,2,28.56,3.44,30l4-4H21a2,2,0,0,0,2-2V19.94l5.42,3.87A1,1,0,0,0,30,23V9A1,1,0,0,0,29.46,8.11ZM28,21.06l-5.42-3.87A1,1,0,0,0,21,18v6H9.44L21,12.44V14a1,1,0,0,0,1.58.81L28,10.94Z" />
    <path d="M4,24V8H20V6H4A2,2,0,0,0,2,8V24Z" />`,
  content: `<mask id="{id}-slash" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    ${slash("M31 1 1 31")}
  </mask>
  <g class="accent">
    <path d="M4,24V8H20V6H4A2,2,0,0,0,2,8V24Z" />
    <path mask="url(#{id}-slash)" d="M29.46,8.11a1,1,0,0,0-1,.08L23,12.06V10.44l7-7L28.56,2,2,28.56,3.44,30l4-4H21a2,2,0,0,0,2-2V19.94l5.42,3.87A1,1,0,0,0,30,23V9A1,1,0,0,0,29.46,8.11ZM28,21.06l-5.42-3.87A1,1,0,0,0,21,18v6H9.44L21,12.44V14a1,1,0,0,0,1.58.81L28,10.94Z" />
  </g>`,
  accent: "flinch",
});
