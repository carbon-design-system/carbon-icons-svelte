import { passThrough } from "../families.js";

export default passThrough({
  name: "DocumentDownload",
  sourceHash: "89de7ca6e6d8",
  content: `<clipPath id="{id}-clip">
    <rect x="18" y="16" width="14" height="16" />
  </clipPath>
  <g clip-path="url(#{id}-clip)">
    <path class="arrow" d="M30 25 28.586 23.586 26 26.172 26 18 24 18 24 26.172 21.414 23.586 20 25 25 30 30 25z" />
  </g>
  <path d="M18,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v3l2,0V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2H18ZM18,4.4,23.6,10H18Z" />`,
  sign: 1,
  out: 16,
  back: -14,
  dip: 2,
});
