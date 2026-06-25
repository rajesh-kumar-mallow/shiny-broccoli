<script lang="ts">
  import { buildMonthOptions } from "../lib/utils";

  let {
    currentOffset,
    onSelect,
  }: {
    currentOffset: number;
    onSelect: (offset: number) => void;
  } = $props();

  const months = buildMonthOptions(6);
</script>

<div class="wls-month-picker">
  {#each months as m (m.offset)}
    <button
      class="wls-month-btn"
      class:active={m.offset === currentOffset}
      class:past={m.offset < 0 && m.offset !== currentOffset}
      type="button"
      title={m.fullLabel}
      onclick={(e) => {
        e.stopPropagation();
        onSelect(m.offset);
      }}
    >
      {m.label}
    </button>
  {/each}
</div>
