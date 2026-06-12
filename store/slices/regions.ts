import type { RegionId } from "@/types";
import type { GameStore } from "../game-store";

export interface RegionsSlice {
  setActiveRegionId: (regionId: RegionId) => boolean;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

function isRegionTravelable(
  regions: GameStore["regions"],
  regionId: RegionId,
): boolean {
  const region = regions[regionId];

  if (!region) {
    return false;
  }

  return region.state === "unlocked" || region.state === "restored";
}

export function createRegionsSlice(set: SetState, get: GetState): RegionsSlice {
  return {
    setActiveRegionId(regionId) {
      const state = get();

      if (!isRegionTravelable(state.regions, regionId)) {
        return false;
      }

      set({
        player: {
          ...state.player,
          activeRegionId: regionId,
        },
      });

      return true;
    },
  };
}
