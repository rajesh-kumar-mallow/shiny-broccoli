import { render } from "preact";
import { waitForElement } from "./lib/utils";
import { initTheme } from "./shared/theme-switcher";
import { openProfileSettingsModal } from "./shared/theme-settings-modal";

initTheme();

const SIDEBAR_SELECTOR = ".profile_sidebar";
const ITEM_CLASS = "hps-sidebar-item";

function SidebarItem() {
  return (
    <button type="button" class="hps-sidebar-btn" onClick={() => openProfileSettingsModal()}>
      <span class="hps-sidebar-link">
        <span>User Config</span>
      </span>
    </button>
  );
}

function injectSidebarItem(sidebar: HTMLUListElement) {
  if (sidebar.querySelector(`.${ITEM_CLASS}`)) return;

  const li = document.createElement("li");
  li.className = ITEM_CLASS;
  sidebar.appendChild(li);

  render(<SidebarItem />, li);
}

function boot() {
  waitForElement<HTMLUListElement>(SIDEBAR_SELECTOR, injectSidebarItem);
}

function init() {
  if (window.__hubbleProfileSettingsInit) return;
  window.__hubbleProfileSettingsInit = true;

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
}

init();
