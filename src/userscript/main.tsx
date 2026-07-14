import { render } from "preact";
import App from "./App";
import { initDom } from "./lib/dom";
import { initThemeSwitcher } from "../userscripts/shared/theme-switcher";

initThemeSwitcher();
initDom();
const card = document.getElementById("custom-work-log-summary-card");
if (card) {
  render(<App />, card);
}
