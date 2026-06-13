import type { CharacterPresenceViewModel } from "@/game/world/view-model";
import { CHARACTER_PRESENCE_LABELS } from "@/game/constants/world/labels";

interface CharacterPresenceProps {
  character: CharacterPresenceViewModel;
  compact?: boolean;
}

export function CharacterPresence({
  character,
  compact = false,
}: CharacterPresenceProps) {
  const isFuture = character.presence === "future_resident";

  return (
    <div
      className={`rounded-xl border p-3 ${
        character.isSpeakingToday
          ? "border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-white/90"
          : isFuture
            ? "border-stone-200/50 bg-stone-50/50"
            : "border-stone-200/60 bg-white/70"
      } ${isFuture ? "opacity-85" : ""}`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1 ring-stone-200/60 ${
            isFuture ? "grayscale-[30%]" : ""
          }`}
          aria-hidden
        >
          {character.portrait.fallbackEmoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-semibold text-stone-800">{character.name}</p>
            {isFuture ? (
              <span className="rounded-full bg-stone-200/70 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-stone-500">
                {CHARACTER_PRESENCE_LABELS.futureResident}
              </span>
            ) : null}
          </div>

          {character.dialogue ? (
            <p
              className={`mt-1 leading-relaxed text-stone-600 ${
                compact ? "text-xs italic" : "text-sm"
              }`}
            >
              &ldquo;{character.dialogue.text}&rdquo;
            </p>
          ) : null}

          {!compact && isFuture ? (
            <p className="mt-1 text-[11px] leading-snug text-stone-400">
              {character.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
