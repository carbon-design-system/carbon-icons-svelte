import { hopDot } from "../families.js";

export default hopDot({
  name: "InformationSquareFilled",
  sourceHash: "f8750a8b9e1c",
  rest: `<path fill="none" d="M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z" data-icon-path="inner-path" />
    <path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z" />`,
  content: `<mask id="{id}-glyph" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <g fill="#000">
      <path class="stem" d="M20,24.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z" />
      <path class="dot" d="M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Z" />
    </g>
  </mask>
  <path mask="url(#{id}-glyph)" d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4Z" />`,
});
