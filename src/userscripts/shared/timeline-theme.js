const TIMELINE_CONTAINER_IDS = [
  "my-checkin-detail",
  "checkin-detail",
  "all-checkin-detail",
  "all-check-in-detail",
];

const BAR_CLASSES = ["htl-row-bg", "htl-wfo", "htl-wfh", "htl-timeoff", "htl-dayoff", "htl-other"];

function getRgb(color) {
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!rgbMatch) return null;
  return {
    r: Number(rgbMatch[1]),
    g: Number(rgbMatch[2]),
    b: Number(rgbMatch[3]),
  };
}

function getFill(rect) {
  const fill = (rect.getAttribute("fill") || "").trim().toLowerCase();
  if (fill && fill !== "none") return fill;
  return (getComputedStyle(rect).fill || "").trim().toLowerCase();
}

function isRowBackground(color) {
  if (!color || color === "none") return false;
  if (["#fff", "#ffffff", "white", "#f5f5f5", "#fafafa", "#f8f9fa", "#f1f5f9"].includes(color)) {
    return true;
  }
  const rgb = getRgb(color);
  if (!rgb) return false;
  return rgb.r >= 235 && rgb.g >= 235 && rgb.b >= 235;
}

function isTimeOffColor(color) {
  if (!color) return false;
  if (["#ff4f00", "#ff5000", "#f4511e", "#e24301", "#ff5722"].includes(color)) return true;
  const rgb = getRgb(color);
  if (!rgb) return false;
  return rgb.r >= 180 && rgb.g <= 120 && rgb.b <= 90;
}

function isDayOffColor(color) {
  if (!color) return false;
  if (["#cd0404", "#b91c1c", "#dc2626"].includes(color)) return true;
  const rgb = getRgb(color);
  if (!rgb) return false;
  return rgb.r >= 150 && rgb.g <= 60 && rgb.b <= 60;
}

function isWfoColor(color) {
  if (!color) return false;
  if (["#22914b", "#22c55e", "#16a34a", "#15803d", "#008000", "green"].includes(color)) {
    return true;
  }
  const rgb = getRgb(color);
  if (!rgb) return false;
  return rgb.g >= 110 && rgb.r <= 90 && rgb.b <= 120;
}

function isWfhColor(color) {
  if (!color) return false;
  if (["#0066cc", "#1976d2", "#2563eb", "#1d4ed8", "#0ea5e9", "blue"].includes(color)) {
    return true;
  }
  const rgb = getRgb(color);
  if (!rgb) return false;
  return rgb.b >= 140 && rgb.r <= 100 && rgb.g <= 170;
}

function classifyRect(rect) {
  const fill = getFill(rect);
  const width = Number(rect.getAttribute("width") || 0);
  const height = Number(rect.getAttribute("height") || 0);

  if (width < 1 || height < 1) return null;

  if (isRowBackground(fill)) return "htl-row-bg";

  const area = width * height;
  if (area < 8) return null;

  if (isWfoColor(fill)) return "htl-wfo";
  if (isWfhColor(fill)) return "htl-wfh";
  if (isTimeOffColor(fill)) return "htl-timeoff";
  if (isDayOffColor(fill)) return "htl-dayoff";

  if (fill && fill !== "none") return "htl-other";

  return null;
}

function themeTimelineContainer(container) {
  if (!container) return;

  container.querySelectorAll("svg rect").forEach((rect) => {
    rect.classList.remove(...BAR_CLASSES);
    const cls = classifyRect(rect);
    if (cls) rect.classList.add(cls);
  });

  container.querySelectorAll("svg text").forEach((text) => {
    text.classList.add("htl-label");
  });

  container.querySelectorAll("svg line, svg path").forEach((el) => {
    const fill = (el.getAttribute("fill") || "").toLowerCase();
    if (!fill || fill === "none") {
      el.classList.add("htl-grid");
    }
  });
}

function themeAllTimelines() {
  for (const id of TIMELINE_CONTAINER_IDS) {
    themeTimelineContainer(document.getElementById(id));
  }
}

function debounce(fn, ms = 120) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const scheduleTheme = debounce(themeAllTimelines);

export function initTimelineTheme() {
  if (window.__hubbleTimelineThemeInit) return;
  window.__hubbleTimelineThemeInit = true;

  const boot = () => {
    themeAllTimelines();

    const observer = new MutationObserver(() => {
      scheduleTheme();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["fill", "width", "height"],
    });

    window.addEventListener("load", scheduleTheme);
  };

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
}
