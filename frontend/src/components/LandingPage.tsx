import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import AppShell from "./AppShell";
import StepIndicator from "./StepIndicator";
import NavButtons from "./NavButtons";

interface LandingPageProps {
  onFileSelected: (file: File) => void;
  error?: string | null;
  onDismissError?: () => void;
}

export default function LandingPage({ onFileSelected, error: externalError, onDismissError }: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validate(file: File): string | null {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) return "Please upload a PNG, JPG, or WEBP image.";
    if (file.size > 10 * 1024 * 1024) return "File too large. Max 10MB.";
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function onDragOver(e: DragEvent) { e.preventDefault(); setIsDragging(true); }
  function onDragLeave(e: DragEvent) { e.preventDefault(); setIsDragging(false); }
  function onDrop(e: DragEvent) { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }
  function onChange(e: ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (file) handleFile(file); }

  return (
    <AppShell stepIndicator={<StepIndicator current={1} />}>
      <div className="max-w-xl mx-auto flex flex-col gap-6 animate-fade-in" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-xl sm:text-2xl font-semibold text-center transition-colors" style={{ color: "var(--color-heading)" }}>
          Step 1: Drag &amp; drop the product photo
        </p>

        {!preview ? (
          <div
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center h-[260px] sm:h-[320px] rounded-lg cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              border: isDragging ? "2px dashed var(--color-accent)" : "1px dashed var(--color-border-hover)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex flex-col items-center gap-3.5 text-center">
              <img src="/image-add-icon.svg" alt="" className="w-10 h-10 opacity-70" />
              <p className="text-base font-semibold transition-colors" style={{ color: "var(--color-heading)" }}>Drop product image here</p>
              <p className="text-sm font-medium transition-colors" style={{ color: "var(--color-muted)" }}>or click to browse - PNG, JPG up to 10MB</p>
            </div>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onChange} />
          </div>
        ) : (
          <div
            className="flex items-center justify-center h-[260px] sm:h-[320px] rounded-lg relative animate-scale-up"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border-hover)", boxShadow: "var(--shadow-card)" }}
          >
            <img src={preview} alt="Preview" className="max-h-[220px] sm:max-h-[270px] max-w-[90%] object-contain rounded" />
            <button
              onClick={() => { setPreview(null); setSelectedFile(null); }}
              className="absolute top-3 right-3 px-3 py-1 rounded text-xs font-medium transition-colors"
              style={{ backgroundColor: "var(--color-surface-alt)", color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
            >
              Change
            </button>
          </div>
        )}

        {(error || externalError) && (
          <div className="p-3 rounded-lg text-sm text-center animate-fade-in" style={{ backgroundColor: "var(--color-danger-soft)", border: "1px solid var(--color-danger-border)", color: "var(--color-danger-text)" }}>
            {error || externalError}
            {externalError && onDismissError && <button onClick={onDismissError} className="ml-3 underline hover:no-underline">Dismiss</button>}
          </div>
        )}

        <NavButtons onNext={() => selectedFile && onFileSelected(selectedFile)} nextDisabled={!selectedFile} />
      </div>
    </AppShell>
  );
}
