import type { FutureGoalPreview } from "@/game/constants/immersion";
import { HOME_SCREEN_LABELS } from "@/game/constants/world/labels";
import { LockIcon } from "@/components/icons/GameIcons";

interface FutureUnlocksPanelProps {
  nextUnlock: FutureGoalPreview;
  futureGoals: readonly FutureGoalPreview[];
  compact?: boolean;
}

export function FutureUnlocksPanel({
  nextUnlock,
  futureGoals,
  compact = false,
}: FutureUnlocksPanelProps) {
  const otherGoals = futureGoals.filter((goal) => goal.id !== nextUnlock.id);

  return (
    <section className="space-y-3">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-violet-600/90">
          {compact
            ? HOME_SCREEN_LABELS.futureUnlocksCompactEyebrow
            : HOME_SCREEN_LABELS.futureUnlocksEyebrow}
        </p>
        <h2 className="mt-0.5 text-sm font-semibold text-stone-800">
          {compact
            ? HOME_SCREEN_LABELS.futureUnlocksCompactTitle
            : HOME_SCREEN_LABELS.futureUnlocksTitle}
        </h2>
      </div>

      <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-amber-50/40 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>
            {nextUnlock.iconEmoji}
          </span>
          <div>
            <p className="text-sm font-semibold text-violet-950">
              {nextUnlock.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              {nextUnlock.teaser}
            </p>
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="grid grid-cols-2 gap-2">
          {otherGoals.map((goal) => (
          <div
            key={goal.id}
            className={`relative overflow-hidden rounded-2xl border border-stone-200/50 p-3 ${
              goal.isMystery
                ? "bg-gradient-to-br from-stone-100/80 to-stone-200/40"
                : "bg-stone-50/60"
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`text-xl ${goal.isMystery ? "opacity-30 grayscale" : "opacity-50"}`}
                aria-hidden
              >
                {goal.isMystery ? "🌫️" : goal.iconEmoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <LockIcon className="h-3 w-3 shrink-0 text-stone-400" />
                  <p className="truncate text-xs font-semibold text-stone-500">
                    {goal.title}
                  </p>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-stone-400">
                  {goal.teaser}
                </p>
              </div>
            </div>
            {goal.isMystery ? (
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-200/30 to-transparent"
                aria-hidden
              />
            ) : null}
          </div>
        ))}
        </div>
      ) : null}
    </section>
  );
}
