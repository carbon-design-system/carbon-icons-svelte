import { passThrough } from "../families.js";

export default passThrough({
  name: "Download",
  sourceHash: "9a31c81c721f",
  content: `<clipPath id="{id}-clip">
    <rect width="32" height="28" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14z" />
  </g>
  <path class="tray" d="M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z" />`,
  base: "tray",
  sign: 1,
  out: 24,
  back: -24,
});
