import { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";
import { FileText } from "lucide-react";

interface Props {
  blob: Blob;
  fileName: string;
}

export function DocxPreview({ blob, fileName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blob || !containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = "";

    renderAsync(blob, containerRef.current, undefined, {
      className: "docx-preview-wrapper",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: true,
      experimental: false,
    }).catch((err) => console.error("DOCX render failed:", err));
  }, [blob]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-surface shadow-soft overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-muted">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid place-items-center w-7 h-7 rounded-lg bg-gradient-primary shrink-0">
            <FileText className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium truncate">
            {fileName.replace(/\.js$/i, "")}.docx
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Preview
        </span>
      </div>

      {/* Document render area */}
      <div
        ref={containerRef}
        className="docx-preview-container flex-1 overflow-auto bg-[#e8e8e8]"
      />
    </div>
  );
}
