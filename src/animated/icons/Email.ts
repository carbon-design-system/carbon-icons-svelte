import { flap } from "../families.js";

export default flap({
  name: "Email",
  sourceHash: "6adba580a426",
  rest: `<path d="M28,6H4A2,2,0,0,0,2,8V24a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V8A2,2,0,0,0,28,6ZM25.8,8,16,14.78,6.2,8ZM4,24V8.91l11.43,7.91a1,1,0,0,0,1.14,0L28,8.91V24Z" />`,
  content: `<path d="M28,6H4A2,2,0,0,0,2,8V24a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V8A2,2,0,0,0,28,6ZM4,8H28V24H4Z" />
  <path class="flap" d="M4,8H6.2L16,14.78,25.8,8H28V8.91L16.57,16.82H15.43L4,8.91Z" />`,
  hinge: [16, 8],
});
