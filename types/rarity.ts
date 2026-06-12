export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface RarityDefinition {
  id: Rarity;
  label: string;
  sortOrder: number;
}
