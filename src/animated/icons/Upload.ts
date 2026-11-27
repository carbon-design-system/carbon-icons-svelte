import { passThrough } from "../families.js";

export default passThrough({
  name: "Upload",
  sourceHash: "e495e777d9ff",
  content: `<clipPath id="{id}-clip">
    <rect y="4" width="32" height="28" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M6 18 7.41 19.41 15 11.83 15 30 17 30 17 11.83 24.59 19.41 26 18 16 8 6 18z" />
  </g>
  <path class="bracket" d="M6,8V4H26V8h2V4a2,2,0,0,0-2-2H6A2,2,0,0,0,4,4V8Z" />`,
  base: "bracket",
  sign: -1,
  out: -24,
  back: 24,
});
