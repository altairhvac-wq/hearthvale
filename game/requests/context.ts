import type {
  MerchantState,
  ProsperityState,
  Quest,
  Region,
  ReputationState,
  RequestsState,
  RestorationProject,
  SkillId,
  SkillProgress,
} from "@/types";

export interface RequestEvaluationContext {
  quests: Record<string, Quest>;
  skills: Record<string, SkillProgress>;
  regions: Record<string, Region>;
  restoration: Record<string, RestorationProject>;
  merchant: MerchantState;
  prosperity: ProsperityState;
  reputation: ReputationState;
  requests: RequestsState;
  getSkillLevel: (skillId: SkillId) => number;
  getProsperityTier: () => number;
}

export function buildRequestContextFromGameState(state: {
  quests: Record<string, Quest>;
  skills: Record<string, SkillProgress>;
  regions: Record<string, Region>;
  restoration: Record<string, RestorationProject>;
  merchant: MerchantState;
  prosperity: ProsperityState;
  reputation: ReputationState;
  requests: RequestsState;
  getSkillLevel: (skillId: SkillId) => number;
  getProsperityTier: () => number;
}): RequestEvaluationContext {
  return {
    quests: state.quests,
    skills: state.skills,
    regions: state.regions,
    restoration: state.restoration,
    merchant: state.merchant,
    prosperity: state.prosperity,
    reputation: state.reputation,
    requests: state.requests,
    getSkillLevel: state.getSkillLevel,
    getProsperityTier: state.getProsperityTier,
  };
}
