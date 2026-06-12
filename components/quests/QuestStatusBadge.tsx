import type { QuestStatus } from "@/types";
import {
  getQuestStatusLabel,
  QUEST_STATUS_STYLES,
} from "@/game/quests/presentation";

interface QuestStatusBadgeProps {
  status: QuestStatus;
  className?: string;
}

export function QuestStatusBadge({
  status,
  className = "",
}: QuestStatusBadgeProps) {
  const styles = QUEST_STATUS_STYLES[status];
  const label = getQuestStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
}
