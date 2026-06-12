import type { ReputationState } from "@/types";

export interface ReputationService {
  awardReputation: (amount: number) => void;
  getScore: () => number;
}

type ReputationReader = () => ReputationState;
type ReputationWriter = (updater: (current: ReputationState) => ReputationState) => void;

export function createReputationService(
  readReputation: ReputationReader,
  writeReputation: ReputationWriter,
): ReputationService {
  return {
    awardReputation(amount) {
      if (amount <= 0) {
        return;
      }

      writeReputation((current) => ({
        ...current,
        score: current.score + amount,
      }));
    },

    getScore() {
      return readReputation().score;
    },
  };
}
