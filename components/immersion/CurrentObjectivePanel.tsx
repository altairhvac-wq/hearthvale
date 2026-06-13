import type { HomeObjectiveViewModel } from "@/game/onboarding/home-view-model";
import { HOME_SCREEN_LABELS } from "@/game/constants/world/labels";
import Link from "next/link";

interface CurrentObjectivePanelProps {
  objective: HomeObjectiveViewModel;
}

export function CurrentObjectivePanel({ objective }: CurrentObjectivePanelProps) {
  return (
    <section
      className={`rounded-3xl border p-5 shadow-sm ${
        objective.isHighlighted
          ? "border-amber-300/70 bg-gradient-to-br from-amber-50/95 via-orange-50/70 to-rose-50/50"
          : "border-stone-200/70 bg-white/80"
      }`}
      aria-labelledby="current-objective-title"
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700/90">
        {HOME_SCREEN_LABELS.currentObjectiveEyebrow}
      </p>
      <h2
        id="current-objective-title"
        className="mt-1 text-lg font-bold tracking-tight text-stone-900"
      >
        {objective.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        {objective.description}
      </p>

      {objective.steps.length > 0 ? (
        <ol
          className={`mt-4 space-y-2 ${
            objective.isHighlighted ? "" : "list-none pl-0"
          }`}
        >
          {objective.steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-2.5 text-sm text-stone-700"
            >
              {objective.isHighlighted ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-[11px] font-bold text-amber-900">
                  {index + 1}
                </span>
              ) : (
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-300" />
              )}
              <span className="pt-0.5 leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={objective.primaryAction.href}
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          {objective.primaryAction.label}
        </Link>
        {objective.secondaryAction ? (
          <Link
            href={objective.secondaryAction.href}
            className="rounded-full border border-amber-300/80 bg-white/80 px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-white"
          >
            {objective.secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
