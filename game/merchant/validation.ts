import { isRegisteredMerchantStage } from "@/game/constants/merchant";
import type { MerchantStageStatus, MerchantState } from "@/types";

const MERCHANT_STAGE_STATUSES: readonly MerchantStageStatus[] = [
  "locked",
  "available",
  "active",
  "maxed",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMerchantStageStatus(value: unknown): value is MerchantStageStatus {
  return (
    typeof value === "string" &&
    (MERCHANT_STAGE_STATUSES as readonly string[]).includes(value)
  );
}

export function isPersistedMerchantState(value: unknown): value is MerchantState {
  if (!isObject(value)) {
    return false;
  }

  if (!isObject(value.stages) || typeof value.activeStageId !== "string") {
    return false;
  }

  if (!isRegisteredMerchantStage(value.activeStageId)) {
    return false;
  }

  return Object.values(value.stages).every((stage) => {
    if (!isObject(stage)) {
      return false;
    }

    return (
      typeof stage.id === "string" &&
      isRegisteredMerchantStage(stage.id) &&
      isMerchantStageStatus(stage.status) &&
      typeof stage.level === "number" &&
      Number.isFinite(stage.level) &&
      stage.level >= 1 &&
      (stage.upgradedAt === null || typeof stage.upgradedAt === "string")
    );
  });
}
