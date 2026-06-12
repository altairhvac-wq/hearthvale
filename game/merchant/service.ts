import {
  getMerchantStageDefinition,
  isRegisteredMerchantStage,
  MERCHANT_STAGE_DEFINITIONS,
} from "@/game/constants/merchant";
import { applyGameRewards, type GameRewardCallbacks } from "@/game/rewards";
import type {
  MerchantStageId,
  MerchantStageProgress,
  MerchantState,
  ResourceId,
} from "@/types";
import type { MerchantEvaluationContext } from "./context";
import {
  canActivateMerchantStage,
  canUpgradeMerchantStage,
  getLevelRewardsForUpgrade,
  getNextUpgradeRequirement,
  resolveActiveMerchantStageId,
  resolveMerchantStageStatus,
} from "./progression";

export interface MerchantUpgradeResult {
  stageId: MerchantStageId;
  previousLevel: number;
  newLevel: number;
  stageMaxed: boolean;
}

export interface MerchantServiceCallbacks extends GameRewardCallbacks {
  commitMerchantUpgrade: (
    required: Array<{ resourceId: ResourceId; amount: number }>,
    applyMerchant: (merchant: MerchantState) => MerchantState | null,
  ) => boolean;
  onMerchantChanged: () => void;
}

export interface MerchantService {
  refreshMerchantAvailability: () => void;
  activateMerchantStage: (stageId: MerchantStageId) => boolean;
  upgradeMerchantStage: (stageId: MerchantStageId) => MerchantUpgradeResult | null;
}

type MerchantReader = () => MerchantState;
type MerchantWriter = (updater: (current: MerchantState) => MerchantState) => void;
type ContextReader = () => MerchantEvaluationContext;

export function createMerchantService(
  readMerchant: MerchantReader,
  writeMerchant: MerchantWriter,
  readContext: ContextReader,
  callbacks: MerchantServiceCallbacks,
): MerchantService {
  function updateStage(
    stageId: MerchantStageId,
    updater: (current: MerchantStageProgress) => MerchantStageProgress,
  ): void {
    writeMerchant((current) => {
      const stage = current.stages[stageId];

      if (!stage) {
        return current;
      }

      return {
        ...current,
        stages: {
          ...current.stages,
          [stageId]: updater(stage),
        },
      };
    });
  }

  function reconcileStages(): void {
    const context = readContext();

    for (const definition of MERCHANT_STAGE_DEFINITIONS) {
      const stage = readMerchant().stages[definition.id];

      if (!stage) {
        continue;
      }

      const nextStatus = resolveMerchantStageStatus(definition, stage, context);

      if (nextStatus !== stage.status) {
        updateStage(definition.id, (current) => ({
          ...current,
          status: nextStatus,
        }));
      }
    }

    const activeStageId = resolveActiveMerchantStageId(
      readMerchant().stages,
      readContext(),
    );

    if (readMerchant().activeStageId !== activeStageId) {
      writeMerchant((current) => ({
        ...current,
        activeStageId,
      }));
    }
  }

  return {
    refreshMerchantAvailability() {
      reconcileStages();
    },

    activateMerchantStage(stageId) {
      if (!isRegisteredMerchantStage(stageId)) {
        return false;
      }

      const context = readContext();

      if (!canActivateMerchantStage(stageId, context)) {
        return false;
      }

      updateStage(stageId, (current) => ({
        ...current,
        status: "active",
      }));

      writeMerchant((current) => ({
        ...current,
        activeStageId: stageId,
      }));

      callbacks.onMerchantChanged();
      return true;
    },

    upgradeMerchantStage(stageId) {
      if (!isRegisteredMerchantStage(stageId)) {
        return null;
      }

      const definition = getMerchantStageDefinition(stageId);
      const context = readContext();

      if (!definition || !canUpgradeMerchantStage(stageId, context)) {
        return null;
      }

      const stage = readMerchant().stages[stageId];

      if (!stage) {
        return null;
      }

      const requirement = getNextUpgradeRequirement(definition, stage);

      if (!requirement) {
        return null;
      }

      const previousLevel = stage.level;
      const newLevel = previousLevel + 1;
      const stageMaxed = newLevel >= definition.maxLevel;
      const now = new Date().toISOString();

      const committed = callbacks.commitMerchantUpgrade(
        requirement.requiredResources,
        (merchant) => {
          const currentStage = merchant.stages[stageId];

          if (!currentStage || currentStage.level !== previousLevel) {
            return null;
          }

          if (!canUpgradeMerchantStage(stageId, readContext())) {
            return null;
          }

          return {
            ...merchant,
            stages: {
              ...merchant.stages,
              [stageId]: {
                ...currentStage,
                level: newLevel,
                status: stageMaxed ? "maxed" : "active",
                upgradedAt: now,
              },
            },
          };
        },
      );

      if (!committed) {
        return null;
      }

      applyGameRewards(getLevelRewardsForUpgrade(definition, newLevel), callbacks);
      reconcileStages();
      callbacks.onMerchantChanged();

      return {
        stageId,
        previousLevel,
        newLevel,
        stageMaxed,
      };
    },
  };
}
