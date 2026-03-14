import { useEffect, useState } from "react";
import { uploadImage, removeBackground } from "../api/client";
import AppShell from "./AppShell";
import StepIndicator from "./StepIndicator";
import NavButtons from "./NavButtons";

interface BackgroundRemovalProps {
  file: File;
  existingOriginalUrl?: string;
  existingCutoutUrl?: string;
  onComplete: (originalUrl: string, cutoutUrl: string) => void;
  onBack: () => void;
  onError: (message: string) => void;
}

export default function BackgroundRemoval({ file, existingOriginalUrl, existingCutoutUrl, onComplete, onBack, onError }: BackgroundRemovalProps) {
  const [status, setStatus] = useState<string>(existingCutoutUrl ? "Done!" : "Uploading image...");
  const [originalUrl, setOriginalUrl] = useState<string | null>(existingOriginalUrl || null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(existingCutoutUrl || null);
  const [cutoutLoaded, setCutoutLoaded] = useState(false);
  const localPreview = URL.createObjectURL(file);
  const isReady = !!(cutoutUrl && originalUrl && cutoutLoaded);

  useEffect(() => {
    if (existingCutoutUrl && existingOriginalUrl) return;
    let cancelled = false;
    async function process() {
      try {
        setStatus("Uploading image...");
        const uploadedUrl = await uploadImage(file);
        if (cancelled) return;
        setOriginalUrl(uploadedUrl);
        setStatus("Removing background...");
        const cutout = await removeBackground(uploadedUrl);
        if (cancelled) return;
        setCutoutUrl(cutout);
        setStatus("Done!");
      } catch (err) {
        if (!cancelled) onError(err instanceof Error ? err.message : "Processing failed");
      }
    }
    process();
    return () => { cancelled = true; };
  }, []);

  return (
    <AppShell stepIndicator={<StepIndicator current={2} />}>
      <div className="animate-fade-in" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-xl sm:text-2xl font-semibold text-center mb-2 transition-colors" style={{ color: "var(--color-heading)" }}>Step 2: Removing background</p>
        <p className="text-center mb-6 text-sm transition-colors" style={{ color: "var(--color-muted)" }}>{status}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-center transition-colors" style={{ color: "var(--color-faint)" }}>Original</span>
            <div className="flex items-center justify-center h-[220px] sm:h-[280px] lg:h-[320px] rounded-lg transition-colors" style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-hover)" }}>
              <img src={localPreview} alt="Original" className="max-h-[180px] sm:max-h-[240px] lg:max-h-[280px] max-w-[90%] object-contain" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-center transition-colors" style={{ color: "var(--color-faint)" }}>Cutout</span>
            <div className="flex items-center justify-center h-[220px] sm:h-[280px] lg:h-[320px] rounded-lg transition-colors" style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-hover)" }}>
              {cutoutUrl ? (
                <img src={cutoutUrl} alt="Cutout" className="max-h-[180px] sm:max-h-[240px] lg:max-h-[280px] max-w-[90%] object-contain animate-scale-up" onLoad={() => setCutoutLoaded(true)} />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ backgroundColor: "var(--color-accent)" }} />
                    <div className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ backgroundColor: "var(--color-accent)" }} />
                    <div className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ backgroundColor: "var(--color-accent)" }} />
                  </div>
                  <span className="text-sm transition-colors" style={{ color: "var(--color-muted)" }}>Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <NavButtons onBack={onBack} onNext={() => isReady && onComplete(originalUrl!, cutoutUrl!)} nextDisabled={!isReady} nextLabel={isReady ? "Next step" : "Processing..."} loading={!isReady} />
      </div>
    </AppShell>
  );
}
