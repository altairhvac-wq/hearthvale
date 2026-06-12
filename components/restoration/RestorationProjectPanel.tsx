import type { RestorationProjectViewModel } from "@/game/restoration/view-model";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RestorationStatusBadge } from "./RestorationStatusBadge";

interface RestorationProjectPanelProps {
  project: RestorationProjectViewModel;
  onStart?: (projectId: RestorationProjectViewModel["id"]) => void;
  onRestore?: (projectId: RestorationProjectViewModel["id"]) => void;
  compact?: boolean;
  className?: string;
}

export function RestorationProjectPanel({
  project,
  onStart,
  onRestore,
  compact = false,
  className = "",
}: RestorationProjectPanelProps) {
  const isRestored = project.status === "completed";
  const showStageDetails =
    project.status === "in_progress" || project.status === "available";

  return (
    <div
      className={`rounded-2xl border border-violet-100/80 bg-gradient-to-br from-violet-50/90 via-white to-amber-50/50 p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${
            isRestored
              ? "bg-gradient-to-br from-emerald-100 to-teal-50 ring-emerald-200/70"
              : "bg-gradient-to-br from-violet-100 to-fuchsia-50 ring-violet-200/60"
          }`}
          aria-hidden
        >
          <span className="text-lg">{isRestored ? "✦" : "🌿"}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-violet-950">
              {project.title}
            </h4>
            <RestorationStatusBadge status={project.status} />
          </div>

          {!compact ? (
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              {project.description}
            </p>
          ) : null}
        </div>
      </div>

      {project.status !== "locked" && !isRestored ? (
        <ProgressBar
          className="mt-3"
          value={project.progressPercent}
          label={`Restoration · ${project.completedStages}/${project.totalStages} stages`}
          fillClassName="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400"
        />
      ) : null}

      {isRestored ? (
        <div
          className="mt-3 overflow-hidden rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-sky-50/60 px-3 py-2.5"
          role="status"
        >
          <ProgressBar
            value={100}
            label="Fully restored"
            fillClassName="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"
          />
          <p className="mt-2 text-center text-xs text-emerald-700/90">
            This place shines with valley warmth again.
          </p>
        </div>
      ) : null}

      {project.status === "locked" && project.unlockRequirementDescription ? (
        <div className="mt-3 rounded-xl border border-dashed border-violet-200/70 bg-white/60 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-violet-400">
            How to unlock
          </p>
          <p className="mt-0.5 text-xs text-stone-600">
            {project.unlockRequirementDescription}
          </p>
        </div>
      ) : null}

      {showStageDetails && project.currentStageLabel ? (
        <div className="mt-3 rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-violet-100/80">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-500">
            {project.status === "available" ? "First stage" : "Current stage"}
          </p>
          <p className="mt-0.5 text-sm font-medium text-stone-800">
            {project.currentStageLabel}
          </p>
          {!compact && project.currentStageDescription ? (
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              {project.currentStageDescription}
            </p>
          ) : null}
        </div>
      ) : null}

      {project.showRequirements && project.requirements.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {project.requirements.map((requirement) => (
            <li
              key={requirement.resourceId}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/60 px-2.5 py-1.5 text-xs"
            >
              <span className="font-medium text-stone-700">
                {requirement.name}
              </span>
              <span
                className={
                  requirement.isMet
                    ? "font-semibold text-emerald-600"
                    : "font-semibold text-amber-700"
                }
              >
                {requirement.owned}/{requirement.required}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {project.showRestoreAction ? (
        <div className="mt-3">
          {project.status === "available" && onStart ? (
            <button
              type="button"
              onClick={() => onStart(project.id)}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-violet-600 hover:to-fuchsia-600 active:scale-[0.98]"
            >
              Begin Restoration
            </button>
          ) : null}

          {project.status === "in_progress" && onRestore ? (
            <button
              type="button"
              onClick={() => onRestore(project.id)}
              disabled={!project.canRestore}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:from-emerald-600 enabled:hover:to-teal-600 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {project.canRestore ? "Restore" : "Gather Requirements"}
            </button>
          ) : null}
        </div>
      ) : null}

      {isRestored && project.completionRewardDescriptions.length > 0 ? (
        <div className="mt-3 rounded-xl border border-emerald-100/80 bg-emerald-50/40 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">
            Rewards earned
          </p>
          <ul className="mt-1 space-y-0.5">
            {project.completionRewardDescriptions.map((reward) => (
              <li key={reward} className="text-xs text-stone-600">
                {reward}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
