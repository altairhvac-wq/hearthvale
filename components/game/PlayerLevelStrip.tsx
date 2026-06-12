import type { PlayerLevelInfo } from "@/game/player/level";
import { XpProgressBar } from "@/components/ui/ProgressBar";

interface PlayerLevelStripProps {
  levelInfo: PlayerLevelInfo;
  displayName: string;
  className?: string;
}

export function PlayerLevelStrip({
  levelInfo,
  displayName,
  className = "",
}: PlayerLevelStripProps) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-stone-500">Welcome back</p>
          <p className="truncate text-sm font-semibold text-stone-800">
            {displayName}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Level
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-base font-bold text-amber-900 ring-1 ring-amber-200/80">
            {levelInfo.level}
          </span>
        </div>
      </div>
      <XpProgressBar
        currentXp={levelInfo.currentXp}
        requiredXp={levelInfo.xpRequiredForNextLevel}
        progressRatio={levelInfo.progressRatio}
        isMaxLevel={levelInfo.isMaxLevel}
      />
    </div>
  );
}
