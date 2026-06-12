import type { ProsperityViewModel } from "@/game/prosperity/view-model";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ProsperityPanelProps {
  prosperity: ProsperityViewModel;
  onClaimTier?: () => void;
}

export function ProsperityPanel({ prosperity, onClaimTier }: ProsperityPanelProps) {
  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
            Village Prosperity
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-stone-800">
            {prosperity.tierTitle}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{prosperity.tierDescription}</p>
        </div>
        <div className="rounded-xl bg-white/70 px-3 py-2 text-center shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-stone-400">Score</p>
          <p className="text-xl font-bold text-emerald-700">{prosperity.score}</p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={Math.round(prosperity.progressRatio * 100)}
          max={100}
          label={
            prosperity.nextTierTitle
              ? `Progress to ${prosperity.nextTierTitle}`
              : "Maximum tier reached"
          }
          fillClassName="bg-gradient-to-r from-emerald-400 to-teal-500"
        />
        {prosperity.nextTierTitle ? (
          <p className="mt-1 text-xs text-stone-500">
            {prosperity.pointsToNextTier} points to next tier
          </p>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/60 px-2 py-1.5">
          <p className="text-[10px] text-stone-400">Restorations</p>
          <p className="text-sm font-semibold text-stone-700">
            +{prosperity.breakdown.fromRestorations}
          </p>
        </div>
        <div className="rounded-lg bg-white/60 px-2 py-1.5">
          <p className="text-[10px] text-stone-400">Merchant</p>
          <p className="text-sm font-semibold text-stone-700">
            +{prosperity.breakdown.fromMerchantLevels}
          </p>
        </div>
        <div className="rounded-lg bg-white/60 px-2 py-1.5">
          <p className="text-[10px] text-stone-400">Animals</p>
          <p className="text-sm font-semibold text-stone-700">
            +{prosperity.breakdown.fromRescuedAnimals}
          </p>
        </div>
      </div>

      {prosperity.unclaimedTierCount > 0 && onClaimTier ? (
        <button
          type="button"
          onClick={onClaimTier}
          className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Claim tier reward ({prosperity.unclaimedTierCount})
        </button>
      ) : null}
    </section>
  );
}
