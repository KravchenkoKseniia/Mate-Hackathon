interface StepIndicatorProps {
  current: number;
  total?: number;
}

const LABELS = ["Upload", "Background", "Style & Generate", "Generating", "Results"];

export default function StepIndicator({ current, total = 5 }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-xl mx-auto mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold w-8 h-8 transition-all shrink-0"
                style={{
                  backgroundColor: isActive || isDone ? "var(--color-accent)" : "var(--color-surface-alt)",
                  color: isActive || isDone ? "#fff" : "var(--color-text)",
                  opacity: isDone ? 0.7 : 1,
                  border: !isActive && !isDone ? "1px solid var(--color-border-hover)" : "none",
                }}
              >
                {isDone ? "\u2713" : step}
              </div>
              <span
                className="text-[9px] sm:text-[10px] font-medium whitespace-nowrap transition-colors"
                style={{ color: isActive || isDone ? "var(--color-accent)" : "var(--color-muted)" }}
              >
                {LABELS[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div className="flex-1 h-px mx-2 sm:mx-3 mt-[-16px] transition-colors" style={{ backgroundColor: isDone ? "var(--color-accent)" : "var(--color-border)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
