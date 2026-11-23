import { drawIn, ink } from "../families.js";

export default drawIn({
  name: "EditOff",
  sourceHash: "6250f6ab899f",
  rest: `<path d="M30,28.6L3.4,2L2,3.4l10.1,10.1L4,21.6V28h6.4l8.1-8.1L28.6,30L30,28.6z M9.6,26H6v-3.6l7.5-7.5l3.6,3.6L9.6,26z" />
    <path d="M29.4,6.2L29.4,6.2l-3.6-3.6c-0.8-0.8-2-0.8-2.8,0l0,0l0,0l-8,8l1.4,1.4L20,8.4l3.6,3.6L20,15.6l1.4,1.4l8-8	C30.2,8.2,30.2,7,29.4,6.2L29.4,6.2z M25,10.6L21.4,7l3-3L28,7.6L25,10.6z" />`,
  content: `<mask id="{id}-slash" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <path fill="#000" d="M3.4,2 30,28.6 28.6,30 2,3.4Z" />
    ${ink("M1 1 31 31", 2.8)}
  </mask>
  <g class="accent">
    <path mask="url(#{id}-slash)" d="M30,28.6L3.4,2L2,3.4l10.1,10.1L4,21.6V28h6.4l8.1-8.1L28.6,30L30,28.6z M9.6,26H6v-3.6l7.5-7.5l3.6,3.6L9.6,26z" />
    <path d="M29.4,6.2L29.4,6.2l-3.6-3.6c-0.8-0.8-2-0.8-2.8,0l0,0l0,0l-8,8l1.4,1.4L20,8.4l3.6,3.6L20,15.6l1.4,1.4l8-8	C30.2,8.2,30.2,7,29.4,6.2L29.4,6.2z M25,10.6L21.4,7l3-3L28,7.6L25,10.6z" />
  </g>`,
  accent: "flinch",
});
