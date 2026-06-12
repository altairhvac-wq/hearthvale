import type { SkillId, SkillUnlock } from "@/types";
import {
  computeSkillLevelInfo,
  createSkillXpService,
  isRegisteredSkill,
} from "@/game/skills";
import type { GameStore } from "../game-store";

export interface SkillsSlice {
  addSkillXp: (skillId: SkillId, amount: number) => SkillUnlock[];
  getSkillLevel: (skillId: SkillId) => number;
  getSkillUnlocks: (skillId: SkillId) => SkillUnlock[];
  getSkillLevelInfo: (
    skillId: SkillId,
  ) => ReturnType<typeof computeSkillLevelInfo> | null;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createSkillsSlice(set: SetState, get: GetState): SkillsSlice {
  const skillService = createSkillXpService(
    () => get().skills,
    (skillId, updater) => {
      set((state) => {
        const current = state.skills[skillId];

        if (!current) {
          return state;
        }

        return {
          skills: {
            ...state.skills,
            [skillId]: updater(current),
          },
        };
      });
    },
  );

  return {
    addSkillXp(skillId, amount) {
      if (!isRegisteredSkill(skillId)) {
        console.warn(
          `[Hearthvale] Attempted to award XP to unknown skill: ${skillId}`,
        );
        return [];
      }

      const result = skillService.awardXp(skillId, amount);
      return result?.newUnlocks ?? [];
    },

    getSkillLevel(skillId) {
      return skillService.getLevel(skillId);
    },

    getSkillUnlocks(skillId) {
      return skillService.getUnlocks(skillId);
    },

    getSkillLevelInfo(skillId) {
      const progress = get().skills[skillId];

      if (!progress) {
        return null;
      }

      return computeSkillLevelInfo(progress);
    },
  };
}
