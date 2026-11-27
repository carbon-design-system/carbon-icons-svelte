import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "CheckmarkFilled",
  sourceHash: "df54560705ca",
  rest: `<path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM14,21.5908l-5-5L10.5906,15,14,18.4092,21.41,11l1.5957,1.5859Z" />
    <path fill="none" d="M14 21.591 9 16.591 10.591 15 14 18.409 21.41 11 23.005 12.585 14 21.591z" data-icon-path="inner-path" />`,
  content: `<mask id="{id}-hole" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    ${ink("M9.7953 15.7954 14 20 22.2079 11.793", 2.25, "#000")}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-hole)" d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Z" />
  </g>`,
  accent: "pop",
});
