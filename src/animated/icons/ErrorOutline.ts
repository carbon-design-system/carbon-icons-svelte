import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "ErrorOutline",
  sourceHash: "fc4468a49384",
  rest: `<path d="M14.9 7.2H17.1V24.799H14.9z" transform="rotate(-45 16 16)" />
    <path d="M16,2A13.9138,13.9138,0,0,0,2,16,13.9138,13.9138,0,0,0,16,30,13.9138,13.9138,0,0,0,30,16,13.9138,13.9138,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12.0353,12.0353,0,0,1,16,28Z" />`,
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    ${ink("M6.5 6.5 25.5 25.5", 3)}
  </mask>
  <g class="accent">
    <g mask="url(#{id}-ink)">
      <path d="M14.9 7.2H17.1V24.799H14.9z" transform="rotate(-45 16 16)" />
    </g>
    <path d="M16,2A13.9138,13.9138,0,0,0,2,16,13.9138,13.9138,0,0,0,16,30,13.9138,13.9138,0,0,0,30,16,13.9138,13.9138,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12.0353,12.0353,0,0,1,16,28Z" />
  </g>`,
  accent: "shake",
});
