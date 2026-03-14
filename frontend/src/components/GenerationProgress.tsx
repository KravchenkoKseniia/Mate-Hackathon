interface GenerationProgressProps {
  currentScene: number;
  totalScenes: number;
  sceneName: string;
}

export default function GenerationProgress({
  currentScene,
  totalScenes,
  sceneName,
}: GenerationProgressProps) {
  const progress = ((currentScene - 1) / totalScenes) * 100;

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
      <div className="mb-8">
        <div className="flex gap-1.5 justify-center mb-4">
          <div className="w-3 h-3 rounded-full bg-blue-500 pulse-dot" />
          <div className="w-3 h-3 rounded-full bg-blue-500 pulse-dot" />
          <div className="w-3 h-3 rounded-full bg-blue-500 pulse-dot" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Generating Your Shots
      </h2>
      <p className="text-neutral-400 mb-6">
        Scene {currentScene} of {totalScenes}: {sceneName}
      </p>

      <div className="w-full max-w-sm">
        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-neutral-500 text-xs mt-2 text-center">
          This may take a minute per scene...
        </p>
      </div>
    </div>
  );
}
