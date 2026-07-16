import type { WorkModeInfo } from "./types";
import { formatDuration } from "./shared";

export function Chip({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: string;
}) {
  return (
    <div class={`cht-chip cht-chip--${variant}`}>
      <div class="cht-chip-label">{label}</div>
      <div class="cht-chip-value">{value}</div>
    </div>
  );
}

export function WorkModeBadge({ workMode }: { workMode: WorkModeInfo }) {
  if (!workMode || workMode.type === "none") {
    return null;
  }

  const modeText =
    workMode.type === "wfo"
      ? `WFO · ${formatDuration(workMode.officeMinutes)}`
      : workMode.type === "wfh"
        ? `WFH · ${formatDuration(workMode.homeMinutes)}`
        : `Hybrid · WFO ${formatDuration(
            workMode.officeMinutes,
          )} · WFH ${formatDuration(workMode.homeMinutes)}`;

  return (
    <div class="cht-work-mode-wrap">
      <div class={`cht-work-mode cht-work-mode--${workMode.type}`}>
        <span class="cht-work-mode-dot"></span>
        <span>{modeText}</span>
      </div>
    </div>
  );
}

const getStatusClass = (status?: string) => {
  const valid = ["pending", "short", "ready", "completed", "full-time-off"];
  return status && valid.includes(status) ? status : "pending";
};

export function WorkTooltip({
  title,
  subtitle,
  worked,
  timeOff,
  required,
  remaining,
  heroTitle,
  heroValue,
  badgeText,
  status,
  primaryChipLabel,
  workMode,
}: {
  title: string;
  subtitle?: string;
  worked: string;
  timeOff: string;
  required: string;
  remaining: string;
  heroTitle?: string;
  heroValue?: string;
  badgeText?: string;
  status?: string;
  primaryChipLabel?: string;
  workMode: WorkModeInfo;
}) {
  const statusClass = getStatusClass(status);

  return (
    <div class={`cht-tooltip-body cht-status--${statusClass}`}>
      <div class="cht-tooltip-header">
        <div class="cht-tooltip-header-text">
          <div class="cht-tooltip-title">{title}</div>
          <div class="cht-tooltip-subtitle">{subtitle}</div>
        </div>
        <div class="cht-tooltip-badge">{badgeText}</div>
      </div>

      <div class="cht-tooltip-hero">
        <div class="cht-tooltip-hero-label">{heroTitle}</div>
        <div class="cht-tooltip-hero-value">{heroValue}</div>
      </div>

      <div class="cht-tooltip-chips">
        <Chip label={primaryChipLabel || ""} value={remaining} variant="accent" />
        <Chip label="Worked" value={worked} />
        <Chip label="Time off" value={timeOff} />
        <Chip label="Required" value={required} />
      </div>

      <WorkModeBadge workMode={workMode} />
    </div>
  );
}

export function DayOffTooltip({
  title,
  subtitle,
  message,
}: {
  title: string;
  subtitle?: string;
  message?: string;
}) {
  return (
    <div class="cht-tooltip-body cht-dayoff">
      <div class="cht-dayoff-header">
        <div class="cht-dayoff-icon">🎉</div>
        <div class="cht-tooltip-header-text">
          <div class="cht-tooltip-title">{title}</div>
          <div class="cht-dayoff-subtitle">{subtitle}</div>
        </div>
      </div>
      <div class="cht-dayoff-card">
        <div class="cht-dayoff-title">Day Off</div>
        <div class="cht-dayoff-message">{message}</div>
      </div>
    </div>
  );
}
