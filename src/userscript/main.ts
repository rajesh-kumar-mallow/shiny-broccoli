import { mount } from "svelte";
import App from "./App.svelte";
import { initDom } from "./lib/dom";
import { initThemeSwitcher } from "../userscripts/shared/theme-switcher.js";

initThemeSwitcher();
initDom();
const card = document.getElementById("custom-work-log-summary-card");
if (card) {
  mount(App, { target: card });
}
