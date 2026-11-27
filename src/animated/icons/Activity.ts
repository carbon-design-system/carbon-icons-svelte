import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "Activity",
  sourceHash: "6ad7e9d4dc8a",
  rest: `<path d="M12,29a1,1,0,0,1-.92-.62L6.33,17H2V15H7a1,1,0,0,1,.92.62L12,25.28,20.06,3.65A1,1,0,0,1,21,3a1,1,0,0,1,.93.68L25.72,15H30v2H25a1,1,0,0,1-.95-.68L21,7,12.94,28.35A1,1,0,0,1,12,29Z" />`,
  content: `<mask id="{id}-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    ${ink("M1 16H7L12 27 21 5 25 16H31", 3.5)}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-ink)" d="M12,29a1,1,0,0,1-.92-.62L6.33,17H2V15H7a1,1,0,0,1,.92.62L12,25.28,20.06,3.65A1,1,0,0,1,21,3a1,1,0,0,1,.93.68L25.72,15H30v2H25a1,1,0,0,1-.95-.68L21,7,12.94,28.35A1,1,0,0,1,12,29Z" />
  </g>`,
  accent: "pop",
});
