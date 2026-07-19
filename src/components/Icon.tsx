import { ICONS } from "../lib/icons";

export default function Icon({ name, size = 14 }: { name: string; size?: number }) {
  return (
    <span
      class="wls-icon"
      style={`display:inline-flex;width:${size}px;height:${size}px;flex-shrink:0;align-items:center;justify-content:center`}
      dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }}
    />
  );
}
