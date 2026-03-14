import { useState, useEffect } from "react";
import { fetchScenes } from "../api/client";
import type { ScenePreset } from "../types";
import { SCENE_ICONS } from "../data/scenes";

interface SceneSelectorProps {
  cutoutUrl: string;
  onGenerate: (scenes: string[]) => void;
}

export default function SceneSelector({
  cutoutUrl,
  onGenerate,
}: SceneSelectorProps) {
  const [scenes, setScenes] = useState<ScenePreset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenes()
      .then(setScenes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function handleGenerate() {
    const scenesToSend = [...selected];
    if (customPrompt.trim()) scenesToSend.push(customPrompt.trim());
    onGenerate(scenesToSend);
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Scenes
        </h2>
        <p className="text-neutral-400">
          Select up to 3 scenes for your product shots
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] p-3">
          <img
            src={cutoutUrl}
            alt="Product"
            className="h-24 object-contain"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {scenes.map((scene) => {
            const isSelected = selected.includes(scene.id);
            return (
              <button
                key={scene.id}
                onClick={() => toggle(scene.id)}
                className={`relative rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                    ✓
                  </div>
                )}
                <div className="text-2xl mb-2">
                  {SCENE_ICONS[scene.id] || "🎨"}
                </div>
                <div className="text-sm font-medium text-white">
                  {scene.name}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-6">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or describe a custom scene..."
          className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
        />
      </div>

      <div className="flex justify-center mt-8">
        <button
          disabled={selected.length === 0 && !customPrompt.trim()}
          onClick={handleGenerate}
          className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          Generate {selected.length + (customPrompt.trim() ? 1 : 0)} Scene
          {selected.length + (customPrompt.trim() ? 1 : 0) !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
