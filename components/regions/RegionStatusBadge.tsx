import {
  getRegionDisplayStatusLabel,
  type RegionDisplayStatus,
} from "@/game/regions/display-status";
import { REGION_STATUS_STYLES } from "@/components/theme/region-styles";

interface RegionStatusBadgeProps {
  status: RegionDisplayStatus;
  className?: string;
}

export function RegionStatusBadge({ status, className = "" }: RegionStatusBadgeProps) {
  const styles = REGION_STATUS_STYLES[status];
  const label = getRegionDisplayStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
}
