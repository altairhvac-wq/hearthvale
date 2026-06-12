import { DEFAULT_USER_ID, DEFAULT_VALLEY_ID } from "@/game/constants/valley";
import { createInitialMembershipsState } from "@/game/valley";
import type { Player, RegionId } from "@/types";
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
