import type { QuestCategory } from "@/types";
import {
  getQuestCategoryLabel,
  QUEST_CATEGORY_STYLES,
} from "@/game/quests/presentation";

interface QuestCategoryBadgeProps {
  category: QuestCategory;
  className?: string;
}

export function QuestCategoryBadge({
  category,
  className = "",
}: QuestCategoryBadgeProps) {
  const styles = QUEST_CATEGORY_STYLES[category];
  const label = getQuestCategoryLabel(category);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles.badge} ${className}`}
    >
      {label}
    </span>
  );
}
