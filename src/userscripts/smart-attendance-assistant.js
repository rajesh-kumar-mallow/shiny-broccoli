import { initThemeSwitcher } from "./shared/theme-switcher.js";

initThemeSwitcher();

(function () {
  "use strict";

  window.addEventListener("load", () => {
    setTimeout(initWidget, 2000);
  });

  function initWidget() {
    if (document.getElementById("attendance-toggle-btn")) return;

    const REQUIRED_WORK_HOURS = 8;

    const root = document.createElement("div");
    root.id = "advanced-attendance-widget";
    document.body.appendChild(root);

    /* ─────────────────────────────────────────── BUTTON */

    const btn = document.createElement("button");
    btn.id = "attendance-toggle-btn";
    btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span id="attendance-btn-time">--:-- --</span>
        `;
    root.appendChild(btn);

    /* ─────────────────────────────────────────── PANEL */

    const panel = document.createElement("div");
    panel.id = "attendance-panel";
    root.appendChild(panel);
    /* ─────────────────────────────────────────── POSITION */

    function positionPanelNearButton() {
      const rect = btn.getBoundingClientRect();
      const gap = 14;
      const panelWidth = 340;
      let left = rect.left;
      let top = rect.bottom + gap;

      if (left + panelWidth > window.innerWidth - 12) left = window.innerWidth - panelWidth - 12;
      if (left < 12) left = 12;

      const estimatedHeight = 440;
      if (top + estimatedHeight > window.innerHeight) top = rect.top - estimatedHeight - gap;
      if (top < 12) top = 12;

      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = "unset";
    }

    /* ─────────────────────────────────────────── DRAGGABLE */

    let wasDragging = false;

    (function makeButtonDraggable() {
      let isDragging = false;
      let offsetX = 0,
        offsetY = 0;

      const saved = localStorage.getItem("attendance-widget-btn-position");
      if (saved) {
        try {
          const pos = JSON.parse(saved);
          btn.style.left = pos.left;
          btn.style.top = pos.top;
          btn.style.right = "unset";
        } catch (e) {}
      }

      btn.addEventListener("mousedown", (e) => {
        isDragging = false;
        const rect = btn.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        const startX = e.clientX,
          startY = e.clientY;

        const onMouseMove = (mv) => {
          if (Math.abs(mv.clientX - startX) > 3 || Math.abs(mv.clientY - startY) > 3) {
            isDragging = true;
            wasDragging = true;
          }
          if (!isDragging) return;
          btn.style.left = `${mv.clientX - offsetX}px`;
          btn.style.top = `${mv.clientY - offsetY}px`;
          btn.style.right = "unset";
          btn.style.cursor = "grabbing";
          if (panel.style.display === "block") positionPanelNearButton();
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          btn.style.cursor = "grab";
          if (isDragging) {
            localStorage.setItem(
              "attendance-widget-btn-position",
              JSON.stringify({
                left: btn.style.left,
                top: btn.style.top,
              }),
            );
            setTimeout(() => {
              wasDragging = false;
            }, 120);
          }
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    })();

    /* ─────────────────────────────────────────── CLOCK */

    let clockInterval = null;

    function startClock() {
      updateClock();
      clockInterval = setInterval(updateClock, 1000);
    }

    function stopClock() {
      clearInterval(clockInterval);
      clockInterval = null;
    }

    function updateClock() {
      const el = document.getElementById("aw-live-clock");
      if (!el) return;
      el.textContent = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }

    /* ─────────────────────────────────────────── DATA */

    async function getTodayAttendanceData() {
      try {
        const today = moment().format("YYYY-MM-DD");
        const response = await $.ajax({
          url: "/attendance/get-my-check-in-data",
          type: "GET",
          data: { start_date: today, end_date: today },
        });
        return response?.data || null;
      } catch (error) {
        console.error("Attendance fetch failed", error);
        return null;
      }
    }

    /* ─────────────────────────────────────────── RENDER */

    async function renderWidget() {
      const data = await getTodayAttendanceData();
      if (!data) return;

      const todayKey = Object.keys(data)[0];
      const rows = data[todayKey] || [];

      const checkInRow = rows.find((r) => r.type === "Check In" || r.type === "login");
      if (!checkInRow) return;

      const checkIn = checkInRow.start_time;

      /* Break minutes */
      let breakMinutes = 0;
      rows.forEach((r) => {
        if (
          ["Short Break", "Long Break", "break", "lunch"].includes(r.type) &&
          r.start_time &&
          r.end_time
        ) {
          breakMinutes += moment(r.end_time, "HH:mm").diff(
            moment(r.start_time, "HH:mm"),
            "minutes",
          );
        }
      });

      /* Time-off minutes */
      let timeOffMinutes = 0;
      rows.forEach((r) => {
        if (["Time Off", "Attendance Time Off"].includes(r.type) && r.start_time && r.end_time) {
          timeOffMinutes += moment(r.end_time, "HH:mm").diff(
            moment(r.start_time, "HH:mm"),
            "minutes",
          );
        }
      });

      /* Calculations */
      const startMoment = moment(checkIn, "HH:mm");
      const now = moment();
      const requiredMinutes = REQUIRED_WORK_HOURS * 60 - timeOffMinutes;
      const effectiveWorked = now.diff(startMoment, "minutes") - breakMinutes + timeOffMinutes;
      const remainingMinutes = Math.max(requiredMinutes - effectiveWorked, 0);
      const checkoutMoment = now.clone().add(remainingMinutes, "minutes");

      const workedH = Math.floor(Math.max(effectiveWorked, 0) / 60);
      const workedM = Math.max(effectiveWorked, 0) % 60;
      const remH = Math.floor(remainingMinutes / 60);
      const remM = remainingMinutes % 60;
      const progress = Math.min((effectiveWorked / requiredMinutes) * 100, 100);

      const checkoutFormatted = checkoutMoment.format("hh:mm");
      const checkoutAmPm = checkoutMoment.format("A");
      const checkInFormatted = startMoment.format("hh:mm A");

      /* Remaining label */
      const remLabel =
        remainingMinutes > 0 ? `in ${remH > 0 ? remH + "h " : ""}${remM}m` : "✓ done";

      /* Update button */
      const btnTime = document.getElementById("attendance-btn-time");
      if (btnTime) btnTime.textContent = checkoutFormatted + " " + checkoutAmPm;

      /* Timeline widths */
      const totalMinutes = REQUIRED_WORK_HOURS * 60;
      const workedPct = Math.min((effectiveWorked / totalMinutes) * 100, 100).toFixed(1);
      const breakPct = Math.min((breakMinutes / totalMinutes) * 100, 100).toFixed(1);
      const remPct = Math.max(100 - parseFloat(workedPct) - parseFloat(breakPct), 0).toFixed(1);

      /* Remaining stat */
      const remStatHtml =
        remainingMinutes > 0
          ? `<div class="aw-stat-value">${remH > 0 ? remH + "h" : ""}${remM}m</div>
                   <div class="aw-stat-sub">remaining</div>`
          : `<div class="aw-done-state">
                       <div class="aw-done-icon">✓</div>
                       <div class="aw-done-text">Done!</div>
                   </div>`;

      /* Render */
      panel.innerHTML = `
                <div class="aw-header">
                    <div class="aw-header-aurora"></div>
                    <div class="aw-header-grid"></div>
                    <div class="aw-label">Recommended Checkout</div>
                    <div class="aw-checkout-row">
                        <div class="aw-checkout-time">${checkoutFormatted}</div>
                        <div class="aw-checkout-ampm">${checkoutAmPm}</div>
                        <div class="aw-checkin-badge">${remLabel}</div>
                    </div>
                    <div class="aw-progress-wrap">
                        <div class="aw-progress-labels">
                            <span>${checkInFormatted}</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="aw-progress-track">
                            <div class="aw-progress-fill" style="width:${progress}%">
                                <div class="aw-progress-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="aw-body">
                    <div class="aw-stats-row">
                        <div class="aw-stat">
                            <div class="aw-stat-glow"></div>
                            <div class="aw-stat-label">Worked</div>
                            <div class="aw-stat-value">${workedH}h ${workedM}m</div>
                            <div class="aw-stat-sub">elapsed</div>
                        </div>
                        <div class="aw-stat">
                            <div class="aw-stat-glow"></div>
                            <div class="aw-stat-label">Left</div>
                            ${remStatHtml}
                        </div>
                        <div class="aw-stat">
                            <div class="aw-stat-glow"></div>
                            <div class="aw-stat-label">Break</div>
                            <div class="aw-stat-value">${breakMinutes}m</div>
                            <div class="aw-stat-sub">deducted</div>
                        </div>
                    </div>

                    <div class="aw-timeline">
                        <div class="aw-tl-axis">DAY</div>
                        <div class="aw-tl-inner">
                            <div class="aw-tl-segs">
                                <div class="aw-tl-seg aw-tl-work"  style="flex:${workedPct}"></div>
                                ${
                                  parseFloat(breakPct) > 0
                                    ? `<div class="aw-tl-seg aw-tl-break" style="flex:${breakPct}"></div>`
                                    : ""
                                }
                                ${
                                  parseFloat(remPct) > 0
                                    ? `<div class="aw-tl-seg aw-tl-rem"  style="flex:${remPct}"></div>`
                                    : ""
                                }
                            </div>
                            <div class="aw-tl-labels">
                                <span>${checkInFormatted}</span>
                                ${breakMinutes > 0 ? `<span>${breakMinutes}m break</span>` : "<span></span>"}
                                <span>${checkoutFormatted} ${checkoutAmPm}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="aw-footer">
                    <div class="aw-live">
                        <div class="aw-live-dot"></div>
                        <span id="aw-live-clock">--:--:--</span>
                    </div>
                    <div class="aw-footer-right">
                        <div class="aw-req-chip">${REQUIRED_WORK_HOURS} hrs / day</div>
                    </div>
                </div>
            `;
      startClock();
    }

    /* ─────────────────────────────────────────── INIT */

    renderWidget();

    setInterval(() => {
      renderWidget();
    }, 60000);

    /* ─────────────────────────────────────────── TOGGLE */

    btn.addEventListener("click", async () => {
      if (wasDragging) return;
      const isOpen = panel.style.display === "block";
      if (isOpen) {
        panel.style.display = "none";
        stopClock();
      } else {
        positionPanelNearButton();
        panel.style.display = "block";
        await renderWidget();
      }
    });

    /* ─────────────────────────────────────────── CLOSE OUTSIDE */

    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !panel.contains(e.target)) {
        panel.style.display = "none";
        stopClock();
      }
    });

    console.log("✅ Attendance Assistant v9.2 Ready");
  }
})();
