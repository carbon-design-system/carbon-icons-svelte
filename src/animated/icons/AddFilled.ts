import { quarterTurn } from "../families.js";

export default quarterTurn({
  name: "AddFilled",
  sourceHash: "9ce809b5eda4",
  rest: `<path d="M16,2A14.1725,14.1725,0,0,0,2,16,14.1725,14.1725,0,0,0,16,30,14.1725,14.1725,0,0,0,30,16,14.1725,14.1725,0,0,0,16,2Zm8,15H17v7H15V17H8V15h7V8h2v7h7Z" />
    <path fill="none" d="M24 17 17 17 17 24 15 24 15 17 8 17 8 15 15 15 15 8 17 8 17 15 24 15 24 17z" data-icon-path="inner-path" />`,
  content: `<mask id="{id}-glyph" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <path class="glyph" fill="#000" d="M24 17 17 17 17 24 15 24 15 17 8 17 8 15 15 15 15 8 17 8 17 15 24 15 24 17z" />
  </mask>
  <path mask="url(#{id}-glyph)" d="M16,2A14.1725,14.1725,0,0,0,2,16,14.1725,14.1725,0,0,0,16,30,14.1725,14.1725,0,0,0,30,16,14.1725,14.1725,0,0,0,16,2Z" />`,
});
