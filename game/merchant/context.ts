import type {
  Animal,
  MerchantState,
  PlayerResources,
  ProsperityState,
  Quest,
  Region,
  ReputationState,
  RequestsState,
  RestorationProject,
  SkillProgress,
} from "@/types";
import type { SkillId } from "@/types";

export interface MerchantEvaluationContext {
  quests: Record<string, Quest>;
  skills: Record<string, SkillProgress>;
  regions: Record<string, Region>;
  restoration: Record<string, RestorationProject>;
  animals: Record<string, Animal>;
  merchant: MerchantState;
  prosperity: ProsperityState;
  reputation: ReputationState;
  requests: RequestsState;
  playerResources: PlayerResources;
  getSkillLevel: (skillId: SkillId) => number;
  getProsperityScore: () => number;
  getProsperityTier: () => number;
}

export function buildMerchantContextFromGameState(state: {
  quests: Record<string, Quest>;
  skills: Record<string, SkillProgress>;
  regions: Record<string, Region>;
  restoration: Record<string, RestorationProject>;
  animals: Record<string, Animal>;
  merchant: MerchantState;
  prosperity: ProsperityState;
  reputation: ReputationState;
  requests: RequestsState;
  player: { resources: PlayerResources };
  getSkillLevel: (skillId: SkillId) => number;
  getProsperityScore: () => number;
  getProsperityTier: () => number;
}): MerchantEvaluationContext {
  return {
    quests: state.quests,
    skills: state.skills,
    regions: state.regions,
    restoration: state.restoration,
    animals: state.animals,
    merchant: state.merchant,
    prosperity: state.prosperity,
    reputation: state.reputation,
    requests: state.requests,
    playerResources: state.player.resources,
    getSkillLevel: state.getSkillLevel,
    getProsperityScore: state.getProsperityScore,
    getProsperityTier: state.getProsperityTier,
  };
}
