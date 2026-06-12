import { REGION_DEFINITIONS } from "@/game/constants/regions";
import {
  getValleyMapNode,
  VALLEY_MAP_CONNECTIONS,
} from "@/game/constants/valley-map";
import { describeUnlockRequirement } from "@/game/unlock/descriptions";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type { UnlockEvaluationContext } from "@/game/unlock/context";
import type {
  Region,
  RegionDefinition,
  RegionId,
  UnlockRequirement,
} from "@/types";
import {
  deriveRegionDisplayStatus,
  type RegionDisplayStatus,
} from "./display-status";
import { shouldShowUnlockRequirement } from "./presentation";
import type { RegionIconKey } from "@/game/constants/icon-keys";
import { resolveRegionIconKey } from "@/game/constants/icon-keys";

export type { UnlockEvaluationContext } from "@/game/unlock/context";

export interface MapConnectionViewModel {
  from: RegionId;
  to: RegionId;
}

export interface RegionViewModel {
  id: RegionId;
  name: string;
  description: string;
  theme: string;
  sortOrder: number;
  displayStatus: RegionDisplayStatus;
  runtimeState: Region["state"];
  discoveryProgress: number;
  restorationProgress: number;
  progressPercent: number;
  unlockRequirement: UnlockRequirement | null;
  unlockRequirementDescription: string | null;
  isUnlockRequirementMet: boolean;
  showUnlockRequirement: boolean;
  isActive: boolean;
  canTravel: boolean;
  isOnMap: boolean;
  mapPosition: { x: number; y: number } | null;
  iconKey: RegionIconKey;
}

export interface ValleyMapData {
  regions: RegionViewModel[];
  connections: MapConnectionViewModel[];
  activeRegionId: RegionId | null;
  reachableCount: number;
  mappedRegionCount: number;
}

function getProgressPercent(region: Region, displayStatus: RegionDisplayStatus): number {
  if (displayStatus === "restored") {
    return 100;
  }

  if (displayStatus === "in_progress") {
    return region.restorationProgress;
  }

  if (displayStatus === "available" && region.state === "unlocked") {
    return region.discoveryProgress;
  }

  return region.discoveryProgress;
}

function canTravelToRegion(region: Region): boolean {
  return region.state === "unlocked" || region.state === "restored";
}

function buildRegionViewModel(
  definition: RegionDefinition,
  runtime: Region,
  activeRegionId: RegionId | null,
  context: UnlockEvaluationContext,
): RegionViewModel {
  const displayStatus = deriveRegionDisplayStatus(runtime);
  const mapNode = getValleyMapNode(definition.id);
  const unlockRequirement = definition.unlockRequirement;
  const unlockRequirementDescription = unlockRequirement
    ? describeUnlockRequirement(unlockRequirement)
    : null;
  const isUnlockRequirementMetValue = unlockRequirement
    ? isUnlockRequirementMet(unlockRequirement, context)
    : true;

  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    theme: definition.theme,
    sortOrder: definition.sortOrder,
    displayStatus,
    runtimeState: runtime.state,
    discoveryProgress: runtime.discoveryProgress,
    restorationProgress: runtime.restorationProgress,
    progressPercent: getProgressPercent(runtime, displayStatus),
    unlockRequirement,
    unlockRequirementDescription,
    isUnlockRequirementMet: isUnlockRequirementMetValue,
    showUnlockRequirement: shouldShowUnlockRequirement(
      displayStatus,
      unlockRequirementDescription,
      isUnlockRequirementMetValue,
    ),
    isActive: activeRegionId === definition.id,
    canTravel: canTravelToRegion(runtime),
    isOnMap: mapNode !== null,
    mapPosition: mapNode?.position ?? null,
    iconKey: resolveRegionIconKey(mapNode?.iconKey, definition.theme),
  };
}

export function buildValleyMapData(
  activeRegionId: RegionId | null,
  regions: Record<string, Region>,
  context: UnlockEvaluationContext,
): ValleyMapData {
  const sortedDefinitions = [...REGION_DEFINITIONS].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const regionViewModels = sortedDefinitions
    .map((definition) => {
      const runtime = regions[definition.id];

      if (!runtime) {
        return null;
      }

      return buildRegionViewModel(definition, runtime, activeRegionId, context);
    })
    .filter((entry): entry is RegionViewModel => entry !== null);

  const reachableCount = regionViewModels.filter(
    (region) => region.canTravel,
  ).length;
  const mappedRegionCount = regionViewModels.filter(
    (region) => region.isOnMap,
  ).length;

  return {
    regions: regionViewModels,
    connections: VALLEY_MAP_CONNECTIONS.map((connection) => ({
      from: connection.from,
      to: connection.to,
    })),
    activeRegionId,
    reachableCount,
    mappedRegionCount,
  };
}
