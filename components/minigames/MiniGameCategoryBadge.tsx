import type { MiniGameCategory } from "@/types";
import {
  getMiniGameCategoryLabel,
  MINIGAME_CATEGORY_STYLES,
} from "@/game/minigames/presentation";

interface MiniGameCategoryBadgeProps {
  category: MiniGameCategory;
  className?: string;
}

export function MiniGameCategoryBadge({
  category,
  className = "",
}: MiniGameCategoryBadgeProps) {
  const styles = MINIGAME_CATEGORY_STYLES[category];
  const label = getMiniGameCategoryLabel(category);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles.badge} ${className}`}
    >
      {label}
    </span>
  );
}
