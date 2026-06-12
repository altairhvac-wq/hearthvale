import type { ReputationViewModel } from "@/game/reputation/view-model";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ReputationPanelProps {
  reputation: ReputationViewModel;
}

export function ReputationPanel({ reputation }: ReputationPanelProps) {
  return (
    <section className="rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/70 to-rose-50/50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-violet-600">
            Reputation
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-stone-800">
            {reputation.title}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{reputation.description}</p>
        </div>
        <div className="rounded-xl bg-white/70 px-3 py-2 text-center shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-stone-400">Level</p>
          <p className="text-xl font-bold text-violet-700">{reputation.level}</p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={Math.round(reputation.progressRatio * 100)}
          max={100}
          label={
            reputation.nextTitle
              ? `Progress to ${reputation.nextTitle}`
              : "Maximum reputation"
          }
          fillClassName="bg-gradient-to-r from-violet-400 to-rose-400"
        />
        {reputation.nextTitle ? (
          <p className="mt-1 text-xs text-stone-500">
            {reputation.pointsToNext} reputation to next level
          </p>
        ) : null}
      </div>
    </section>
  );
}
