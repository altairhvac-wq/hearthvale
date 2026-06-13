import type { LocationSceneViewModel } from "@/game/world/view-model";
import { WORLD_SCENE_LABELS } from "@/game/constants/world/labels";
import { CharacterPresence } from "./CharacterPresence";

interface WorldScenePanelProps {
  scene: LocationSceneViewModel;
  compact?: boolean;
  className?: string;
}

export function WorldScenePanel({
  scene,
  compact = false,
  className = "",
}: WorldScenePanelProps) {
  const speakingCharacters = scene.characters.filter((c) => c.isSpeakingToday);
  const futureResidents = scene.characters.filter(
    (c) => c.presence === "future_resident",
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {!compact ? (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
            {scene.subtitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">
            {scene.atmosphereDescription}
          </p>
        </div>
      ) : null}

      {compact && scene.discoveryDescription ? (
        <p className="text-xs italic leading-relaxed text-stone-500">
          {scene.discoveryDescription}
        </p>
      ) : null}

      {!compact && scene.discoveryDescription ? (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700/70">
            {WORLD_SCENE_LABELS.whatYouNotice}
          </p>
          <p className="mt-1 text-xs italic leading-relaxed text-stone-500">
            {scene.discoveryDescription}
          </p>
        </div>
      ) : null}

      {speakingCharacters.length > 0 ? (
        <div className="space-y-2">
          {!compact ? (
            <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700/80">
              {WORLD_SCENE_LABELS.someoneHere}
            </p>
          ) : null}
          {speakingCharacters.map((character) => (
            <CharacterPresence
              key={character.id}
              character={character}
              compact={compact}
            />
          ))}
        </div>
      ) : null}

      {!compact && futureResidents.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
            {WORLD_SCENE_LABELS.waitingToReturn}
          </p>
          {futureResidents.map((character) => (
            <CharacterPresence
              key={character.id}
              character={character}
              compact
            />
          ))}
        </div>
      ) : null}

      {!compact ? (
        <div className="rounded-xl border border-violet-200/40 bg-gradient-to-br from-violet-50/50 to-amber-50/30 px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-violet-600/80">
            {WORLD_SCENE_LABELS.restorationDream}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-stone-600 italic">
            {scene.restorationDream}
          </p>
        </div>
      ) : null}
    </div>
  );
}
