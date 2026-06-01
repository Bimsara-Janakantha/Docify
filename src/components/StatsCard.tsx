import { FileText, Hash, AlignLeft, HardDrive } from "lucide-react";
import { formatBytes, type FileStats } from "@/lib/docify";

export function StatsCard({ stats }: { stats: FileStats }) {
  const items = [
    { icon: FileText, label: "File", value: stats.name, mono: true },
    { icon: HardDrive, label: "Size", value: formatBytes(stats.size) },
    { icon: AlignLeft, label: "Lines", value: stats.lines.toLocaleString() },
    { icon: Hash, label: "Characters", value: stats.characters.toLocaleString() },
  ];
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        File details
      </h3>
      <dl className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, value, mono }) => (
          <div key={label} className="rounded-xl bg-surface-muted px-3 py-2.5">
            <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </dt>
            <dd
              className={`mt-1 text-sm font-medium truncate ${mono ? "font-mono" : ""}`}
              title={String(value)}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
