import { waves } from "../families.js";

export default waves({
  name: "Wifi",
  sourceHash: "9934f18ccef4",
  content: `<circle class="signal" style="--i: 0" cx="16" cy="25" r="2" />
  <path class="signal" style="--i: 1" d="M10.47,19.2334l1.4136,1.4131a5.9688,5.9688,0,0,1,8.2229-.0093L21.52,19.2236a7.9629,7.9629,0,0,0-11.05.01Z" />
  <path class="signal" style="--i: 2" d="M6.229,14.9927l1.4136,1.4135a11.955,11.955,0,0,1,16.7041-.01L25.76,14.9829a13.9514,13.9514,0,0,0-19.5313.01Z" />
  <path class="signal" style="--i: 3" d="M30,10.7412a19.94,19.94,0,0,0-28,0v.0225L3.4043,12.168a17.9336,17.9336,0,0,1,25.1811-.01L30,10.7432Z" />`,
  part: "signal",
  origin: [16, 25],
  from: 0.9,
  emit: "moderate02",
});
