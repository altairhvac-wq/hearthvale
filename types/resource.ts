import type { ResourceId } from "./ids";
import type { Rarity } from "./rarity";

export interface Resource {
  id: ResourceId;
  name: string;
  description: string;
  iconKey: string;
  rarity: Rarity;
  isPremium: boolean;
}
