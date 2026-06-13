import type { HomeVillageStatusViewModel } from "@/game/onboarding/home-view-model";
import type { VillageStoryCopy } from "@/game/constants/immersion";

interface VillageStoryPanelProps {
  story: VillageStoryCopy;
  villageStatus: HomeVillageStatusViewModel;
  showFullStory?: boolean;
}

export function VillageStoryPanel({
  story,
  villageStatus,
  showFullStory = true,
}: VillageStoryPanelProps) {
  return (
    <section className="rounded-3xl border border-stone-200/60 bg-gradient-to-br from-stone-50/90 via-amber-50/40 to-emerald-50/30 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-sm italic text-stone-500">
            {villageStatus.moodTitle}
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-stone-900">
            {story.headline}
          </h1>
        </div>
        <span className="shrink-0 text-2xl" aria-hidden>
          🏡
        </span>
      </div>

      {showFullStory ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {story.intro}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800/80">
            {story.hope}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {villageStatus.narrative}
        </p>
      )}
    </section>
  );
}
