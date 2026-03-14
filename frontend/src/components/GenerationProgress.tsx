import AppShell from "./AppShell";
import StepIndicator from "./StepIndicator";

interface GenerationProgressProps {
  currentScene: number;
  totalScenes: number;
  sceneName: string;
}

export default function GenerationProgress({ currentScene, totalScenes, sceneName }: GenerationProgressProps) {
  const progress = ((currentScene - 1) / totalScenes) * 100;

  return (
    <AppShell stepIndicator={<StepIndicator current={4} />}>
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[300px] animate-fade-in" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="mb-6">
          <div className="flex gap-1.5 justify-center mb-4">
            <div className="w-3 h-3 rounded-full pulse-dot" style={{ backgroundColor: "var(--color-accent)" }} />
            <div className="w-3 h-3 rounded-full pulse-dot" style={{ backgroundColor: "var(--color-accent)" }} />
            <div className="w-3 h-3 rounded-full pulse-dot" style={{ backgroundColor: "var(--color-accent)" }} />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center transition-colors" style={{ color: "var(--color-heading)" }}>Generating Your Shots</h3>
        <p className="text-sm mb-6 text-center transition-colors" style={{ color: "var(--color-muted)" }}>Scene {currentScene} of {totalScenes}: {sceneName}</p>
        <div className="w-full">
          <div className="h-2 rounded-full overflow-hidden transition-colors" style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-hover)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: "var(--color-accent)" }} />
          </div>
          <p className="text-xs mt-3 text-center transition-colors" style={{ color: "var(--color-muted)" }}>This may take a minute per scene...</p>
        </div>
      </div>
    </AppShell>
  );
}
