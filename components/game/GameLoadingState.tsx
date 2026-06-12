interface GameLoadingStateProps {
  message?: string;
}

export function GameLoadingState({
  message = "Awakening the valley...",
}: GameLoadingStateProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8">
      <div className="h-8 w-8 animate-pulse rounded-full bg-emerald-200/80" />
      <p className="text-sm text-stone-500">{message}</p>
    </div>
  );
}
