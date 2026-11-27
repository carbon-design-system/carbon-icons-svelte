import { pendingDots } from "../families.js";

export default pendingDots({
  name: "PendingFilled",
  sourceHash: "64580db520e6",
  rest: `<path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM8,18a2,2,0,1,1,2-2A2,2,0,0,1,8,18Zm8,0a2,2,0,1,1,2-2A2,2,0,0,1,16,18Zm8,0a2,2,0,1,1,2-2A2,2,0,0,1,24,18Z" />
    <path fill="none" d="M10,16a2,2,0,1,1-2-2A2,2,0,0,1,10,16Zm6-2a2,2,0,1,0,2,2A2,2,0,0,0,16,14Zm8,0a2,2,0,1,0,2,2A2,2,0,0,0,24,14Z" data-icon-path="inner-path" />`,
  content: `<mask id="{id}-dots" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <g fill="#000">
      <circle class="dot-0" style="transform-origin: 8px 16px" cx="8" cy="16" r="2" />
      <circle class="dot-1" style="transform-origin: 16px 16px" cx="16" cy="16" r="2" />
      <circle class="dot-2" style="transform-origin: 24px 16px" cx="24" cy="16" r="2" />
    </g>
  </mask>
  <path mask="url(#{id}-dots)" d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Z" />`,
});
