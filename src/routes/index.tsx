import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { FileDropzone } from "@/components/FileDropzone";
import { StatsCard } from "@/components/StatsCard";
import { CodePreview } from "@/components/CodePreview";
import { EmptyPreview } from "@/components/EmptyPreview";
import { generateDocx, getFileStats, type FileStats } from "@/lib/docify";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Docify — JavaScript to Word, instantly" },
      {
        name: "description",
        content:
          "Docify converts your JavaScript source files into beautifully formatted Microsoft Word documents — entirely in your browser.",
      },
      { property: "og:title", content: "Docify — JavaScript to Word, instantly" },
      {
        property: "og:description",
        content:
          "Drop a .js file, preview the code, and download a polished .docx document. No server, no upload.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [stats, setStats] = useState<FileStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFile = (file: File, text: string) => {
    setFileName(file.name);
    setContent(text);
    setStats(getFileStats(file.name, text));
  };

  const handleReset = () => {
    setFileName(null);
    setContent("");
    setStats(null);
  };

  const handleDownload = async () => {
    if (!fileName) return;
    setIsGenerating(true);
    try {
      await generateDocx(fileName, content);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <Header />

        <section className="mt-8 lg:mt-12 mb-8 lg:mb-10 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Convert JavaScript into{" "}
            <span className="text-gradient-primary">professional</span> Word docs
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Drop a <span className="font-mono text-foreground">.js</span> file, preview the
            source, and download a clean <span className="font-mono text-foreground">.docx</span>
            {" "}— all locally in your browser.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-6 lg:gap-8">
          {/* Left panel */}
          <div className="space-y-4">
            <FileDropzone onFile={handleFile} />

            {stats && <StatsCard stats={stats} />}

            {fileName && (
              <div className="space-y-2">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download DOCX
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Upload another file
                </button>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="min-h-[420px] lg:h-[calc(100vh-280px)] lg:min-h-[520px]">
            {fileName ? (
              <CodePreview fileName={fileName} code={content} />
            ) : (
              <EmptyPreview />
            )}
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          Built with care · Your files never leave your device.
        </footer>
      </div>
    </main>
  );
}
