import { useState, useEffect } from "react";
import { fetchScenes, recommendScenes } from "../api/client";
import type { ScenePreset } from "../types";
import AppShell from "./AppShell";
import StepIndicator from "./StepIndicator";

type Mode = "preset" | "custom";

interface SceneSelectorProps {
  cutoutUrl: string;
  onGenerate: (scenes: string[]) => void;
  onBack: () => void;
}

const NUM_VARIANTS = 3;

export default function SceneSelector({ cutoutUrl, onGenerate, onBack }: SceneSelectorProps) {
  const [scenes, setScenes] = useState<ScenePreset[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(true);
  const [mode, setMode] = useState<Mode>("preset");

  useEffect(() => {
    fetchScenes().then(setScenes).catch(() => {}).finally(() => setLoading(false));
    setAnalyzing(true);
    recommendScenes(cutoutUrl).then((res) => setRecommended(res.recommended_scenes)).catch(() => {}).finally(() => setAnalyzing(false));
  }, [cutoutUrl]);

  const sortedScenes = [...scenes].sort((a, b) => {
    const aRec = recommended.includes(a.id) ? 0 : 1;
    const bRec = recommended.includes(b.id) ? 0 : 1;
    return aRec - bRec;
  });

  function handleGenerate() {
    const sceneValue = mode === "preset" ? selected! : customPrompt.trim();
    onGenerate(Array(NUM_VARIANTS).fill(sceneValue));
  }

  const canGenerate = mode === "preset" ? !!selected : customPrompt.trim().length > 0;

  return (
    <AppShell stepIndicator={<StepIndicator current={3} />}>
      <div className="animate-fade-in" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-xl sm:text-2xl font-semibold text-center mb-8 transition-colors" style={{ color: "var(--color-heading)" }}>
          Step 3: Choose a style &amp; generate
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
          {/* Left: Product cutout */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className="flex items-center justify-center w-full h-[260px] sm:h-[320px] lg:h-[400px] rounded-lg checkerboard-bg transition-colors"
              style={{ border: "1px dashed var(--color-border-hover)", boxShadow: "var(--shadow-card)" }}
            >
              <img src={cutoutUrl} alt="Product cutout" className="max-h-[220px] sm:max-h-[280px] lg:max-h-[360px] max-w-[85%] object-contain" />
            </div>
            {analyzing && (
              <div className="flex items-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 animate-spin" style={{ color: "var(--color-accent)" }} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs transition-colors" style={{ color: "var(--color-muted)" }}>Analyzing product for recommendations...</span>
              </div>
            )}
          </div>

          {/* Right: Mode toggle + content */}
          <div className="flex flex-col items-center gap-6">
            {/* Toggle tabs */}
            <div className="w-full max-w-sm flex rounded-full overflow-hidden p-1 transition-colors" style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}>
              <button
                onClick={() => setMode("preset")}
                className="flex-1 py-2.5 text-sm font-semibold rounded-full transition-all"
                style={{
                  backgroundColor: mode === "preset" ? "var(--color-accent)" : "transparent",
                  color: mode === "preset" ? "#fff" : "var(--color-muted)",
                }}
              >
                Choose a style
              </button>
              <button
                onClick={() => setMode("custom")}
                className="flex-1 py-2.5 text-sm font-semibold rounded-full transition-all"
                style={{
                  backgroundColor: mode === "custom" ? "var(--color-accent)" : "transparent",
                  color: mode === "custom" ? "#fff" : "var(--color-muted)",
                }}
              >
                Write a prompt
              </button>
            </div>

            {/* Preset grid */}
            {mode === "preset" && (
              <div className="w-full rounded-lg p-4 sm:p-5 transition-colors" style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-hover)" }}>
                {loading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {sortedScenes.map((scene) => {
                      const isSelected = selected === scene.id;
                      const isRecommended = recommended.includes(scene.id);
                      return (
                        <button
                          key={scene.id}
                          onClick={() => setSelected(scene.id)}
                          className="relative h-16 sm:h-[68px] rounded-lg flex items-center justify-center text-center transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            backgroundColor: isSelected ? "var(--color-accent-soft)" : isRecommended ? "var(--color-accent-soft)" : "var(--color-surface)",
                            border: isSelected ? "2px solid var(--color-accent)" : isRecommended ? "2px solid var(--color-accent)" : "1px solid var(--color-border-hover)",
                            boxShadow: isSelected ? "0 0 0 2px rgba(30,30,226,0.25)" : isRecommended && !isSelected ? "0 2px 8px rgba(30,30,226,0.12)" : "none",
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs sm:text-sm font-medium transition-colors" style={{ color: "var(--color-heading)" }}>{scene.name}</span>
                            {isRecommended && (
                              <span
                                className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full transition-colors"
                                style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent-text)", border: "1px solid var(--color-accent)" }}
                              >
                                AI Recommended
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Custom prompt */}
            {mode === "custom" && (
              <div className="w-full rounded-lg p-4 sm:p-5 transition-colors" style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-hover)" }}>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder='Describe your scene, e.g. "A rustic farmhouse kitchen with morning sunlight"'
                  rows={7}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none transition-colors"
                  style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border-hover)", color: "var(--color-text)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-hover)")}
                />
                <p className="text-xs mt-2 text-center transition-colors" style={{ color: "var(--color-muted)" }}>Be descriptive for best results.</p>
              </div>
            )}

            <p className="text-xs text-center transition-colors" style={{ color: "var(--color-faint)" }}>
              3 variants will be generated
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center items-center gap-4 mt-10 mb-8">
          <button
            onClick={onBack}
            className="h-11 px-6 sm:px-7 rounded-full flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ color: "var(--color-accent)", border: "1px solid var(--color-border-hover)", backgroundColor: "var(--color-surface)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="h-11 px-8 sm:px-10 rounded-full flex items-center gap-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "var(--color-accent)", opacity: canGenerate ? 1 : 0.4, cursor: canGenerate ? "pointer" : "not-allowed" }}
          >
            Generate creatives
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
