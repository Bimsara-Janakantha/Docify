import { useState, useCallback, useEffect } from "react";
import { Download, Loader2, RotateCcw, Play } from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { DocxPreview } from "@/components/DocxPreview";
import { downloadDocxBlob } from "@/lib/docify";
import { executeJsInSandbox } from "@/lib/sandbox";

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [outputName, setOutputName] = useState("");
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File, text: string) => {
    const defaultName = file.name.replace(/\.js$/i, "");
    setUploadedFile({ name: file.name, content: text });
    setOutputName(defaultName);
    setDocxBlob(null);
    setError(null);
  }, []);

  const handleReset = () => {
    setUploadedFile(null);
    setOutputName("");
    setDocxBlob(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) return;
    setIsConverting(true);
    setError(null);
    setDocxBlob(null);

    try {
      const blob = await executeJsInSandbox(uploadedFile.content);
      setDocxBlob(blob);
    } catch (err: any) {
      console.error("Execution failed:", err);
      setError(err.message || "Failed to execute script.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!docxBlob) return;
    const finalName = outputName.trim() || "Generated_Document";
    downloadDocxBlob(docxBlob, finalName + ".docx");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1">
        {/* Hero */}
        <section className="flex flex-col justify-center text-center lg:justify-start lg:text-left mt-8 lg:mt-12 mb-8 lg:mb-10 max-w-2xl">
          <img
            src="/logo.png"
            alt="Docify logo"
            className="h-20 lg:h-25 rounded-xl object-contain mb-6"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Execute JavaScript into{" "}
            <span className="text-gradient-primary">professional</span> Word docs
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Drop a <span className="font-mono text-foreground">.js</span> file that generates a DOCX, 
            execute it locally in your browser sandbox, and preview the resulting document instantly.
          </p>
        </section>

        {!uploadedFile ? (
          /* ── Before upload ── */
          <div className="max-w-xl mx-auto lg:mx-0">
            <FileDropzone onFile={handleFile} />
          </div>
        ) : (
          /* ── After upload ── */
          <div className="space-y-5">
            {/* Action bar */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 p-4 rounded-2xl border border-border bg-surface shadow-soft">
              <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 flex-1">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Output Name:</span>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    value={outputName}
                    onChange={(e) => setOutputName(e.target.value)}
                    placeholder="Enter document name"
                    className="w-full bg-surface-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="absolute right-3 top-2 text-sm text-muted-foreground pointer-events-none">
                    .docx
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap w-full sm:w-auto items-center gap-2 justify-end">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New File
                </button>

                {!docxBlob && (
                  <button
                    onClick={handleGenerate}
                    disabled={isConverting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Executing…
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" fill="currentColor" />
                        Generate DOCX
                      </>
                    )}
                  </button>
                )}

                {docxBlob && (
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition-all hover:opacity-95 active:scale-[0.99]"
                  >
                    <Download className="w-4 h-4" />
                    Download DOCX
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                <strong className="font-semibold">Execution Error:</strong> {error}
              </div>
            )}

            {/* DOCX preview — full width */}
            {(isConverting || docxBlob) && (
              <div className="min-h-[480px] lg:h-[calc(100vh-340px)] lg:min-h-[520px]">
                {isConverting ? (
                  <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-dashed border-border bg-surface gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Executing script in sandbox…</p>
                  </div>
                ) : docxBlob ? (
                  <DocxPreview blob={docxBlob} fileName={(outputName.trim() || "Generated_Document") + ".docx"} />
                ) : null}
              </div>
            )}
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          Built with care · Scripts are securely executed in your browser.
        </footer>
      </div>
    </main>
  );
}
