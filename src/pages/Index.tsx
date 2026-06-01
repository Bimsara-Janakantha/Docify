import { useState, useCallback, useEffect } from "react";
import { Download, Loader2, RotateCcw, Play, AlertTriangle } from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { DocxPreview } from "@/components/DocxPreview";
import { downloadDocxBlob } from "@/lib/docify";
import { executeJsInSandbox } from "@/lib/sandbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [outputName, setOutputName] = useState("");
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [hasAgreed, setHasAgreed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("docify_agreed") === "true";
    }
    return false;
  });

  const handleAgree = () => {
    localStorage.setItem("docify_agreed", "true");
    setHasAgreed(true);
  };

  const handleDecline = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "about:blank";
    }
  };

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
        {/* Warning Banner */}
        <div className="mt-4 flex items-start sm:items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-0" />
          <p className="text-amber-800 dark:text-amber-200">
            <strong className="font-semibold">Disclaimer:</strong> We are not responsible for any issues with the uploaded JS file. We are just rendering it in a local sandbox. Please only execute code you trust.
          </p>
        </div>

        {/* Hero */}
        <section className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left mt-8 lg:mt-12 mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0">
          <img
            src="/logo.png"
            alt="Docify logo"
            className="h-20 lg:h-25 rounded-xl object-contain mb-6 mx-auto lg:mx-0"
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
          <div className="w-full max-w-5xl mx-auto">
            <div className="max-w-xl mx-auto">
              <FileDropzone onFile={handleFile} />
            </div>
            
            {/* Features Section */}
            <div className="mt-16 grid gap-8 sm:grid-cols-3 text-center px-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-xl bg-primary/10 p-4">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Execute Locally</h3>
                <p className="text-sm text-muted-foreground">Your JavaScript runs entirely in the browser. No server-side processing, no data leaves your device.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-xl bg-primary/10 p-4">
                  <Loader2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Instant Preview</h3>
                <p className="text-sm text-muted-foreground">See your generated DOCX file instantly with our built-in high-fidelity document previewer.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-xl bg-primary/10 p-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Export Ready</h3>
                <p className="text-sm text-muted-foreground">Download your watermark-free, professionally formatted Word document with a single click.</p>
              </div>
            </div>
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
                  <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-dashed border-border bg-surface gap-3 p-8">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    <p className="text-base text-foreground font-medium">Executing script in sandbox…</p>
                    <p className="text-sm text-muted-foreground mb-4">Generating your document</p>
                    <div className="w-full max-w-md h-2 bg-secondary rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-1/2 animate-progress" />
                    </div>
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

      <AlertDialog open={!hasAgreed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Terms of Use & Disclaimer
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-sm pt-2">
              <p>Welcome to Docify!</p>
              <p>By using this application, you acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You are about to execute JavaScript code in your local browser sandbox.</li>
                <li>We are not responsible for any issues, data loss, or damages caused by the uploaded scripts.</li>
                <li>You should <strong className="font-semibold text-foreground">never</strong> execute code from untrusted sources.</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:space-x-4">
            <AlertDialogCancel onClick={handleDecline} className="w-full sm:w-auto">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAgree} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              I Understand and Agree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
