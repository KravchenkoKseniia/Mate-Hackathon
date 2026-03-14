import { useState } from "react";
import type { GeneratedScene } from "../types";
import ImageLightbox from "./ImageLightbox";
import AppShell from "./AppShell";
import StepIndicator from "./StepIndicator";

interface ResultsGalleryProps {
  results: GeneratedScene[];
  onGenerateMore: () => void;
  onStartOver: () => void;
}

const MAX_PHOTOS = 3;

export default function ResultsGallery({ results, onGenerateMore, onStartOver }: ResultsGalleryProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const allImages = results.flatMap((r) => r.images.map((url) => ({ url, scene: r.scene_name }))).slice(0, MAX_PHOTOS);

  async function downloadImage(url: string, filename: string) {
    const res = await fetch(url); const blob = await res.blob();
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
  }

  async function downloadAll() {
    for (let i = 0; i < allImages.length; i++) {
      const img = allImages[i];
      await downloadImage(img.url, `shotgen-${img.scene.replace(/\s+/g, "-").toLowerCase()}-${i + 1}.png`);
    }
  }

  return (
    <AppShell stepIndicator={<StepIndicator current={5} />}>
      <div className="animate-fade-in" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 transition-colors" style={{ color: "var(--color-heading)" }}>Your Product Shots</h3>
          <p className="text-sm transition-colors" style={{ color: "var(--color-muted)" }}>{allImages.length} image{allImages.length !== 1 ? "s" : ""} generated</p>
          <p className="text-xs mt-1 transition-colors" style={{ color: "var(--color-warn-text)" }}>Images expire in ~24 hours &mdash; download them now</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {allImages.map((img, i) => (
            <div
              key={i}
              className="group relative rounded-lg overflow-hidden cursor-pointer animate-scale-up transition-colors"
              style={{ animationDelay: `${i * 80}ms`, backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-hover)" }}
              onClick={() => setLightboxSrc(img.url)}
            >
              <img src={img.url} alt={img.scene} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">{img.scene}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); downloadImage(img.url, `shotgen-${img.scene.replace(/\s+/g, "-").toLowerCase()}-${i + 1}.png`); }}
                  className="text-xs text-white px-3 py-1 rounded-md transition-colors"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onGenerateMore} className="h-10 px-6 rounded-full text-sm font-semibold transition-all hover:scale-[1.02]" style={{ color: "var(--color-accent)", border: "1px solid var(--color-border-hover)", backgroundColor: "var(--color-surface)" }}>Generate More</button>
            <button onClick={downloadAll} className="h-10 px-6 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02]" style={{ backgroundColor: "var(--color-accent)" }}>Download All</button>
            <button onClick={onStartOver} className="h-10 px-6 rounded-full text-sm font-semibold transition-all hover:scale-[1.02]" style={{ color: "var(--color-heading)", border: "2px solid var(--color-secondary)", backgroundColor: "transparent" }}>New Product</button>
          </div>
        </div>
      </div>
      {lightboxSrc && <ImageLightbox src={lightboxSrc} alt="Generated product shot" onClose={() => setLightboxSrc(null)} />}
    </AppShell>
  );
}
