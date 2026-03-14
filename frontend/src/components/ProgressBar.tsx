import type { AppStep } from "../types";

const STEPS = ["Upload", "Remove BG", "Select Scenes", "Generate", "Results"];

interface ProgressBarProps {
  currentStep: AppStep;
  onStepClick?: () => void;
}

export default function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="mb-12 flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const canClick = isCompleted && onStepClick;
        return (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`flex flex-col items-center gap-1.5${canClick ? " cursor-pointer" : ""}`}
              onClick={canClick ? onStepClick : undefined}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? "var(--color-accent)"
                    : isCurrent
                      ? "var(--color-accent-soft)"
                      : "var(--color-surface-alt)",
                  color: isCompleted
                    ? "#fff"
                    : isCurrent
                      ? "var(--color-accent-text)"
                      : "var(--color-faint)",
                  border: isCurrent
                    ? "2px solid var(--color-accent)"
                    : isCompleted
                      ? "none"
                      : "1px solid var(--color-border)",
                }}
              >
                {isCompleted ? "\u2713" : i + 1}
              </div>
              <span
                className="text-[10px] sm:text-xs hidden sm:block font-medium"
                style={{
                  color: isCurrent
                    ? "var(--color-accent-text)"
                    : isCompleted
                      ? "var(--color-muted)"
                      : "var(--color-faint)",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-6 sm:w-10 h-px mt-[-16px]"
                style={{
                  backgroundColor: isCompleted
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
