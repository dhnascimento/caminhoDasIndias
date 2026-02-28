interface ProgressBarProps {
  current: number;
  total: number;
  onSlideClick?: (index: number) => void;
}

export function ProgressBar({ current, total, onSlideClick }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Progress bar */}
      <div className="h-1 bg-[var(--progress-bar-bg)]">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'var(--progress-bar-fill)',
          }}
        />
      </div>

      {/* Slide indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-sm flex items-center gap-2">
        <span className="text-[var(--color-text)]">{current + 1}</span>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="text-[var(--color-text-muted)]">{total}</span>
      </div>

      {/* Clickable segments (invisible, for navigation) */}
      {onSlideClick && (
        <div className="absolute inset-0 flex">
          {Array.from({ length: total }).map((_, index) => (
            <button
              key={index}
              className="flex-1 cursor-pointer hover:bg-[var(--color-primary)]/20 transition-colors"
              onClick={() => onSlideClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
