import type { GatherNodeViewModel } from "@/game/gathering/view-model";
import { GatherCategoryBadge } from "./GatherCategoryBadge";

interface ResourceNodeCardProps {
  node: GatherNodeViewModel;
  onGather: (nodeId: GatherNodeViewModel["id"]) => void;
  disabled?: boolean;
}

function statusLabel(status: GatherNodeViewModel["status"]): string {
  switch (status) {
    case "available":
      return "Ready";
    case "depleted":
      return "Depleted";
    case "respawning":
      return "Recovering";
  }
}

function statusClassName(status: GatherNodeViewModel["status"]): string {
  switch (status) {
    case "available":
      return "bg-emerald-100 text-emerald-800";
    case "depleted":
      return "bg-stone-200 text-stone-600";
    case "respawning":
      return "bg-amber-100 text-amber-800";
  }
}

export function ResourceNodeCard({
  node,
  onGather,
  disabled = false,
}: ResourceNodeCardProps) {
  const canAct = node.canGather && !disabled;

  return (
    <article className="rounded-2xl border border-stone-200/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-stone-800">{node.name}</h3>
            <GatherCategoryBadge category={node.category} />
          </div>
          <p className="text-xs leading-relaxed text-stone-500">
            {node.description}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClassName(node.status)}`}
        >
          {statusLabel(node.status)}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-stone-600">
        <div className="rounded-xl bg-stone-50/90 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-stone-400">
            Yields
          </p>
          <p className="font-medium text-stone-700">{node.resourceName}</p>
        </div>
        <div className="rounded-xl bg-stone-50/90 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-stone-400">
            Skill
          </p>
          <p className="font-medium text-stone-700">
            {node.skillName} Lv. {node.playerSkillLevel}
          </p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {node.rewardLabels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
          >
            {label}
          </span>
        ))}
      </div>

      {node.toolLabel ? (
        <p className="mb-3 text-[11px] text-stone-500">
          Requires {node.toolLabel}
        </p>
      ) : null}

      {node.blockMessage && !node.canGather ? (
        <p className="mb-3 text-[11px] text-amber-700">{node.blockMessage}</p>
      ) : null}

      <button
        type="button"
        onClick={() => onGather(node.id)}
        disabled={!canAct}
        className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
          canAct
            ? "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
            : "cursor-not-allowed bg-stone-100 text-stone-400"
        }`}
      >
        {canAct ? `Gather ${node.resourceName}` : "Unavailable"}
      </button>
    </article>
  );
}
