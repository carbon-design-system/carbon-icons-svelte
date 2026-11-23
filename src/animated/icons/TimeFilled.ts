import { clockHands } from "../families.js";

export default clockHands({
  name: "TimeFilled",
  sourceHash: "fa4a88e2358b",
  rest: `<path d="m16,2c-7.6001,0-14,6.3999-14,14s6.3999,14,14,14,14-6.3999,14-14S23.6001,2,16,2Zm4.5872,20l-5.5872-5.5898V7h2v8.582l5,5.0044-1.4128,1.4136Z" />
    <path fill="none" d="M20.5872 22 15 16.4099 15 7 17 7 17 15.5822 22 20.5866 20.5872 22z" />`,
  content: `<mask id="{id}-hands" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#fff" />
    <g fill="#000">
      <path class="short" d="M15 16.41 20.59 22 22 20.59 17 15.58 15 15.58z" />
      <path class="long" d="M15 7H17V16.41H15z" />
    </g>
  </mask>
  <path mask="url(#{id}-hands)" d="M16,2c-7.6001,0-14,6.3999-14,14s6.3999,14,14,14,14-6.3999,14-14S23.6001,2,16,2Z" />`,
});
