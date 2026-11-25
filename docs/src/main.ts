import "carbon-components-svelte/css/all.css";
import "carbon-components-svelte/css/prose.css";
import "carbon-components-svelte/css/syntax.css";
import "carbon-components-svelte/css/syntax-tokens.css";
import "./docs.css";
import { mount } from "svelte";
import App from "./components/index.svelte";

mount(App, { target: document.getElementById("app")! });
