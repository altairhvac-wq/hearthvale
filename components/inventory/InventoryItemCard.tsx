import type { InventoryItemViewModel } from "@/game/inventory/view-model";
import { ItemIcon } from "@/components/icons/GameIcons";

interface InventoryItemCardProps {
  item: InventoryItemViewModel;
}

export function InventoryItemCard({ item }: InventoryItemCardProps) {
  const showQuantity = item.category !== "tool";

  return (
    <article className="flex gap-3 rounded-2xl border border-stone-200/70 bg-white/80 p-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50">
        <ItemIcon iconKey={item.iconKey} className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-stone-800">{item.name}</h3>
          {showQuantity ? (
            <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-800">
              ×{item.quantity}
            </span>
          ) : (
            <span className="shrink-0 rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              Carried
            </span>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">
          {item.description}
        </p>
        {showQuantity && item.quantity >= item.stackLimit ? (
          <p className="mt-1 text-[11px] text-amber-700">Stack full</p>
        ) : null}
      </div>
    </article>
  );
}
