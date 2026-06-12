import { createUnlockApplicator } from "@/game/quests/service";
import { spendResourcesIfAffordable } from "@/game/player/resources";
import { addItemsToInventory } from "@/game/inventory/service";
import type { GameRewardCallbacks } from "@/game/rewards";
import type {
  AnimalSpeciesId,
  ItemId,
  QuestId,
  RegionId,
  ResourceId,
  RestorationResourceRequirement,
  SkillId,
} from "@/types";
import type { UnlockReference } from "@/types";
import type { GameStore } from "../game-store";
import { applyAnimalSpeciesUnlock } from "./animals";

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createStoreUnlockApplicator(
  set: SetState,
): (unlock: UnlockReference) => void {
  return createUnlockApplicator({
    unlockRegion(regionId: RegionId) {
      set((state) => {
        const region = state.regions[regionId];

        if (!region || region.state === "restored") {
          return state;
        }

        if (region.state !== "locked") {
          return state;
        }

        return {
          regions: {
            ...state.regions,
            [regionId]: {
              ...region,
              state: "unlocked",
              unlockedAt: region.unlockedAt ?? new Date().toISOString(),
            },
          },
        };
      });
    },

    unlockQuest(questId: QuestId) {
      set((state) => {
        const quest = state.quests[questId];

        if (!quest || quest.status !== "locked") {
          return state;
        }

        return {
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              status: "available",
            },
          },
        };
      });
    },

    unlockAnimal(speciesId: AnimalSpeciesId) {
      applyAnimalSpeciesUnlock(set, speciesId);
    },
  });
}

export function createStoreGameRewardCallbacks(
  set: SetState,
  get: GetState,
): GameRewardCallbacks {
  const applyUnlock = createStoreUnlockApplicator(set);

  return {
    awardResource(resourceId: ResourceId, amount: number) {
      set((state) => ({
        player: {
          ...state.player,
          resources: {
            ...state.player.resources,
            [resourceId]:
              (state.player.resources[resourceId] ?? 0) + amount,
          },
        },
      }));
    },

    awardSkillXp(skillId: SkillId, amount: number) {
      get().addSkillXp(skillId, amount);
    },

    applyUnlock,

    awardItem(itemId: ItemId, amount: number) {
      set((state) => ({
        inventory: addItemsToInventory(state.inventory, itemId, amount),
      }));
    },

    awardProsperity(amount: number) {
      get().awardProsperityBonus(amount);
    },

    awardReputation(amount: number) {
      get().awardReputation(amount);
    },
  };
}

export function createStoreSpendResources(
  set: SetState,
): (required: RestorationResourceRequirement[]) => boolean {
  return (required) => {
    let spent = false;

    set((state) => {
      const nextResources = spendResourcesIfAffordable(
        state.player.resources,
        required,
      );

      if (!nextResources) {
        return state;
      }

      spent = true;

      return {
        player: {
          ...state.player,
          resources: nextResources,
        },
      };
    });

    return spent;
  };
}
