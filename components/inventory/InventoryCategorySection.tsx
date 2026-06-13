import type { InventoryCategoryGroup } from "@/game/inventory/view-model";
import { InventoryItemCard } from "./InventoryItemCard";

interface InventoryCategorySectionProps {
  group: InventoryCategoryGroup;
}

export function InventoryCategorySection({ group }: InventoryCategorySectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-stone-700">{group.label}</h2>
      <div className="space-y-2">
        {group.items.map((item) => (
          <InventoryItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
