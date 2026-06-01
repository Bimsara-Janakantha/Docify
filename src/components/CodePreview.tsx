import { Highlight, themes } from "prism-react-renderer";
import { FileCode2 } from "lucide-react";

interface Props {
  fileName: string;
  code: string;
}

export function CodePreview({ fileName, code }: Props) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-[#0b1020] shadow-soft overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0e1530]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-2 ml-3 min-w-0">
            <FileCode2 className="w-4 h-4 text-white/60 shrink-0" />
            <span className="text-sm font-mono text-white/80 truncate">{fileName}</span>
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-white/40">JavaScript</span>
      </div>

      <div className="flex-1 overflow-auto">
        <Highlight code={code} language="javascript" theme={themes.vsDark}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} text-[13px] leading-6 font-mono p-0 m-0`}
              style={{ ...style, background: "transparent" }}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={i}
                    {...lineProps}
                    className={`flex ${lineProps.className ?? ""}`}
                  >
                    <span className="select-none text-right pr-4 pl-4 w-14 shrink-0 text-white/30 border-r border-white/5">
                      {i + 1}
                    </span>
                    <span className="pl-4 pr-6 whitespace-pre">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
