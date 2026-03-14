import { useState } from "react";
import type { AppStep, GeneratedScene } from "./types";
import { generateShots } from "./api/client";
import LandingPage from "./components/LandingPage";
import BackgroundRemoval from "./components/BackgroundRemoval";
import SceneSelector from "./components/SceneSelector";
import GenerationProgress from "./components/GenerationProgress";
import ResultsGallery from "./components/ResultsGallery";

// Steps: 0=upload, 1=bg-removal, 2=style+generate, 3=generating, 4=results
export default function App() {
  const [step, setStep] = useState<AppStep>(0);
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [cutoutUrl, setCutoutUrl] = useState("");
  const [results, setResults] = useState<GeneratedScene[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genProgress, setGenProgress] = useState({ current: 0, total: 0, name: "" });

  function handleFileSelected(f: File) {
    setFile(f);
    setError(null);
    setStep(1);
  }

  function handleBgRemoved(origUrl: string, cutUrl: string) {
    setOriginalUrl(origUrl);
    setCutoutUrl(cutUrl);
    setStep(2);
  }

  async function handleGenerate(scenes: string[]) {
    setStep(3);
    setGenProgress({ current: 1, total: scenes.length, name: scenes[0] });
    try {
      const res = await generateShots(cutoutUrl, scenes);
      setResults(res);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStep(2);
    }
  }

  function handleBack() {
    if (step === 1) { setStep(0); setFile(null); }
    else if (step === 2) setStep(1);
    else if (step === 4) setStep(2);
  }

  function handleStartOver() {
    setStep(0);
    setFile(null);
    setOriginalUrl("");
    setCutoutUrl("");
    setResults([]);
    setError(null);
  }

  if (step === 0) return <LandingPage onFileSelected={handleFileSelected} error={error} onDismissError={() => setError(null)} />;

  if (step === 1 && file) {
    return (
      <BackgroundRemoval
        file={file}
        existingOriginalUrl={originalUrl || undefined}
        existingCutoutUrl={cutoutUrl || undefined}
        onComplete={handleBgRemoved}
        onBack={handleBack}
        onError={(msg) => { setError(msg); setStep(0); }}
      />
    );
  }

  if (step === 2) return <SceneSelector cutoutUrl={cutoutUrl} onGenerate={handleGenerate} onBack={handleBack} />;
  if (step === 3) return <GenerationProgress currentScene={genProgress.current} totalScenes={genProgress.total} sceneName={genProgress.name} />;
  if (step === 4) return <ResultsGallery results={results} onGenerateMore={() => setStep(2)} onStartOver={handleStartOver} />;

  return <LandingPage onFileSelected={handleFileSelected} />;
}
