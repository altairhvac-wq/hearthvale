/** Branded ID types for compile-time safety across game domains. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type PlayerId = Brand<string, "PlayerId">;
export type GameUserId = Brand<string, "GameUserId">;
export type ValleyId = Brand<string, "ValleyId">;
export type ValleyInviteId = Brand<string, "ValleyInviteId">;
export type VisitSessionId = Brand<string, "VisitSessionId">;
export type AnimalId = Brand<string, "AnimalId">;
export type QuestId = Brand<string, "QuestId">;
export type SeasonId = Brand<string, "SeasonId">;
export type ResourceId = Brand<string, "ResourceId">;
export type RegionId = Brand<string, "RegionId">;
export type SkillId = Brand<string, "SkillId">;
export type ItemId = Brand<string, "ItemId">;
export type EventId = Brand<string, "EventId">;
export type MiniGameId = Brand<string, "MiniGameId">;
export type DecorationId = Brand<string, "DecorationId">;
export type RestorationProjectId = Brand<string, "RestorationProjectId">;
export type UnlockId = Brand<string, "UnlockId">;
export type MerchantStageId = Brand<string, "MerchantStageId">;
export type CustomerRequestId = Brand<string, "CustomerRequestId">;
export type ProsperityTierId = Brand<string, "ProsperityTierId">;
export type GatherableResourceId = Brand<string, "GatherableResourceId">;
export type ResourceNodeId = Brand<string, "ResourceNodeId">;
export type ToolTypeId = Brand<string, "ToolTypeId">;
export type LocationId = Brand<string, "LocationId">;
export type CharacterId = Brand<string, "CharacterId">;
export type DialogueId = Brand<string, "DialogueId">;
export type DiscoveryLocationId = Brand<string, "DiscoveryLocationId">;

const ID_PATTERN = /^[a-z][a-z0-9_]*$/;

export function createId<T extends string>(value: string): Brand<string, T> {
  if (process.env.NODE_ENV !== "production" && !ID_PATTERN.test(value)) {
    throw new Error(
      `[Hearthvale] Invalid id "${value}" — use lowercase snake_case.`,
    );
  }

  return value as Brand<string, T>;
}
