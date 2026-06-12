import type { ResourceIconKey } from "@/game/constants/icon-keys";
import { isResourceIconKey } from "@/game/constants/icon-keys";
import {
  RESOURCE_DEFINITIONS,
  RESOURCE_IDS,
  type CoreResourceId,
} from "@/game/constants/resources";
import type { PlayerResources, ResourceId } from "@/types";

export interface ResourceDisplayItem {
  id: ResourceId;
  name: string;
  amount: number;
  iconKey: ResourceIconKey;
}

const CORE_RESOURCE_IDS: CoreResourceId[] = [
  RESOURCE_IDS.COINS,
  RESOURCE_IDS.HEARTS,
  RESOURCE_IDS.VALLEY_CHARM,
];

/** Core resources for the top bar — amounts from runtime player state. */
export function getCoreResourceDisplay(
  resources: PlayerResources,
): ResourceDisplayItem[] {
  return CORE_RESOURCE_IDS.map((id) => {
    const definition = RESOURCE_DEFINITIONS.find((entry) => entry.id === id);
    const rawIconKey = definition?.iconKey ?? "coin";

    return {
      id,
      name: definition?.name ?? id,
      amount: resources[id] ?? 0,
      iconKey: isResourceIconKey(rawIconKey) ? rawIconKey : "coin",
    };
  });
}
