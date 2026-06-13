"use client";

import type { PlayerLevelInfo } from "@/game/player/level";
import type { ResourceDisplayItem } from "@/game/player/resources";
import { BottomNavigation } from "./BottomNavigation";
import { PlayerLevelStrip } from "./PlayerLevelStrip";
import { ResourceBar } from "./ResourceBar";

interface GameShellProps {
  children: React.ReactNode;
  resources: ResourceDisplayItem[];
  levelInfo: PlayerLevelInfo;
  displayName: string;
  isNewPlayer?: boolean;
  title?: string;
  subtitle?: string;
}

export function GameShell({
  children,
  resources,
  levelInfo,
  displayName,
  isNewPlayer = false,
  title,
  subtitle,
}: GameShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-200/50 bg-gradient-to-b from-amber-50/95 via-stone-50/95 to-stone-50/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-lg px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] sm:max-w-xl sm:px-6 md:max-w-2xl">
          {(title || subtitle) && (
            <div className="mb-3 text-center">
              {title ? (
                <h1 className="text-lg font-semibold tracking-tight text-stone-800 sm:text-xl">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
                  {subtitle}
                </p>
              ) : null}
            </div>
          )}
          <ResourceBar resources={resources} className="mb-3" hidden={isNewPlayer} />
          <PlayerLevelStrip
            levelInfo={levelInfo}
            displayName={displayName}
            isNewPlayer={isNewPlayer}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-4 sm:max-w-xl sm:px-6 sm:py-6 md:max-w-2xl">
        {children}
      </main>

      <BottomNavigation className="sticky bottom-0 z-20" />
    </div>
  );
}
