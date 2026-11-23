import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "Error",
  sourceHash: "7c92f0f910f2",
  rest: `<path d="M2,16H2A14,14,0,1,0,16,2,14,14,0,0,0,2,16Zm23.15,7.75L8.25,6.85a12,12,0,0,1,16.9,16.9ZM8.24,25.16A12,12,0,0,1,6.84,8.27L23.73,25.16a12,12,0,0,1-15.49,0Z" />`,
  content: `<mask id="{id}-slash" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <path fill="#000" d="M8.25,6.85 25.15,23.75 23.73,25.16 6.84,8.27Z" />
    ${ink("M6.5 6.5 25.5 25.5", 2.8)}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-slash)" d="M2,16H2A14,14,0,1,0,16,2,14,14,0,0,0,2,16Zm23.15,7.75L8.25,6.85a12,12,0,0,1,16.9,16.9ZM8.24,25.16A12,12,0,0,1,6.84,8.27L23.73,25.16a12,12,0,0,1-15.49,0Z" />
  </g>`,
  accent: "shake",
});
