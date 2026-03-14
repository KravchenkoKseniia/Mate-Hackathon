import type { AppStep } from "../types";

const STEPS = ["Upload", "Remove BG", "Select Scenes", "Generate", "Results"];

interface ProgressBarProps {
  currentStep: AppStep;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-10 flex items-center justify-center gap-2">
      {STEPS.map((label, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-500 text-white"
                    : isCurrent
                      ? "bg-blue-500/20 text-blue-400 ring-2 ring-blue-500"
                      : "bg-[#1a1a1a] text-neutral-500 border border-[#2a2a2a]"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  isCurrent
                    ? "text-blue-400"
                    : isCompleted
                      ? "text-neutral-400"
                      : "text-neutral-600"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-px mt-[-16px] ${
                  isCompleted ? "bg-blue-500" : "bg-[#2a2a2a]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
