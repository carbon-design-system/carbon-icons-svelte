import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "Analytics",
  sourceHash: "fa96d1fb776d",
  rest: `<path d="M4,2H2V28a2,2,0,0,0,2,2H30V28H4Z" />
    <path d="M30,9H23v2h3.59L19,18.59l-4.29-4.3a1,1,0,0,0-1.42,0L6,21.59,7.41,23,14,16.41l4.29,4.3a1,1,0,0,0,1.42,0L28,12.41V16h2Z" />`,
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    ${ink("M5.3 23.7 14 15 19 20 29 10M23 10H30M29 9V16", 3)}
  </mask>
  <g class="accent">
    <path d="M4,2H2V28a2,2,0,0,0,2,2H30V28H4Z" />
    <path mask="url(#{id}-ink)" d="M30,9H23v2h3.59L19,18.59l-4.29-4.3a1,1,0,0,0-1.42,0L6,21.59,7.41,23,14,16.41l4.29,4.3a1,1,0,0,0,1.42,0L28,12.41V16h2Z" />
  </g>`,
  accent: "pop",
});
