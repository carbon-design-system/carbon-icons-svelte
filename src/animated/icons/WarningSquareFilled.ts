import { rockMark } from "../families.js";

export default rockMark({
  name: "WarningSquareFilled",
  sourceHash: "ea025d170791",
  rest: `<path d="M26.0022,4H5.998A1.998,1.998,0,0,0,4,5.998V26.002A1.998,1.998,0,0,0,5.998,28H26.0022A1.9979,1.9979,0,0,0,28,26.002V5.998A1.9979,1.9979,0,0,0,26.0022,4ZM14.8752,8h2.25V18h-2.25ZM16,24a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,24Z" />
    <path fill="none" d="M14.8751,8h2.25V18h-2.25ZM16,24a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,24Z" data-icon-path="inner-path" />`,
  content: `<mask id="{id}-mark" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <g class="mark" fill="#000">
      <path d="M14.8752,8h2.25V18h-2.25Z" />
      <path d="M16,24a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,24Z" />
    </g>
  </mask>
  <path mask="url(#{id}-mark)" d="M26.0022,4H5.998A1.998,1.998,0,0,0,4,5.998V26.002A1.998,1.998,0,0,0,5.998,28H26.0022A1.9979,1.9979,0,0,0,28,26.002V5.998A1.9979,1.9979,0,0,0,26.0022,4Z" />`,
  pivot: [16, 22.5],
});
