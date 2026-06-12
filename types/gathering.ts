import type { GameUserId, GatherableResourceId, ItemId, RegionId, ResourceNodeId, SkillId, ToolTypeId } from "./ids";
import type { Rarity } from "./rarity";
import type { UnlockRequirement } from "./unlock-requirement";

/** Gathering skill categories — extensible for future systems. */
export type GatheringCategory =
  | "foraging"
  | "woodcutting"
  | "mining"
  | "fishing";

export const GATHERING_CATEGORIES = [
  "foraging",
  "woodcutting",
  "mining",
  "fishing",
] as const satisfies ReadonlyArray<GatheringCategory>;

export type ResourceNodeStatus = "available" | "depleted" | "respawning";

export const RESOURCE_NODE_STATUSES = [
  "available",
  "depleted",
  "respawning",
] as const satisfies ReadonlyArray<ResourceNodeStatus>;

/** Static catalog entry for a gatherable material. */
export interface GatherableResourceDefinition {
  id: GatherableResourceId;
  name: string;
  description: string;
  category: GatheringCategory;
  skillId: SkillId;
  itemId: ItemId;
  iconKey: string;
  rarity: Rarity;
  stackLimit: number;
}

/** Tool gate for resource nodes — supports future upgrade tiers. */
export interface ToolRequirement {
  toolTypeId: ToolTypeId;
  minimumTier: number;
}

/**
 * Respawn configuration for resource nodes.
 * V1 uses `on_refresh`; `timed` is reserved for future real-time respawns.
 */
export interface RespawnRule {
  maxGathersPerCycle: number;
  respawnMode: "on_refresh" | "timed";
  respawnDurationMs?: number;
}

/** Static catalog entry for a gatherable world node. */
export interface ResourceNodeDefinition {
  id: ResourceNodeId;
  name: string;
  description: string;
  regionId: RegionId;
  resourceId: GatherableResourceId;
  category: GatheringCategory;
  skillId: SkillId;
  minimumSkillLevel: number;
  toolRequirement: ToolRequirement | null;
  baseYield: number;
  skillXp: number;
  respawnRule: RespawnRule;
  sortOrder: number;
  unlockRequirement: UnlockRequirement | null;
}

/** Per-valley runtime state for one resource node — multiplayer-ready shape. */
export interface ResourceNodeInstance {
  id: ResourceNodeId;
  status: ResourceNodeStatus;
  gathersThisCycle: number;
  depletedAt: string | null;
  respawnAt: string | null;
  lastGatheredAt: string | null;
  lastGatheredByUserId: GameUserId | null;
}

/** Valley-scoped gathering progress. */
export interface GatheringState {
  nodes: Record<ResourceNodeId, ResourceNodeInstance>;
}
