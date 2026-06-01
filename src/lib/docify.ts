import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageNumber,
  Footer,
  Header,
  BorderStyle,
} from "docx";
import FileSaver from "file-saver";
const { saveAs } = FileSaver;

export interface FileStats {
  name: string;
  size: number;
  lines: number;
  characters: number;
}

export function getFileStats(name: string, content: string): FileStats {
  return {
    name,
    size: new Blob([content]).size,
    lines: content.split(/\r\n|\r|\n/).length,
    characters: content.length,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Generate the .docx Blob without saving — used for preview + download. */
export async function generateDocxBlob(fileName: string, content: string): Promise<Blob> {
  const codeLines = content.split(/\r\n|\r|\n/);

  const codeParagraphs = codeLines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line.length === 0 ? " " : line,
            font: "Consolas",
            size: 20,
          }),
        ],
        spacing: { line: 240 }, // Standard single spacing
      }),
  );

  const doc = new Document({
    creator: "Docify",
    title: fileName,
    description: `Generated from ${fileName}`,
    styles: {
      default: {
        document: { run: { font: "Consolas", size: 20 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch margins
          },
        },
        children: codeParagraphs,
      },
    ],
  });

  return Packer.toBlob(doc);
}

/** Download a previously generated blob as a .docx file. */
export function downloadDocxBlob(blob: Blob, fileName: string): void {
  const outName = fileName.replace(/\.js$/i, "") + ".docx";
  saveAs(blob, outName);
}
