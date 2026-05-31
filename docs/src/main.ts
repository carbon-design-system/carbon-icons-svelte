import "carbon-components-svelte/css/all.css";
import { mount } from "svelte";
import App from "./components/index.svelte";

mount(App, { target: document.getElementById("app")! });
