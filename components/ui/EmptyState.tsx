interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-stone-200/80 bg-white/60 px-6 py-8 text-center backdrop-blur-sm ${className}`}
    >
      <p className="text-sm font-semibold text-stone-700">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-stone-500 sm:text-sm">
        {description}
      </p>
    </div>
  );
}
