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
    if (!allowed.includes(file.type)) return "Please upload a PNG, JPG, or WEBP image.";
    if (file.size > 10 * 1024 * 1024) return "File too large. Max 10MB.";
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="animate-fade-in flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 text-center">
        Turn any product photo into
        <br />
        <span className="text-blue-500">stunning lifestyle shots</span> in
        seconds
      </h2>
      <p className="text-neutral-400 mb-8 text-center max-w-lg">
        Upload your product image and let AI generate professional e-commerce
        photography in multiple scenes.
      </p>

      {!preview ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a] hover:bg-[#1e1e1e]"
          }`}
        >
          <div className="text-4xl mb-4">📸</div>
          <p className="text-neutral-300 font-medium mb-1">
            Drag & drop your product photo here
          </p>
          <p className="text-neutral-500 text-sm">
            or click to browse — PNG, JPG, WEBP up to 10MB
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
          <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a]">
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-72 object-contain"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-[#2a2a2a] text-neutral-300 hover:bg-[#1a1a1a] transition-colors text-sm"
            >
              Change Image
            </button>
            <button
              onClick={() => selectedFile && onFileSelected(selectedFile)}
              className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
