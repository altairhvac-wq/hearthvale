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
            Village warmth
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-stone-800">
            {prosperity.tierTitle}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{prosperity.tierDescription}</p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={Math.round(prosperity.progressRatio * 100)}
          max={100}
          label={
            prosperity.nextTierTitle
              ? `The village grows toward ${prosperity.nextTierTitle}`
              : "Hearthvale shines at its brightest"
          }
          fillClassName="bg-gradient-to-r from-emerald-400 to-teal-500"
        />
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-stone-400">
          How the village is growing
        </summary>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-white/60 px-2 py-1.5">
            <p className="text-[10px] text-stone-400">Restored places</p>
            <p className="text-sm font-semibold text-stone-700">
              +{prosperity.breakdown.fromRestorations}
            </p>
          </div>
          <div className="rounded-lg bg-white/60 px-2 py-1.5">
            <p className="text-[10px] text-stone-400">Your trade</p>
            <p className="text-sm font-semibold text-stone-700">
              +{prosperity.breakdown.fromMerchantLevels}
            </p>
          </div>
          <div className="rounded-lg bg-white/60 px-2 py-1.5">
            <p className="text-[10px] text-stone-400">Rescued friends</p>
            <p className="text-sm font-semibold text-stone-700">
              +{prosperity.breakdown.fromRescuedAnimals}
            </p>
          </div>
        </div>
      </details>

      {prosperity.unclaimedTierCount > 0 && onClaimTier ? (
        <button
          type="button"
          onClick={onClaimTier}
          className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Celebrate village progress ({prosperity.unclaimedTierCount})
        </button>
      ) : null}
    </section>
  );
}
