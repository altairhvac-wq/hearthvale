import type { MiniGameDifficulty } from "@/types";
import {
  getMiniGameDifficultyLabel,
  MINIGAME_DIFFICULTY_STYLES,
} from "@/game/minigames/presentation";

interface MiniGameDifficultyBadgeProps {
  difficulty: MiniGameDifficulty;
  className?: string;
}

export function MiniGameDifficultyBadge({
  difficulty,
  className = "",
}: MiniGameDifficultyBadgeProps) {
  const styles = MINIGAME_DIFFICULTY_STYLES[difficulty];
  const label = getMiniGameDifficultyLabel(difficulty);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles.badge} ${className}`}
    >
      {label}
    </span>
  );
}
