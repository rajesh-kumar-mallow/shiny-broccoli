import { buildMonthOptions } from "../lib/utils";

export default function MonthPicker({
  currentOffset,
  onSelect,
}: {
  currentOffset: number;
  onSelect: (offset: number) => void;
}) {
  const months = buildMonthOptions(6);

  return (
    <div class="wls-month-picker">
      {months.map((m) => (
        <button
          key={m.offset}
          class={`wls-month-btn${m.offset === currentOffset ? " active" : ""}${
            m.offset < 0 && m.offset !== currentOffset ? " past" : ""
          }`}
          type="button"
          title={m.fullLabel}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(m.offset);
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
