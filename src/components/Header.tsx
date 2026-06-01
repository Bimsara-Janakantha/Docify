import { FileCode2, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-primary shadow-elegant">
          <FileCode2 className="w-5 h-5 text-primary-foreground" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Doc<span className="text-gradient-primary">ify</span>
          </h1>
          <p className="text-xs text-muted-foreground -mt-0.5">
            JavaScript → Word, instantly
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border bg-surface">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        100% in your browser
      </div>
    </header>
  );
}
