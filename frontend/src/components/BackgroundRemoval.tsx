import { useEffect, useState } from "react";
import { uploadImage, removeBackground } from "../api/client";

interface BackgroundRemovalProps {
  file: File;
  onComplete: (originalUrl: string, cutoutUrl: string) => void;
  onError: (message: string) => void;
}

export default function BackgroundRemoval({
  file,
  onComplete,
  onError,
}: BackgroundRemovalProps) {
  const [status, setStatus] = useState<string>("Uploading image...");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const localPreview = URL.createObjectURL(file);

  useEffect(() => {
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
        if (!cancelled) {
          onError(err instanceof Error ? err.message : "Processing failed");
        }
      }
    }

    process();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-2">
        Background Removal
      </h2>
      <p className="text-neutral-400 mb-8">{status}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            Original
          </span>
          <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] p-4">
            <img
              src={localPreview}
              alt="Original"
              className="max-h-64 object-contain mx-auto"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            Cutout
          </span>
          <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] p-4 min-h-[280px] flex items-center justify-center">
            {cutoutUrl ? (
              <img
                src={cutoutUrl}
                alt="Cutout"
                className="max-h-64 object-contain mx-auto animate-scale-up"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 pulse-dot" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 pulse-dot" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 pulse-dot" />
                </div>
                <span className="text-neutral-500 text-sm">Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {cutoutUrl && originalUrl && (
        <button
          onClick={() => onComplete(originalUrl, cutoutUrl)}
          className="mt-8 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors animate-fade-in"
        >
          Continue to Scenes
        </button>
      )}
    </div>
  );
}
