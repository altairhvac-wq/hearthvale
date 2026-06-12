import type { SaveMigration } from "@/types";

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
