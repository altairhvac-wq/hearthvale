import type { MerchantStageViewModel } from "@/game/merchant/view-model";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface MerchantStageCardProps {
  stage: MerchantStageViewModel;
  onActivate?: () => void;
  onUpgrade?: () => void;
  compact?: boolean;
}

function statusLabel(status: string): string {
  switch (status) {
    case "locked":
      return "Locked";
    case "available":
      return "Ready to open";
    case "active":
      return "Active";
    case "maxed":
      return "Fully upgraded";
    default:
      return status;
  }
}

function statusColor(status: string): string {
  switch (status) {
    case "locked":
      return "bg-stone-100 text-stone-500";
    case "available":
      return "bg-amber-50 text-amber-700";
    case "active":
      return "bg-emerald-50 text-emerald-700";
    case "maxed":
      return "bg-violet-50 text-violet-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

export function MerchantStageCard({
  stage,
  onActivate,
  onUpgrade,
  compact = false,
}: MerchantStageCardProps) {
  const levelPercent = stage.maxLevel > 0 ? (stage.level / stage.maxLevel) * 100 : 0;

  return (
    <article
      className={`rounded-2xl border border-stone-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm ${
        stage.isActive ? "ring-2 ring-emerald-200/80" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-2xl"
          aria-hidden="true"
        >
          {stage.iconEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-stone-800">{stage.title}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(stage.status)}`}
            >
              {statusLabel(stage.status)}
            </span>
          </div>
          {!compact ? (
            <p className="mt-1 text-sm leading-relaxed text-stone-500">
              {stage.description}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-stone-400">{stage.visualLabel}</p>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar
          value={stage.level}
          max={stage.maxLevel}
          label={`Level ${stage.level} / ${stage.maxLevel}`}
          fillClassName="bg-gradient-to-r from-amber-400 to-orange-400"
        />
        <div
          className="mt-1 h-1 overflow-hidden rounded-full bg-stone-100"
          role="presentation"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-400 transition-all duration-500"
            style={{ width: `${levelPercent}%` }}
          />
        </div>
      </div>

      {stage.unlockDescription && stage.status === "locked" ? (
        <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-500">
          {stage.unlockDescription}
        </p>
      ) : null}

      {stage.canUpgrade && stage.upgradeCosts.length > 0 ? (
        <div className="mt-3 rounded-xl bg-amber-50/60 px-3 py-2">
          <p className="text-[11px] font-medium text-amber-800">Next upgrade</p>
          <ul className="mt-1 space-y-0.5">
            {stage.upgradeCosts.map((cost) => (
              <li key={cost.label} className="text-xs text-amber-700">
                {cost.amount} {cost.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {stage.canActivate && onActivate ? (
        <button
          type="button"
          onClick={onActivate}
          className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Open {stage.title}
        </button>
      ) : null}

      {stage.canUpgrade && onUpgrade ? (
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Upgrade {stage.title}
        </button>
      ) : null}
    </article>
  );
}
