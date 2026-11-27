import { passThrough } from "../families.js";

export default passThrough({
  name: "Logout",
  sourceHash: "31e9b680ecd7",
  content: `<clipPath id="{id}-clip">
    <rect x="6" width="26" height="32" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M20.586 20.586 24.172 17 10 17 10 15 24.172 15 20.586 11.414 22 10 28 16 22 22 20.586 20.586z" />
  </g>
  <path class="door" d="M6,30H18a2.0023,2.0023,0,0,0,2-2V25H18v3H6V4H18V7h2V4a2.0023,2.0023,0,0,0-2-2H6A2.0023,2.0023,0,0,0,4,4V28A2.0023,2.0023,0,0,0,6,30Z" />`,
  base: "door",
  sign: 1,
  out: 24,
  back: -24,
  axis: "x",
});
