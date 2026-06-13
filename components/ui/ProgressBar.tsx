interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className = "",
  trackClassName = "bg-stone-200/70",
  fillClassName = "bg-gradient-to-r from-emerald-400 to-teal-500",
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div className={className}>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-stone-500">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      ) : null}
      <div
        className={`h-2 overflow-hidden rounded-full ${trackClassName}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillClassName}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface XpProgressBarProps {
  currentXp: number;
  requiredXp: number;
  progressRatio: number;
  isMaxLevel: boolean;
  className?: string;
}

export function XpProgressBar({
  currentXp,
  requiredXp,
  progressRatio,
  isMaxLevel,
  className = "",
}: XpProgressBarProps) {
  const percent = Math.round(progressRatio * 100);

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-[11px] text-stone-500">
        <span>Heart of the valley</span>
        <span>
          {isMaxLevel
            ? "Fully grown"
            : `${currentXp.toLocaleString()} / ${requiredXp.toLocaleString()}`}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-stone-200/70"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
