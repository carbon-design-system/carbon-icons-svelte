import { passThrough } from "../families.js";

export default passThrough({
  name: "DownToBottom",
  sourceHash: "c9086b586607",
  content: `<clipPath id="{id}-clip">
    <rect width="32" height="22" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M16 18 6 8 7.4 6.6 16 15.2 24.6 6.6 26 8z" />
  </g>
  <path class="bar" d="M4 22H28V24H4z" />`,
  base: "bar",
  sign: 1,
  out: 24,
  back: -24,
});
