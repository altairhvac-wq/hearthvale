import {
  getMerchantStageDefinition,
  getMerchantStageVisualLabel,
  MERCHANT_STAGE_DEFINITIONS,
} from "@/game/constants/merchant";
import { RESOURCE_DEFINITIONS } from "@/game/constants/resources";
import { describeGameReward } from "@/game/rewards";
import { describeUnlockRequirement } from "@/game/unlock/descriptions";
import { calculateProsperityScore } from "@/game/prosperity/calculate";
import { buildProsperityViewModel } from "@/game/prosperity/view-model";
import { buildReputationViewModel } from "@/game/reputation/view-model";
import { buildRequestViewModels } from "@/game/requests/view-model";
import type { MerchantEvaluationContext } from "./context";
import {
  canActivateMerchantStage,
  canUpgradeMerchantStage,
  getLevelRewardsForUpgrade,
  getNextUpgradeRequirement,
  resolveMerchantStageStatus,
} from "./progression";
import { getActiveMerchantStage } from "./state";
import type {
  MerchantStageId,
  MerchantStageStatus,
  MerchantVisualState,
} from "@/types";

export interface MerchantStageViewModel {
  id: MerchantStageId;
  title: string;
  description: string;
  iconEmoji: string;
  status: MerchantStageStatus;
  level: number;
  maxLevel: number;
  visualState: MerchantVisualState;
  visualLabel: string;
  isActive: boolean;
  canActivate: boolean;
  canUpgrade: boolean;
  unlockDescription: string | null;
  upgradeCosts: Array<{ label: string; amount: number }>;
  levelRewardDescriptions: string[];
}

export interface MerchantScreenData {
  activeStage: MerchantStageViewModel;
  stages: MerchantStageViewModel[];
  prosperity: ReturnType<typeof buildProsperityViewModel>;
  reputation: ReturnType<typeof buildReputationViewModel>;
  activeRequests: ReturnType<typeof buildRequestViewModels>["active"];
  availableRequests: ReturnType<typeof buildRequestViewModels>["available"];
  lockedRequests: ReturnType<typeof buildRequestViewModels>["locked"];
  upgradeOpportunities: MerchantStageViewModel[];
}

function buildStageViewModel(
  stageId: MerchantStageId,
  context: MerchantEvaluationContext,
): MerchantStageViewModel | null {
  const definition = getMerchantStageDefinition(stageId);
  const stage = context.merchant.stages[stageId];

  if (!definition || !stage) {
    return null;
  }

  const status = resolveMerchantStageStatus(definition, stage, context);
  const visualState: MerchantVisualState =
    definition.visualStatesByLevel[stage.level] ??
    definition.visualStatesByLevel[1] ??
    "humble_stall";
  const nextUpgrade = getNextUpgradeRequirement(definition, stage);
  const nextLevel = stage.level + 1;

  return {
    id: stageId,
    title: definition.title,
    description: definition.description,
    iconEmoji: definition.iconEmoji,
    status,
    level: stage.level,
    maxLevel: definition.maxLevel,
    visualState,
    visualLabel: getMerchantStageVisualLabel(visualState),
    isActive: context.merchant.activeStageId === stageId,
    canActivate: canActivateMerchantStage(stageId, context),
    canUpgrade: canUpgradeMerchantStage(stageId, context),
    unlockDescription: definition.unlockRequirement
      ? describeUnlockRequirement(definition.unlockRequirement)
      : null,
    upgradeCosts:
      nextUpgrade?.requiredResources.map((cost) => {
        const definition = RESOURCE_DEFINITIONS.find(
          (entry) => entry.id === cost.resourceId,
        );
        return {
          label: definition?.name ?? cost.resourceId,
          amount: cost.amount,
        };
      }) ?? [],
    levelRewardDescriptions: getLevelRewardsForUpgrade(definition, nextLevel).map(
      describeGameReward,
    ),
  };
}

export function buildMerchantScreenData(
  context: MerchantEvaluationContext,
): MerchantScreenData {
  const prosperityScore = calculateProsperityScore({
    restoration: context.restoration,
    animals: context.animals,
    merchant: context.merchant,
    prosperity: context.prosperity,
  });

  const stages = MERCHANT_STAGE_DEFINITIONS.flatMap((definition) => {
    const viewModel = buildStageViewModel(definition.id, context);
    return viewModel ? [viewModel] : [];
  });

  const activeStage =
    buildStageViewModel(context.merchant.activeStageId, context) ??
    buildStageViewModel(getActiveMerchantStage(context.merchant).id, context)!;

  const requestBoard = buildRequestViewModels(context);

  return {
    activeStage,
    stages,
    prosperity: buildProsperityViewModel({
      restoration: context.restoration,
      animals: context.animals,
      merchant: context.merchant,
      prosperity: context.prosperity,
    }),
    reputation: buildReputationViewModel(context.reputation),
    activeRequests: requestBoard.active,
    availableRequests: requestBoard.available,
    lockedRequests: requestBoard.locked,
    upgradeOpportunities: stages.filter(
      (stage) => stage.canUpgrade || stage.canActivate,
    ),
  };
}
