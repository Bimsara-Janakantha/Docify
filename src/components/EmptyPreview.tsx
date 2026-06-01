import { FileCode2, ArrowLeft } from "lucide-react";

export function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <div className="grid place-items-center w-16 h-16 rounded-2xl bg-accent mb-5">
        <FileCode2 className="w-7 h-7 text-primary" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold">No file loaded yet</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Upload a JavaScript file to see a syntax-highlighted preview and turn it
        into a polished Word document.
      </p>
      <div className="mt-6 hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowLeft className="w-3.5 h-3.5" />
        Start by dropping a <span className="font-mono">.js</span> file on the left
      </div>
    </div>
  );
}
