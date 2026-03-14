import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

export default function UploadZone({ onFileSelected }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validate(file: File): string | null {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type))
      return "Please upload a PNG, JPG, or WEBP image.";
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
  function onDrop(e: DragEvent) {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="animate-fade-in flex flex-col items-center">
      <h2
        className="text-3xl sm:text-4xl font-bold mb-3 text-center leading-tight"
        style={{ color: "var(--color-heading)" }}
      >
        Turn any product photo into
        <br />
        <span style={{ color: "var(--color-accent)" }}>stunning lifestyle shots</span>
      </h2>
      <p className="mb-10 text-center max-w-md" style={{ color: "var(--color-muted)" }}>
        Upload your product image and let AI generate professional e-commerce
        photography in multiple scenes.
      </p>

      {!preview ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-xl border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-all duration-200"
          style={{
            borderColor: isDragging ? "var(--color-accent)" : "var(--color-border-hover)",
            backgroundColor: isDragging ? "var(--color-accent-soft)" : "var(--color-surface)",
          }}
          onMouseEnter={(e) => {
            if (!isDragging) e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            if (!isDragging) e.currentTarget.style.borderColor = "var(--color-border-hover)";
          }}
        >
          <div className="text-5xl mb-5 opacity-50">&#128247;</div>
          <p className="font-medium mb-1" style={{ color: "var(--color-heading)" }}>
            Drag & drop your product photo here
          </p>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            or click to browse &mdash; PNG, JPG, WEBP up to 10MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-scale-up">
          <div
            className="rounded-lg overflow-hidden p-3"
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
            }}
          >
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-72 object-contain rounded"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setPreview(null); setSelectedFile(null); }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                border: "2px solid var(--color-secondary)",
                color: "var(--color-accent-text)",
                backgroundColor: "transparent",
              }}
            >
              Change Image
            </button>
            <button
              onClick={() => selectedFile && onFileSelected(selectedFile)}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: "var(--color-accent)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
            >
              Continue &rarr;
            </button>
          </div>
        </div>
      )}

      <p
        className="mt-6 text-xs text-center max-w-md"
        style={{ color: "var(--color-faint)" }}
      >
        &#128161; Tip: For best results, use a well-lit photo of your product on a plain, light background.
      </p>

      {error && (
        <p className="mt-4 text-sm" style={{ color: "var(--color-danger-text)" }}>{error}</p>
      )}
    </div>
  );
}
