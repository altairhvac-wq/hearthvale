import type { EventId, RegionId } from "./ids";

export type EventType = "random" | "seasonal" | "story" | "festival";

export interface Event {
  id: EventId;
  type: EventType;
  title: string;
  description: string;
  regionId: RegionId | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  metadata: Record<string, string | number | boolean>;
}
