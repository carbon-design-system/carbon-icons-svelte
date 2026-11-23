import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "CheckmarkOutline",
  sourceHash: "25035bf7a868",
  rest: `<path d="M14 21.414 9 16.413 10.413 15 14 18.586 21.585 11 23 12.415 14 21.414z" />
    <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28Z" />`,
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    ${ink("M8 14 14 20 24 10", 3.5)}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-ink)" d="M14 21.414 9 16.413 10.413 15 14 18.586 21.585 11 23 12.415 14 21.414z" />
    <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28Z" />
  </g>`,
  accent: "pop",
});
