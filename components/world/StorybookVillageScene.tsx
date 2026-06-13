"use client";

interface StorybookVillageSceneProps {
  className?: string;
  highlightMarket?: boolean;
}

export function StorybookVillageScene({
  className = "",
  highlightMarket = false,
}: StorybookVillageSceneProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Warm dawn sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200/90 via-amber-100/70 to-emerald-100/80" />

      {/* Soft sun */}
      <div className="absolute left-[18%] top-[6%] h-14 w-14 rounded-full bg-gradient-to-br from-amber-200 to-orange-300/80 shadow-[0_0_40px_rgba(251,191,36,0.45)] sm:h-16 sm:w-16" />
      <div className="absolute left-[19%] top-[7%] h-10 w-10 rounded-full bg-amber-50/40 blur-sm sm:h-12 sm:w-12" />

      {/* Distant hills */}
      <div className="absolute bottom-[38%] left-0 right-0 h-[28%]">
        <div className="absolute bottom-0 left-[-5%] h-full w-[45%] rounded-t-[100%] bg-emerald-300/35" />
        <div className="absolute bottom-0 left-[25%] h-[85%] w-[50%] rounded-t-[100%] bg-teal-300/30" />
        <div className="absolute bottom-0 right-[-8%] h-[92%] w-[48%] rounded-t-[100%] bg-sky-300/25" />
      </div>

      {/* Forest path silhouette — back ridge */}
      <div className="absolute left-[28%] top-[14%] flex items-end gap-0.5 opacity-80 sm:gap-1">
        {["h-10", "h-14", "h-11", "h-16", "h-12", "h-[3.75rem]", "h-10", "h-[3.25rem]"].map(
          (height, index) => (
            <div
              key={index}
              className={`w-3 rounded-t-full bg-gradient-to-t from-emerald-800/70 to-teal-600/50 sm:w-4 ${height}`}
            />
          ),
        )}
      </div>
      <div className="absolute left-[32%] top-[18%] text-lg opacity-70 sm:text-xl">
        🌲
      </div>

      {/* Animal sanctuary ruins — left */}
      <div className="absolute bottom-[42%] left-[4%] w-[22%]">
        <div className="relative h-16 sm:h-20">
          <div className="absolute bottom-0 left-[10%] h-10 w-3 rounded-t-sm bg-stone-400/60 sm:h-12 sm:w-4" />
          <div className="absolute bottom-0 left-[45%] h-14 w-3 rounded-t-sm bg-stone-500/55 sm:h-16 sm:w-4" />
          <div className="absolute bottom-8 left-0 right-0 h-2 rounded-full bg-stone-400/45" />
          <div className="absolute bottom-10 left-[8%] right-[8%] h-1.5 rounded-full bg-stone-300/40" />
        </div>
        <div className="mt-1 text-center text-base opacity-60 sm:text-lg">🦌</div>
      </div>

      {/* Harbor / dock silhouette — right */}
      <div className="absolute bottom-[40%] right-[3%] w-[24%]">
        <div className="relative h-14 sm:h-16">
          <div className="absolute bottom-0 left-[15%] h-8 w-1.5 bg-stone-500/50 sm:h-10" />
          <div className="absolute bottom-0 left-[35%] h-10 w-1.5 bg-stone-500/55 sm:h-12" />
          <div className="absolute bottom-0 left-[55%] h-7 w-1.5 bg-stone-500/45 sm:h-9" />
          <div className="absolute bottom-0 left-[75%] h-9 w-1.5 bg-stone-500/50 sm:h-11" />
          <div className="absolute bottom-0 left-[10%] right-[10%] h-1.5 rounded-sm bg-stone-600/40" />
        </div>
        <div className="absolute bottom-[-8%] left-0 right-0 h-8 rounded-t-[40%] bg-gradient-to-t from-sky-400/35 to-sky-300/15" />
        <div className="mt-2 text-center text-base opacity-60 sm:text-lg">⚓</div>
      </div>

      {/* Mystery silhouettes — distant fog */}
      <div className="absolute left-[2%] top-[10%] opacity-35">
        <div className="flex h-8 w-10 items-end justify-center rounded-t-lg bg-stone-400/40 sm:h-10 sm:w-12">
          <span className="mb-0.5 text-xs text-stone-500/80">🏛️</span>
        </div>
      </div>
      <div className="absolute right-[2%] top-[8%] opacity-30">
        <div className="h-6 w-14 rounded-full bg-sky-200/50 blur-[1px]" />
        <span className="mt-0.5 block text-center text-xs text-sky-600/60">
          🌫️
        </span>
      </div>
      <div className="absolute bottom-[18%] left-[8%] opacity-25">
        <div className="h-10 w-8 rounded-full bg-emerald-700/25 blur-[2px]" />
        <span className="block text-center text-[10px] text-stone-500/70">?</span>
      </div>

      {/* Village square — cobblestone center */}
      <div className="absolute bottom-[28%] left-1/2 h-[22%] w-[38%] -translate-x-1/2">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-stone-300/35 via-amber-200/25 to-stone-400/20 shadow-inner" />
        <div className="absolute inset-2 rounded-[1.5rem] border border-stone-400/20 border-dashed" />
        {/* Tiny cottages around square */}
        <div className="absolute -left-3 bottom-2 text-sm opacity-80 sm:text-base">
          🏠
        </div>
        <div className="absolute -right-2 bottom-4 text-sm opacity-75 sm:text-base">
          🏠
        </div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs opacity-70">
          🏡
        </div>
      </div>

      {/* Market stand illustration */}
      <div className="absolute bottom-[36%] left-[28%] sm:left-[30%]">
        <div className="relative">
          {highlightMarket ? (
            <div className="absolute -inset-3 rounded-2xl bg-amber-300/25 blur-md" />
          ) : null}
          <div className="relative h-7 w-10 rounded-sm bg-gradient-to-b from-amber-700/70 to-amber-900/60 sm:h-8 sm:w-12" />
          <div className="absolute -top-2 left-[-4px] right-[-4px] h-3 rounded-t-lg bg-gradient-to-r from-rose-300/80 via-amber-200/80 to-rose-300/80 sm:h-3.5" />
          <div className="absolute -bottom-1 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-amber-900/50" />
        </div>
      </div>

      {/* Wildflower meadow foreground */}
      <div className="absolute bottom-0 left-0 right-0 h-[26%] bg-gradient-to-t from-emerald-400/45 via-lime-300/30 to-transparent" />
      <div className="absolute bottom-[6%] left-[48%] flex gap-1 text-sm opacity-80 sm:text-base">
        <span>🌸</span>
        <span>🌼</span>
        <span>🌷</span>
      </div>
      <div className="absolute bottom-[10%] left-[62%] flex gap-0.5 text-xs opacity-70">
        <span>🌿</span>
        <span>🌸</span>
      </div>

      {/* Worn paths */}
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 36 56 Q 46 62 58 74"
          fill="none"
          stroke="rgba(120, 113, 108, 0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
        />
        <path
          d="M 50 68 Q 50 45 50 20"
          fill="none"
          stroke="rgba(120, 113, 108, 0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 42 60 Q 22 52 14 44"
          fill="none"
          stroke="rgba(120, 113, 108, 0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 48 58 Q 68 52 86 46"
          fill="none"
          stroke="rgba(120, 113, 108, 0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Warm vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-sky-900/5" />
    </div>
  );
}
