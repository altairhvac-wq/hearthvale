import {
  getMerchantStageDefinition,
  MERCHANT_STAGE_DEFINITIONS,
} from "@/game/constants/merchant";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type {
  MerchantStageDefinition,
  MerchantStageId,
  MerchantStageProgress,
  MerchantStageStatus,
  GameReward,
  PlayerResources,
} from "@/types";
import type { MerchantEvaluationContext } from "./context";

export function canUnlockMerchantStage(
  definition: MerchantStageDefinition,
  context: MerchantEvaluationContext,
): boolean {
  if (!definition.unlockRequirement) {
    return true;
  }

  return isUnlockRequirementMet(definition.unlockRequirement, context);
}

export function canAffordMerchantUpgrade(
  definition: MerchantStageDefinition,
  stage: MerchantStageProgress,
  resources: PlayerResources,
): boolean {
  const nextLevel = stage.level + 1;

  if (nextLevel > definition.maxLevel) {
    return false;
  }

  const requirement = definition.upgradeRequirements.find(
    (entry) => entry.level === nextLevel,
  );

  if (!requirement) {
    return false;
  }

  return requirement.requiredResources.every(
    (cost) => (resources[cost.resourceId] ?? 0) >= cost.amount,
  );
}

export function getNextUpgradeRequirement(
  definition: MerchantStageDefinition,
  stage: MerchantStageProgress,
) {
  const nextLevel = stage.level + 1;
  return definition.upgradeRequirements.find((entry) => entry.level === nextLevel) ?? null;
}

export function getLevelRewardsForUpgrade(
  definition: MerchantStageDefinition,
  targetLevel: number,
): GameReward[] {
  return (
    definition.levelRewards.find((entry) => entry.level === targetLevel)?.rewards ??
    []
  );
}

export function resolveMerchantStageStatus(
  definition: MerchantStageDefinition,
  stage: MerchantStageProgress,
  context: MerchantEvaluationContext,
): MerchantStageStatus {
  if (stage.level >= definition.maxLevel) {
    return "maxed";
  }

  if (stage.status === "active" || stage.status === "maxed") {
    return stage.level >= definition.maxLevel ? "maxed" : "active";
  }

  if (!canUnlockMerchantStage(definition, context)) {
    return "locked";
  }

  return "available";
}

export function resolveActiveMerchantStageId(
  merchantStages: Record<MerchantStageId, MerchantStageProgress>,
  context: MerchantEvaluationContext,
): MerchantStageId {
  const sorted = [...MERCHANT_STAGE_DEFINITIONS].sort(
    (a, b) => b.sortOrder - a.sortOrder,
  );

  for (const definition of sorted) {
    const stage = merchantStages[definition.id];

    if (!stage) {
      continue;
    }

    const status = resolveMerchantStageStatus(definition, stage, context);

    if (status === "active" || status === "maxed") {
      return definition.id;
    }
  }

  return MERCHANT_STAGE_DEFINITIONS[0]!.id;
}

export function canUpgradeMerchantStage(
  stageId: MerchantStageId,
  context: MerchantEvaluationContext,
): boolean {
  const definition = getMerchantStageDefinition(stageId);

  if (!definition) {
    return false;
  }

  const stage = context.merchant.stages[stageId];

  if (!stage) {
    return false;
  }

  const status = resolveMerchantStageStatus(definition, stage, context);

  if (status !== "active") {
    return false;
  }

  return canAffordMerchantUpgrade(
    definition,
    stage,
    context.playerResources,
  );
}

export function canActivateMerchantStage(
  stageId: MerchantStageId,
  context: MerchantEvaluationContext,
): boolean {
  const definition = getMerchantStageDefinition(stageId);

  if (!definition) {
    return false;
  }

  const stage = context.merchant.stages[stageId];

  if (!stage) {
    return false;
  }

  const status = resolveMerchantStageStatus(definition, stage, context);

  return status === "available";
}
