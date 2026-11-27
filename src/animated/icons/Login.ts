import { passThrough } from "../families.js";

export default passThrough({
  name: "Login",
  sourceHash: "dde3fb63a584",
  content: `<clipPath id="{id}-clip">
    <rect width="26" height="32" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M14.59 20.59 18.17 17 4 17 4 15 18.17 15 14.59 11.41 16 10 22 16 16 22 14.59 20.59z" />
  </g>
  <path class="door" d="M26,30H14a2,2,0,0,1-2-2V25h2v3H26V4H14V7H12V4a2,2,0,0,1,2-2H26a2,2,0,0,1,2,2V28A2,2,0,0,1,26,30Z" />`,
  base: "door",
  sign: 1,
  out: 24,
  back: -24,
  axis: "x",
});
