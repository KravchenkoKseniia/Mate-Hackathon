interface NavButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}

export default function NavButtons({ onBack, onNext, nextLabel = "Next step", backLabel = "Back", nextDisabled = false, loading = false }: NavButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-10 mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {onBack && (
        <button
          onClick={onBack}
          className="h-11 px-6 sm:px-7 rounded-full flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ color: "var(--color-accent)", border: "1px solid var(--color-border-hover)", backgroundColor: "var(--color-surface)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {backLabel}
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="h-11 px-8 sm:px-10 rounded-full flex items-center gap-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--color-accent)", opacity: nextDisabled ? 0.4 : 1, cursor: nextDisabled ? "not-allowed" : "pointer" }}
        >
          {loading && (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {nextLabel}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
    </div>
  );
}
