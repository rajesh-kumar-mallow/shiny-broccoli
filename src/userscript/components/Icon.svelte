<script lang="ts">
  let { name, size = 14 }: { name: string; size?: number } = $props();

  const icons: Record<string, string> = {
    check:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5,8 6,11.5 13.5,4.5"/></svg>',
    warn: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13H1.5L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/></svg>',
    error:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.5" fill="currentColor"/></svg>',
    muted:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>',
    refresh:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 2.5A7 7 0 1 0 14 9"/><polyline points="14,2.5 13.5,6 10,5.5"/></svg>',
    list: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="8" y2="12"/></svg>',
    close:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>',
    clock:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10.5,10"/></svg>',
    report:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="2" width="10" height="12" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="6" y1="12" x2="8" y2="12"/></svg>',
    table:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="12" height="12" rx="1.5"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="7" y1="6" x2="7" y2="14"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>',
    cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="2" x2="5" y2="4"/><line x1="11" y1="2" x2="11" y2="4"/></svg>',
    entries:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V7L9 2z"/><polyline points="9,2 9,7 13.5,7"/></svg>',
    chevron:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>',
  };
</script>

<span
  class="wls-icon"
  style="display:inline-flex;width:{size}px;height:{size}px;flex-shrink:0;align-items:center;justify-content:center"
>
  {@html icons[name] || ""}
</span>
