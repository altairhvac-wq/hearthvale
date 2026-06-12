interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  className = "",
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-stone-200/80 bg-white/60 text-center backdrop-blur-sm ${
        compact ? "px-4 py-5" : "px-6 py-8"
      } ${className}`}
    >
      <p className="text-sm font-semibold text-stone-700">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-stone-500 sm:text-sm">
        {description}
      </p>
    </div>
  );
}
