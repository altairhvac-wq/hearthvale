/** UI chrome for world layer components — not story content. */
export const WORLD_SCENE_LABELS = {
  someoneHere: "Someone here",
  waitingToReturn: "Waiting to return",
  whatYouNotice: "What you notice",
  restorationDream: "A dream worth pursuing",
} as const;

export const CHARACTER_PRESENCE_LABELS = {
  futureResident: "Future resident",
} as const;

export const REGION_CARD_LABELS = {
  defaultProgress: "The valley waits",
  here: "Here",
  offMap: "Off map",
  toReachThisPlace: "To reach this place",
} as const;

export const REGION_MAP_LABELS = {
  mapUnavailableTitle: "Map unavailable",
  mapUnavailableDescription:
    "No regions have map positions yet. They will still appear in the list below.",
  youAreHere: "You",
} as const;

export const HOME_SCREEN_LABELS = {
  subtitle: "A valley waiting to bloom again",
  emptyTitle: "The valley is quiet",
  emptyDescription:
    "No paths are open yet — but your journey will begin here soon.",
  valleyEyebrow: "The valley",
  firstSessionMapTitle: "Paths waiting to be walked",
  returningMapTitle: "Places waiting for you",
  exploreEyebrow: "Explore",
  exploreTitle: "Walk the valley paths",
  peacefulDay:
    "The valley is peaceful today — wander the paths and listen for the Festival Cart's bells.",
  currentObjectiveEyebrow: "What calls to you",
  marketStandEyebrow: "Your stand",
  neighborAsks: "A neighbor asks:",
  visit: "Visit",
  futureUnlocksEyebrow: "Horizons ahead",
  futureUnlocksTitle: "Dreams waiting beyond today's path",
  futureUnlocksCompactEyebrow: "A whisper on the wind",
  futureUnlocksCompactTitle: "The valley holds more than you can see yet",
} as const;

export const REGION_STATUS_LABELS = {
  locked: "Distant",
  available: "Waiting",
  in_progress: "Needs care",
  restored: "Thriving",
} as const;

export const WORLD_HOTSPOT_LABELS = {
  sceneEyebrow: "Hearthvale",
  sceneTitle: "The village at dawn",
  firstSessionSceneTitle: "Your valley awaits",
  tapToExplore: "Tap a place to learn more",
  mysterySubtitle: "Not yet within reach",
  mysteryAtmosphere: "Something waits beyond the mist — patience will reveal it.",
  unknownPlace: "Unknown place",
  marketStandSubtitle: "At the edge of the square",
  visitMarketStand: "Visit Market Stand",
  visitStand: "Visit stand",
  gatherWildflowers: "Gather wildflowers",
  walkMeadow: "Walk the meadow",
  explorePath: "Explore the path",
  visitSanctuary: "Visit sanctuary",
  youAreHere: "You are here",
  distantSilhouette: "Distant silhouette",
} as const;
