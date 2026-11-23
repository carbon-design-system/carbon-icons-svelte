import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "MicrophoneOff",
  sourceHash: "27a851d8c214",
  rest: `<path d="M9.18,18.57A7.41,7.41,0,0,1,9,17V14H7v3a8.84,8.84,0,0,0,.58,3.18Z" />
    <path d="M13,15V7a3,3,0,0,1,6,0V8.75l2-2A5,5,0,0,0,11,7v8Z" />
    <path d="M23,17a7,7,0,0,1-11.73,5.14l1.42-1.41A5,5,0,0,0,21,17V12.42l9-9L28.59,2,2,28.59,3.41,30l6.44-6.44A8.91,8.91,0,0,0,15,25.94V28H11v2H21V28H17V25.94A9,9,0,0,0,25,17V14H23Zm-4,0a3,3,0,0,1-4.9,2.31L19,14.42Z" />`,
  content: `<mask id="{id}-slash" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <path fill="#000" d="M28.59,2 30,3.42 3.41,30 2,28.59Z" />
    ${ink("M31 1 1 31", 2.8)}
  </mask>
  <g class="accent">
    <path d="M9.18,18.57A7.41,7.41,0,0,1,9,17V14H7v3a8.84,8.84,0,0,0,.58,3.18Z" />
    <path d="M13,15V7a3,3,0,0,1,6,0V8.75l2-2A5,5,0,0,0,11,7v8Z" />
    <path mask="url(#{id}-slash)" d="M23,17a7,7,0,0,1-11.73,5.14l1.42-1.41A5,5,0,0,0,21,17V12.42l9-9L28.59,2,2,28.59,3.41,30l6.44-6.44A8.91,8.91,0,0,0,15,25.94V28H11v2H21V28H17V25.94A9,9,0,0,0,25,17V14H23Zm-4,0a3,3,0,0,1-4.9,2.31L19,14.42Z" />
  </g>`,
  accent: "flinch",
});
