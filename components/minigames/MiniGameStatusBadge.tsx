import type { MiniGameStatus } from "@/types";
import {
  getMiniGameStatusLabel,
  MINIGAME_STATUS_STYLES,
} from "@/game/minigames/presentation";

interface MiniGameStatusBadgeProps {
  status: MiniGameStatus;
  className?: string;
}

export function MiniGameStatusBadge({
  status,
  className = "",
}: MiniGameStatusBadgeProps) {
  const styles = MINIGAME_STATUS_STYLES[status];
  const label = getMiniGameStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
}
