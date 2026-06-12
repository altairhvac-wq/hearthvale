import { getEventRarityWeightMultiplier } from "@/game/constants/events";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type {
  EventDefinition,
  EventGate,
  EventInstance,
  EventSchedulerState,
} from "@/types";
import type { EventEvaluationContext } from "./context";

export function isEventGateMet(
  gate: EventGate,
  context: EventEvaluationContext,
  instances: Record<string, EventInstance>,
): boolean {
  switch (gate.kind) {
    case "event_completed": {
      const instance = instances[gate.eventId];
      return instance?.status === "completed";
    }
    case "season_active":
      return context.activeSeasonId === gate.seasonId;
    default:
      return isUnlockRequirementMet(gate, context);
  }
}

export function areEventGatesMet(
  gates: EventGate[],
  context: EventEvaluationContext,
  instances: Record<string, EventInstance>,
): boolean {
  return gates.every((gate) => isEventGateMet(gate, context, instances));
}

export function isSeasonRequirementMet(
  definition: EventDefinition,
  context: EventEvaluationContext,
): boolean {
  if (!definition.availability.seasonId) {
    return true;
  }

  return context.activeSeasonId === definition.availability.seasonId;
}

export function isEventOnCooldown(
  definition: EventDefinition,
  instance: EventInstance,
  scheduler: EventSchedulerState,
): boolean {
  if (instance.lastCompletedEvaluation === null) {
    return false;
  }

  const elapsed =
    scheduler.evaluationCount - instance.lastCompletedEvaluation;

  return elapsed < definition.availability.cooldownEvaluations;
}

export function isEventSelectable(
  definition: EventDefinition,
  instance: EventInstance,
  context: EventEvaluationContext,
  instances: Record<string, EventInstance>,
  scheduler: EventSchedulerState,
): boolean {
  if (
    instance.status === "available" ||
    instance.status === "active" ||
    instance.status === "completed"
  ) {
    return false;
  }

  if (scheduler.evaluationCount < definition.availability.minEvaluationCount) {
    return false;
  }

  if (!isSeasonRequirementMet(definition, context)) {
    return false;
  }

  if (
    !areEventGatesMet(definition.availability.gates, context, instances)
  ) {
    return false;
  }

  if (isEventOnCooldown(definition, instance, scheduler)) {
    return false;
  }

  return true;
}

export function computeEventSelectionWeight(
  definition: EventDefinition,
): number {
  return (
    definition.availability.selectionWeight *
    getEventRarityWeightMultiplier(definition.rarity)
  );
}

export function getEligibleEventDefinitions(
  definitions: readonly EventDefinition[],
  instances: Record<string, EventInstance>,
  context: EventEvaluationContext,
  scheduler: EventSchedulerState,
): EventDefinition[] {
  return definitions.filter((definition) => {
    const instance = instances[definition.id];

    if (!instance) {
      return false;
    }

    return isEventSelectable(
      definition,
      instance,
      context,
      instances,
      scheduler,
    );
  });
}

export function pickWeightedEventDefinition(
  eligible: EventDefinition[],
  randomValue: number,
): EventDefinition | null {
  if (eligible.length === 0) {
    return null;
  }

  const weights = eligible.map((definition) =>
    computeEventSelectionWeight(definition),
  );
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  if (totalWeight <= 0) {
    return eligible[0] ?? null;
  }

  let threshold = randomValue * totalWeight;

  for (let index = 0; index < eligible.length; index += 1) {
    const weight = weights[index] ?? 0;
    threshold -= weight;

    if (threshold <= 0) {
      return eligible[index] ?? null;
    }
  }

  return eligible[eligible.length - 1] ?? null;
}
