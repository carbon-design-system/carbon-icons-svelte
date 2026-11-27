import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "CheckboxCheckedFilled",
  sourceHash: "7448e1bd69a8",
  rest: `<path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM14,21.5,9,16.5427,10.5908,15,14,18.3456,21.4087,11l1.5918,1.5772Z" />
    <path fill="none" d="M14,21.5,9,16.5427,10.5908,15,14,18.3456,21.4087,11l1.5918,1.5772Z" data-icon-path="inner-path" />`,
  content: `<mask id="{id}-hole" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    ${ink("M9.7954 15.7714 14 19.9228 22.2046 11.7886", 2.25, "#000")}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-hole)" d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4Z" />
  </g>`,
  accent: "pop",
});
