import { useState } from "react";
import type { GeneratedScene } from "../types";
import ImageLightbox from "./ImageLightbox";

interface ResultsGalleryProps {
  results: GeneratedScene[];
  onGenerateMore: () => void;
  onStartOver: () => void;
}

export default function ResultsGallery({
  results,
  onGenerateMore,
  onStartOver,
}: ResultsGalleryProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const allImages = results.flatMap((r) =>
    r.images.map((url) => ({ url, scene: r.scene_name })),
  );

  async function downloadImage(url: string, filename: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function downloadAll() {
    for (let i = 0; i < allImages.length; i++) {
      const img = allImages[i];
      await downloadImage(
        img.url,
        `shotgen-${img.scene.replace(/\s+/g, "-").toLowerCase()}-${i + 1}.png`,
      );
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Product Shots
        </h2>
        <p className="text-neutral-400">
          {allImages.length} image{allImages.length !== 1 ? "s" : ""} generated
        </p>
        <p className="text-yellow-500/70 text-xs mt-1">
          Images expire in ~24 hours — download them now
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {allImages.map((img, i) => (
          <div
            key={i}
            className="group relative rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] cursor-pointer animate-scale-up"
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={() => setLightboxSrc(img.url)}
          >
            <img
              src={img.url}
              alt={img.scene}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
              <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-lg">
                {img.scene}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(
                    img.url,
                    `shotgen-${img.scene.replace(/\s+/g, "-").toLowerCase()}-${i + 1}.png`,
                  );
                }}
                className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={downloadAll}
          className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
        >
          Download All
        </button>
        <button
          onClick={onGenerateMore}
          className="px-6 py-2.5 rounded-xl border border-[#2a2a2a] text-neutral-300 hover:bg-[#1a1a1a] transition-colors text-sm"
        >
          Generate More
        </button>
        <button
          onClick={onStartOver}
          className="px-6 py-2.5 rounded-xl border border-[#2a2a2a] text-neutral-300 hover:bg-[#1a1a1a] transition-colors text-sm"
        >
          New Product
        </button>
      </div>

      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt="Generated product shot"
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}
