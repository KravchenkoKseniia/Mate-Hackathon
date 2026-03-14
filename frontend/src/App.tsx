import { useState } from "react";
import type { AppStep, GeneratedScene } from "./types";
import { generateShots } from "./api/client";
import Layout from "./components/Layout";
import ProgressBar from "./components/ProgressBar";
import UploadZone from "./components/UploadZone";
import BackgroundRemoval from "./components/BackgroundRemoval";
import SceneSelector from "./components/SceneSelector";
import GenerationProgress from "./components/GenerationProgress";
import ResultsGallery from "./components/ResultsGallery";

export default function App() {
  const [step, setStep] = useState<AppStep>(0);
  const [file, setFile] = useState<File | null>(null);
  const [, setOriginalUrl] = useState<string>("");
  const [cutoutUrl, setCutoutUrl] = useState<string>("");
  const [results, setResults] = useState<GeneratedScene[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genProgress, setGenProgress] = useState({
    current: 0,
    total: 0,
    name: "",
  });

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

  function handleStartOver() {
    setStep(0);
    setFile(null);
    setOriginalUrl("");
    setCutoutUrl("");
    setResults([]);
    setError(null);
  }

  return (
    <Layout>
      <ProgressBar currentStep={step} />

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center animate-fade-in">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {step === 0 && <UploadZone onFileSelected={handleFileSelected} />}

      {step === 1 && file && (
        <BackgroundRemoval
          file={file}
          onComplete={handleBgRemoved}
          onError={(msg) => {
            setError(msg);
            setStep(0);
          }}
        />
      )}

      {step === 2 && (
        <SceneSelector cutoutUrl={cutoutUrl} onGenerate={handleGenerate} />
      )}

      {step === 3 && (
        <GenerationProgress
          currentScene={genProgress.current}
          totalScenes={genProgress.total}
          sceneName={genProgress.name}
        />
      )}

      {step === 4 && (
        <ResultsGallery
          results={results}
          onGenerateMore={() => setStep(2)}
          onStartOver={handleStartOver}
        />
      )}
    </Layout>
  );
}
