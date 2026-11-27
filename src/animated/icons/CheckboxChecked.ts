import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "CheckboxChecked",
  sourceHash: "df95cb798f2e",
  rest: `<path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM6,26V6H26V26Z" />
    <path d="M14 21.5 9 16.54 10.59 15 14 18.35 21.41 11 23 12.58 14 21.5z" />`,
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    ${ink("M8 14 14 20 24 10", 3.5)}
  </mask>
  <g class="accent">
    <path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM6,26V6H26V26Z" />
    <path mask="url(#{id}-ink)" d="M14 21.5 9 16.54 10.59 15 14 18.35 21.41 11 23 12.58 14 21.5z" />
  </g>`,
  accent: "pop",
});
