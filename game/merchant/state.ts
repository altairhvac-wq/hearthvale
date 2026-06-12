import {
  MERCHANT_STAGE_DEFINITIONS,
  MERCHANT_STAGE_IDS,
  isRegisteredMerchantStage,
} from "@/game/constants/merchant";
import type {
  MerchantStageId,
  MerchantStageProgress,
  MerchantStageStatus,
  MerchantState,
} from "@/types";

const MERCHANT_STAGE_STATUSES: readonly MerchantStageStatus[] = [
  "locked",
  "available",
  "active",
  "maxed",
];

function isMerchantStageStatus(value: unknown): value is MerchantStageStatus {
  return (
    typeof value === "string" &&
    (MERCHANT_STAGE_STATUSES as readonly string[]).includes(value)
  );
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeLevel(value: unknown, maxLevel: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(Math.floor(value), maxLevel));
}

function createDefaultStageProgress(
  stageId: MerchantStageId,
): MerchantStageProgress {
  const isStarter = stageId === MERCHANT_STAGE_IDS.MARKET_STAND;

  return {
    id: stageId,
    status: isStarter ? "active" : "locked",
    level: 1,
    upgradedAt: null,
  };
}

export function createInitialMerchantState(): MerchantState {
  const stages = MERCHANT_STAGE_DEFINITIONS.reduce<
    Record<MerchantStageId, MerchantStageProgress>
  >((acc, definition) => {
    acc[definition.id] = createDefaultStageProgress(definition.id);
    return acc;
  }, {} as Record<MerchantStageId, MerchantStageProgress>);

  return {
    stages,
    activeStageId: MERCHANT_STAGE_IDS.MARKET_STAND,
  };
}

function mergeStageProgress(
  definitionId: MerchantStageId,
  saved: MerchantStageProgress | undefined,
  fallback: MerchantStageProgress,
  maxLevel: number,
): MerchantStageProgress {
  if (!saved || saved.id !== definitionId) {
    return fallback;
  }

  return {
    id: definitionId,
    status: isMerchantStageStatus(saved.status) ? saved.status : fallback.status,
    level: normalizeLevel(saved.level, maxLevel),
    upgradedAt: normalizeTimestamp(saved.upgradedAt),
  };
}

export function mergeMerchantState(saved: MerchantState | undefined): MerchantState {
  const defaults = createInitialMerchantState();

  if (!saved) {
    return defaults;
  }

  const stages = MERCHANT_STAGE_DEFINITIONS.reduce<
    Record<MerchantStageId, MerchantStageProgress>
  >((acc, definition) => {
    acc[definition.id] = mergeStageProgress(
      definition.id,
      saved.stages?.[definition.id],
      defaults.stages[definition.id]!,
      definition.maxLevel,
    );
    return acc;
  }, {} as Record<MerchantStageId, MerchantStageProgress>);

  const activeStageId =
    typeof saved.activeStageId === "string" &&
    isRegisteredMerchantStage(saved.activeStageId)
      ? saved.activeStageId
      : defaults.activeStageId;

  return {
    stages,
    activeStageId,
  };
}

export function getActiveMerchantStage(
  state: MerchantState,
): MerchantStageProgress {
  return state.stages[state.activeStageId]!;
}

export function getTotalMerchantLevels(state: MerchantState): number {
  return Object.values(state.stages).reduce((sum, stage) => sum + stage.level, 0);
}
