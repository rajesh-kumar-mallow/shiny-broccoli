import type { PopData } from "./types";
import { escapeHtml } from "./utils";

const setupPopover = () => {
  const existing = document.getElementById("wls-popover-el");
  if (existing) return existing;
  const el = document.createElement("div");
  el.id = "wls-popover-el";
  el.hidden = true;
  el.innerHTML = `<div class="pop-title"></div><div class="pop-rows"></div><div class="pop-note"></div><div class="pop-hint">Click to see full breakdown →</div>`;
  document.body.appendChild(el);
  return el;
};

export const showPopover = (anchorEl: HTMLElement, data: PopData, hasModalKey = false) => {
  const el = setupPopover();
  const titleEl = el.querySelector(".pop-title");
  const rowsEl = el.querySelector(".pop-rows");
  const noteEl = el.querySelector(".pop-note") as HTMLElement | null;
  const hintEl = el.querySelector(".pop-hint") as HTMLElement | null;
  if (titleEl) titleEl.textContent = data.title || "";
  if (rowsEl) {
    rowsEl.innerHTML = (data.rows || [])
      .map(
        (r) =>
          `<div class="pop-row"><span class="pop-lbl">${escapeHtml(r.label)}</span><span class="pop-val">${escapeHtml(r.value)}</span></div>`,
      )
      .join("");
  }
  if (noteEl) {
    if (data.note) {
      noteEl.textContent = data.note;
      noteEl.style.display = "";
    } else noteEl.style.display = "none";
  }
  if (hintEl) hintEl.style.display = hasModalKey ? "" : "none";
  el.hidden = false;
  const rect = anchorEl.getBoundingClientRect();
  const ew = el.offsetWidth || 220;
  const eh = el.offsetHeight || 90;
  let left = rect.left + rect.width / 2 - ew / 2;
  const top = rect.top + window.scrollY - eh - 10;
  left = Math.max(8, Math.min(left, window.innerWidth - ew - 8));
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
};

export const hidePopover = () => {
  const el = document.getElementById("wls-popover-el");
  if (el) el.hidden = true;
};

export const attachPopovers = (container: HTMLElement) => {
  container.querySelectorAll("[data-pop]").forEach((el) => {
    let t: ReturnType<typeof setTimeout>;
    el.addEventListener("mouseenter", () => {
      clearTimeout(t);
      try {
        t = setTimeout(() => {
          showPopover(
            el as HTMLElement,
            JSON.parse(el.getAttribute("data-pop") || "{}"),
            !!(el as HTMLElement).dataset.modalKey,
          );
        }, 130);
      } catch {
        /* ignore */
      }
    });
    el.addEventListener("mouseleave", () => {
      clearTimeout(t);
      hidePopover();
    });
  });
};

export const serializePop = (data: PopData) => JSON.stringify(data);

export const makePopAttr = (data: PopData) =>
  `data-pop='${JSON.stringify(data).replace(/'/g, "&#39;")}'`;
