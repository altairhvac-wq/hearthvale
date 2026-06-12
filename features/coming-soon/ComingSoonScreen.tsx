"use client";

import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { useIsGameHydrated, usePlayerHeaderData } from "@/store";

interface ComingSoonScreenProps {
  title: string;
  description: string;
}

export function ComingSoonScreen({ title, description }: ComingSoonScreenProps) {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();

  if (!isHydrated || !headerData) {
    return <GameLoadingState message="Loading..." />;
  }

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-3xl border border-stone-200/60 bg-white/70 px-8 py-10 shadow-sm backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-stone-800">{title}</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
            {description}
          </p>
        </div>
      </div>
    </GameShell>
  );
}
