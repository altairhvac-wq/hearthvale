import type { MiniGameViewModel } from "@/game/minigames/view-model";
import { MiniGameCategoryBadge } from "./MiniGameCategoryBadge";
import { MiniGameDifficultyBadge } from "./MiniGameDifficultyBadge";
import { MiniGameStatusBadge } from "./MiniGameStatusBadge";

interface MiniGameCardProps {
  miniGame: MiniGameViewModel;
  className?: string;
}

function getCategoryIcon(category: MiniGameViewModel["category"]): string {
  switch (category) {
    case "fishing":
      return "🎣";
    case "rescue":
      return "🐾";
    case "puzzle":
      return "🧩";
    case "crafting":
      return "🥐";
    case "exploration":
      return "🧭";
    case "seasonal":
      return "🎉";
  }
}

export function MiniGameCard({ miniGame, className = "" }: MiniGameCardProps) {
  const displayDifficulty =
    miniGame.selectedDifficulty ?? miniGame.defaultDifficulty;
  const difficultyData =
    miniGame.difficulties.find(
      (entry) => entry.difficulty === displayDifficulty,
    ) ?? miniGame.difficulties[0];
  const showRewards = difficultyData && difficultyData.rewards.length > 0;

  return (
    <article
      className={`rounded-2xl border border-stone-200/60 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition-all ${miniGame.status === "active" ? "ring-2 ring-fuchsia-200/50" : ""} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-100 to-violet-50 ring-1 ring-fuchsia-200/60">
          <span className="text-lg" aria-hidden>
            {miniGame.status === "completed" ? "✦" : getCategoryIcon(miniGame.category)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-stone-800 sm:text-base">
              {miniGame.name}
            </h3>
            <MiniGameCategoryBadge category={miniGame.category} />
            <MiniGameStatusBadge status={miniGame.status} />
          </div>

          {miniGame.regionName ? (
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">
              {miniGame.regionName}
            </p>
          ) : null}

          <p className="mt-1.5 text-xs leading-relaxed text-stone-600 sm:text-sm">
            {miniGame.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <MiniGameDifficultyBadge difficulty={displayDifficulty} />
        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-500">
          {miniGame.associatedSkillName}
        </span>
        {miniGame.completionCount > 0 ? (
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-medium text-teal-700">
            {miniGame.completionCount} completed
          </span>
        ) : null}
      </div>

      {miniGame.difficulties.some((entry) => entry.highScore > 0) ? (
        <div className="mt-3 rounded-xl border border-stone-200/60 bg-stone-50/50 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            High Scores
          </p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {miniGame.difficulties
              .filter((entry) => entry.highScore > 0)
              .map((entry) => (
                <li
                  key={`${miniGame.id}-${entry.difficulty}-score`}
                  className="text-xs text-stone-600"
                >
                  <MiniGameDifficultyBadge difficulty={entry.difficulty} />{" "}
                  {entry.highScore}
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {showRewards ? (
        <div className="mt-3 rounded-xl border border-dashed border-fuchsia-200/80 bg-fuchsia-50/40 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-fuchsia-600/80">
            {miniGame.status === "completed"
              ? "Rewards earned"
              : `Rewards (${displayDifficulty})`}
          </p>
          <ul className="mt-1 space-y-0.5">
            {difficultyData.rewards.map((reward, index) => (
              <li
                key={`${miniGame.id}-reward-${index}`}
                className="text-xs text-stone-600"
              >
                {reward.description}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {miniGame.status === "available" ? (
        <p className="mt-3 rounded-xl border border-dashed border-fuchsia-200/60 bg-fuchsia-50/30 px-3 py-2 text-xs text-fuchsia-700/80">
          {miniGame.canActivateInCurrentRegion
            ? "Gameplay coming soon — this mini-game is registered and ready for future play sessions."
            : `Travel to ${miniGame.regionName ?? "the required region"} to start this mini-game.`}
        </p>
      ) : null}

      {miniGame.status === "failed" && miniGame.completionCount === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-rose-200/60 bg-rose-50/30 px-3 py-2 text-xs text-rose-700/80">
          {miniGame.isAvailable
            ? "Last attempt did not succeed — try again when gameplay launches."
            : "Complete prerequisites before attempting this mini-game again."}
        </p>
      ) : null}
    </article>
  );
}
