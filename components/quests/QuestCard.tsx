import type { ReactNode } from "react";
import type { QuestViewModel } from "@/game/quests/view-model";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestCategoryBadge } from "./QuestCategoryBadge";
import { QuestStatusBadge } from "./QuestStatusBadge";

interface QuestCardProps {
  quest: QuestViewModel;
  onStart?: (questId: QuestViewModel["id"]) => void;
  compact?: boolean;
  className?: string;
  footer?: ReactNode;
}

export function QuestCard({
  quest,
  onStart,
  compact = false,
  className = "",
  footer,
}: QuestCardProps) {
  const showObjectives =
    quest.status === "active" || quest.status === "completed";
  const showRewards =
    quest.status !== "completed" || quest.rewards.length > 0;

  const content = (
    <>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 ring-1 ring-amber-200/60">
          <span className="text-lg" aria-hidden>
            {quest.status === "completed" ? "✦" : "📖"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-stone-800 sm:text-base">
              {quest.title}
            </h3>
            <QuestCategoryBadge category={quest.category} />
            <QuestStatusBadge status={quest.status} />
          </div>

          {quest.regionName ? (
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">
              {quest.regionName}
            </p>
          ) : null}

          {!compact ? (
            <p className="mt-1.5 text-xs leading-relaxed text-stone-600 sm:text-sm">
              {quest.description}
            </p>
          ) : null}
        </div>
      </div>

      {quest.status === "active" ? (
        <ProgressBar
          className="mt-3"
          value={quest.progressPercent}
          label="Story progress"
          fillClassName="bg-gradient-to-r from-amber-400 to-orange-400"
        />
      ) : null}

      {showObjectives && quest.objectives.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {quest.objectives.map((objective) => (
            <li
              key={objective.id}
              className="rounded-xl border border-stone-200/60 bg-stone-50/50 px-3 py-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-xs leading-relaxed ${objective.completed ? "text-stone-400 line-through" : "text-stone-600"}`}
                >
                  {objective.description}
                </p>
                <span className="shrink-0 text-[10px] font-medium text-stone-400">
                  {objective.current}/{objective.target}
                </span>
              </div>
              {quest.status === "active" && !objective.completed ? (
                <ProgressBar
                  className="mt-2"
                  value={objective.progressPercent}
                  trackClassName="bg-stone-200/50"
                  fillClassName="bg-gradient-to-r from-emerald-400 to-teal-500"
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {showRewards && quest.rewards.length > 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-amber-200/80 bg-amber-50/40 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-amber-600/80">
            {quest.status === "completed" ? "Rewards earned" : "Rewards"}
          </p>
          <ul className="mt-1 space-y-0.5">
            {quest.rewards.map((reward, index) => (
              <li
                key={`${quest.id}-reward-${index}`}
                className="text-xs text-stone-600"
              >
                {reward.description}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!quest.prerequisitesMet && quest.prerequisiteTitles.length > 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-stone-200/80 bg-stone-50/60 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Requires
          </p>
          <ul className="mt-1 space-y-0.5">
            {quest.prerequisiteTitles.map((title) => (
              <li key={title} className="text-xs text-stone-600">
                {title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {quest.canStart && onStart ? (
        <button
          type="button"
          onClick={() => onStart(quest.id)}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-teal-600"
        >
          Begin this story
        </button>
      ) : null}

      {footer ? <div className="mt-3">{footer}</div> : null}
    </>
  );

  const cardClasses = `rounded-2xl border border-stone-200/60 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition-all ${quest.status === "active" ? "ring-2 ring-amber-200/50" : ""} ${className}`;

  return <article className={cardClasses}>{content}</article>;
}
