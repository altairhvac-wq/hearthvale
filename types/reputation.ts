/** Static reputation level threshold — titles ship in a future pass. */
export interface ReputationLevelDefinition {
  level: number;
  title: string;
  description: string;
  minScore: number;
}

/** Valley-scoped merchant reputation — distinct from account-wide player level. */
export interface ReputationState {
  score: number;
}
