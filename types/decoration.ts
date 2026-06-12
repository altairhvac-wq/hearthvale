import type { DecorationId, RegionId } from "./ids";
import type { Rarity } from "./rarity";

export interface Decoration {
  id: DecorationId;
  definitionId: string;
  name: string;
  description: string;
  rarity: Rarity;
  regionId: RegionId | null;
  placedAt: string | null;
  rotation: number;
  position: { x: number; y: number } | null;
}
