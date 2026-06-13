import { DEFAULT_USER_ID, DEFAULT_VALLEY_ID } from "@/game/constants/valley";
import { FOUNDATION_EPOCH } from "@/game/constants/foundation";
import { REGION_DEFINITIONS } from "@/game/constants/regions";
import { createInitialMembershipsState } from "@/game/valley";
import { createInitialMerchantState } from "@/game/merchant/state";
import { createInitialProsperityState } from "@/game/prosperity/state";
import { createInitialRequestsState } from "@/game/requests/state";
import { createInitialReputationState } from "@/game/reputation/state";
import { createInitialGatheringState } from "@/game/gathering/state";
import type { Player, RegionId, ValleySaveData } from "@/types";
import {
  createUserFromLegacyPlayer,
  createValleySaveFromLegacyFlatSave,
  stripLegacyPlayerLocation,
} from "./initial-state";
import type { SaveMigration } from "@/types";

function asLegacyPlayer(value: unknown): Player & { activeRegionId?: RegionId | null } {
  const record = (value ?? {}) as Record<string, unknown>;

  return {
    ...(record as unknown as Player),
    userId: (record.userId as Player["userId"] | undefined) ?? DEFAULT_USER_ID,
    activeRegionId: (record.activeRegionId as RegionId | null | undefined) ?? null,
  };
}

function asKeyedRecord<T>(value: unknown): Record<string, T> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, T>;
  }

  return {};
}

function migrateValleyToV4(valley: ValleySaveData): ValleySaveData {
  return {
    ...valley,
    merchant: valley.merchant ?? createInitialMerchantState(),
    prosperity: valley.prosperity ?? createInitialProsperityState(),
    requests: valley.requests ?? createInitialRequestsState(),
    reputation: valley.reputation ?? createInitialReputationState(),
  };
}

function migrateValleyToV5(valley: ValleySaveData): ValleySaveData {
  return {
    ...valley,
    gathering: valley.gathering ?? createInitialGatheringState(),
  };
}

function migrateValleysToV5(
  valleys: Record<string, ValleySaveData>,
): Record<string, ValleySaveData> {
  return Object.fromEntries(
    Object.entries(valleys).map(([valleyId, valley]) => [
      valleyId,
      migrateValleyToV5(migrateValleyToV4(valley)),
    ]),
  );
}

function migrateValleyToV6(valley: ValleySaveData): ValleySaveData {
  const regions = { ...valley.regions };

  for (const definition of REGION_DEFINITIONS) {
    if (definition.unlockRequirement) {
      continue;
    }

    const region = regions[definition.id];

    if (!region || region.state !== "locked") {
      continue;
    }

    regions[definition.id] = {
      ...region,
      state: "unlocked",
      discoveryProgress: Math.max(region.discoveryProgress, 5),
      unlockedAt: region.unlockedAt ?? FOUNDATION_EPOCH,
    };
  }

  return {
    ...valley,
    regions,
  };
}

function migrateValleysToV6(
  valleys: Record<string, ValleySaveData>,
): Record<string, ValleySaveData> {
  return Object.fromEntries(
    Object.entries(valleys).map(([valleyId, valley]) => [
      valleyId,
      migrateValleyToV6(valley),
    ]),
  );
}

export const SAVE_MIGRATIONS: SaveMigration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate(data) {
      const player = { ...(data.player as Record<string, unknown>) };
      delete player.unlockedRegionIds;

      return {
        ...data,
        version: 2,
        player,
        events: data.events ?? {},
        minigames: data.minigames ?? {},
        decorations: data.decorations ?? {},
      };
    },
  },
  {
    fromVersion: 2,
    toVersion: 3,
    migrate(data) {
      const legacyPlayer = asLegacyPlayer(data.player);
      const valleySave = createValleySaveFromLegacyFlatSave({
        player: legacyPlayer,
        regions: asKeyedRecord(data.regions),
        quests: asKeyedRecord(data.quests),
        animals: asKeyedRecord(data.animals),
        restoration: asKeyedRecord(data.restoration),
        events: asKeyedRecord(data.events),
        minigames: asKeyedRecord(data.minigames),
        decorations: asKeyedRecord(data.decorations),
      });
      const user = createUserFromLegacyPlayer(legacyPlayer);
      const player = stripLegacyPlayerLocation(legacyPlayer);

      return {
        version: 3,
        savedAt: data.savedAt,
        user,
        player: {
          ...player,
          userId: player.userId ?? DEFAULT_USER_ID,
        },
        skills: data.skills ?? {},
        inventory: data.inventory ?? [],
        activeValleyId: DEFAULT_VALLEY_ID,
        valleys: {
          [DEFAULT_VALLEY_ID]: valleySave,
        },
        memberships: createInitialMembershipsState(player.lastPlayedAt),
        pendingInvites: {},
        visitSessions: {},
      };
    },
  },
  {
    fromVersion: 3,
    toVersion: 4,
    migrate(data) {
      const valleys = asKeyedRecord<ValleySaveData>(data.valleys);

      return {
        ...data,
        version: 4,
        valleys: Object.fromEntries(
          Object.entries(valleys).map(([valleyId, valley]) => [
            valleyId,
            migrateValleyToV4(valley),
          ]),
        ),
      };
    },
  },
  {
    fromVersion: 4,
    toVersion: 5,
    migrate(data) {
      const valleys = asKeyedRecord<ValleySaveData>(data.valleys);

      return {
        ...data,
        version: 5,
        valleys: migrateValleysToV5(valleys),
      };
    },
  },
  {
    fromVersion: 5,
    toVersion: 6,
    migrate(data) {
      const valleys = asKeyedRecord<ValleySaveData>(data.valleys);

      return {
        ...data,
        version: 6,
        valleys: migrateValleysToV6(valleys),
      };
    },
  },
];

export function migrateSaveData(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  let data = { ...raw };
  let version = typeof data.version === "number" ? data.version : 0;

  const migrationsByFromVersion = new Map(
    SAVE_MIGRATIONS.map((migration) => [migration.fromVersion, migration]),
  );

  while (version > 0 && version < 999) {
    const migration = migrationsByFromVersion.get(version);

    if (!migration) {
      break;
    }

    data = migration.migrate(data);
    version = migration.toVersion;
  }

  return data;
}
