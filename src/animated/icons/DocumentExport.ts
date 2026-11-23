import { passThrough } from "../families.js";

export default passThrough({
  name: "DocumentExport",
  sourceHash: "a6a3d4f8ef8c",
  content: `<clipPath id="{id}-clip">
    <rect x="4" width="28" height="32" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M13 21 26.17 21 23.59 23.59 25 25 30 20 25 15 23.59 16.41 26.17 19 13 19 13 21z" />
  </g>
  <path d="M22,14V10a1,1,0,0,0-.29-.71l-7-7A1,1,0,0,0,14,2H4A2,2,0,0,0,2,4V28a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V26H20v2H4V4h8v6a2,2,0,0,0,2,2h6v2Zm-8-4V4.41L19.59,10Z" />`,
  sign: 1,
  out: 20,
  back: -26,
  dip: 2,
  axis: "x",
});
