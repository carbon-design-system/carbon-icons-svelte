import { passThrough } from "../families.js";

export default passThrough({
  name: "UpToTop",
  sourceHash: "4ff3ba562001",
  content: `<clipPath id="{id}-clip">
    <rect y="10" width="32" height="22" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M16 14 6 24 7.4 25.4 16 16.8 24.6 25.4 26 24z" />
  </g>
  <path class="bar" d="M4 8H28V10H4z" />`,
  base: "bar",
  sign: -1,
  out: -24,
  back: 24,
});
