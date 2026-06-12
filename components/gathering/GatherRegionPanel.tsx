import type { GatherRegionViewModel } from "@/game/gathering/view-model";
import { ResourceNodeCard } from "./ResourceNodeCard";

interface GatherRegionPanelProps {
  region: GatherRegionViewModel;
  onGather: (nodeId: import("@/types").ResourceNodeId) => void;
  isExpanded: boolean;
  onToggle: () => void;
  actionDisabled?: boolean;
}

export function GatherRegionPanel({
  region,
  onGather,
  isExpanded,
  onToggle,
  actionDisabled = false,
}: GatherRegionPanelProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/60 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-white/80"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-stone-800">
              {region.name}
            </h2>
            {region.isActive ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Here
              </span>
            ) : null}
            {!region.isAccessible ? (
              <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600">
                Locked
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-stone-500">{region.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-medium text-emerald-700">
            {region.availableCount} ready
          </p>
          <p className="text-[10px] text-stone-400">
            {region.nodes.length} spots
          </p>
        </div>
      </button>

      {isExpanded ? (
        <div className="space-y-3 border-t border-stone-200/60 px-4 pb-4 pt-3">
          {region.nodes.length === 0 ? (
            <p className="text-xs text-stone-500">
              No gathering spots discovered here yet.
            </p>
          ) : (
            <>
              {region.availableCount === 0 ? (
                <p className="rounded-xl bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
                  All spots here are recovering. Refresh the screen or explore
                  another region.
                </p>
              ) : null}
              {region.nodes.map((node) => (
                <ResourceNodeCard
                  key={node.id}
                  node={node}
                  onGather={onGather}
                  disabled={actionDisabled || !region.isAccessible}
                />
              ))}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
