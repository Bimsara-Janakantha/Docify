import { useCallback, useRef, useState } from "react";
import { Upload, FileWarning } from "lucide-react";

interface Props {
  onFile: (file: File, content: string) => void;
}

export function FileDropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!/\.js$/i.test(file.name)) {
        setError("Only .js files are supported.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large (max 5 MB).");
        return;
      }
      const content = await file.text();
      onFile(file, content);
    },
    [onFile],
  );

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a JavaScript file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 text-center
          ${
            isDragging
              ? "border-primary bg-accent/60 scale-[1.01]"
              : "border-border bg-surface hover:border-primary/50 hover:bg-accent/30"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".js,text/javascript"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
        <div className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-2xl bg-gradient-primary shadow-elegant transition-transform group-hover:scale-105">
          <Upload className="w-6 h-6 text-primary-foreground" strokeWidth={2.25} />
        </div>
        <p className="font-medium text-foreground">
          Drop your <span className="font-mono text-primary">.js</span> file here
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or <span className="text-primary underline-offset-2 hover:underline">browse</span> to upload
        </p>
        <p className="text-xs text-muted-foreground mt-3">Max 5 MB · processed locally</p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <FileWarning className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
