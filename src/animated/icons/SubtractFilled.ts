import { squeeze } from "../families.js";

export default squeeze({
  name: "SubtractFilled",
  sourceHash: "823fd62f66c0",
  rest: `<path d="m16,2c-7.6,0-14,6.4-14,14s6.4,14,14,14,14-6.4,14-14S23.6,2,16,2Zm8,15H8v-2h16v2Z" />
    <path fill="none" d="M24 17 8 17 8 15 24 15 24 17z" />`,
  content: `<mask id="{id}-bar" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <path class="bar" fill="#000" d="M24 17 8 17 8 15 24 15 24 17z" />
  </mask>
  <path mask="url(#{id}-bar)" d="m16,2c-7.6,0-14,6.4-14,14s6.4,14,14,14,14-6.4,14-14S23.6,2,16,2Z" />`,
});
