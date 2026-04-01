"use client";

import { useState, useRef, useCallback } from "react";

interface Props {
  /** Mevcut resim URL (düzenleme modunda) */
  currentUrl?: string | null;
  /** Form field adı — bu isimle formData'ya eklenir */
  name: string;
  /** Cloudinary klasörü: 'campaigns' | 'logos' | 'cards' */
  folder?: "campaigns" | "logos" | "cards";
  /** Resim gösterim şekli */
  shape?: "rectangle" | "square" | "card";
  /** Placeholder label */
  label?: string;
}

export default function ImageUpload({
  currentUrl,
  name,
  folder = "campaigns",
  shape = "rectangle",
  label = "Resim Yükle",
}: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || "");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const shapeClass = {
    rectangle: "aspect-video",
    square: "aspect-square w-32",
    card: "w-28 h-[72px]",
  }[shape];

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    // Local preview hemen göster
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Yükleme başarısız");
        setPreview(currentUrl || null);
        return;
      }

      setUploadedUrl(data.url);
      setPreview(data.url);
    } catch {
      setError("Sunucu hatası. Tekrar deneyin.");
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  }, [folder, currentUrl]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* Hidden input storing the final URL */}
      <input type="hidden" name={name} value={uploadedUrl} />

      <div
        className={`relative border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${
          dragOver
            ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
            : preview
            ? "border-slate-200 bg-slate-50"
            : "border-dashed border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
        } ${shapeClass === "aspect-video" ? "w-full aspect-video" : shapeClass}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* Preview image */}
        {preview && (
          <img
            src={preview}
            alt="Önizleme"
            className="w-full h-full object-contain p-2"
          />
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity ${
          preview ? "opacity-0 hover:opacity-100 bg-black/30" : "opacity-100"
        }`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
              <span className="text-white text-xs font-bold">Yükleniyor...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-4 text-center">
              <div className={`text-3xl ${preview ? "opacity-0" : ""}`}>📁</div>
              <p className={`text-sm font-bold ${preview ? "text-white" : "text-slate-600"}`}>
                {preview ? "Değiştir" : label}
              </p>
              {!preview && (
                <p className="text-slate-400 text-[11px]">Tıkla veya sürükle bırak<br />JPG, PNG, WebP, SVG · Max 5MB</p>
              )}
            </div>
          )}
        </div>

        {/* Progress bar while uploading */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div className="h-full bg-indigo-400 animate-pulse w-2/3 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-600 text-xs font-semibold bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          ⚠️ {error}
        </p>
      )}

      {/* URL manual entry fallback */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-200"></div>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">veya URL gir</span>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>
      <input
        type="url"
        placeholder="https://..."
        value={uploadedUrl}
        onChange={(e) => {
          setUploadedUrl(e.target.value);
          setPreview(e.target.value || null);
        }}
        className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
      />

      {/* Clear button */}
      {(preview || uploadedUrl) && (
        <button
          type="button"
          onClick={() => { setPreview(null); setUploadedUrl(""); }}
          className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
        >
          ✕ Resmi Kaldır
        </button>
      )}
    </div>
  );
}
