import * as docx from "docx";

export async function executeJsInSandbox(code: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      let resolved = false;

      // Create a mock fs
      const mockFs = {
        writeFileSync: (path: string, data: any) => {
          if (resolved) return;
          resolved = true;
          // data should be the Uint8Array/Buffer returned by Packer.toBuffer
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          resolve(blob);
        },
      };

      // Patch the docx library to avoid 'nodebuffer is not supported' error in browser
      const patchedDocx = { ...docx };
      patchedDocx.Packer = class extends docx.Packer {
        static async toBuffer(doc: any) {
          const blob = await docx.Packer.toBlob(doc);
          return await blob.arrayBuffer();
        }
      };

      // Create a mock require
      const mockRequire = (moduleName: string) => {
        if (moduleName === "docx") return patchedDocx;
        if (moduleName === "fs") return mockFs;
        console.warn(`Module '${moduleName}' requested by sandbox, but it is not mocked.`);
        return {};
      };

      // Ensure console methods still output to the real console so users can debug
      const mockConsole = {
        log: (...args: any[]) => console.log("[Sandbox]", ...args),
        warn: (...args: any[]) => console.warn("[Sandbox]", ...args),
        error: (...args: any[]) => console.error("[Sandbox]", ...args),
      };

      const mockProcess = { exit: () => {} };

      // We wrap the user's code inside an async IIFE to support potential async behavior inside, 
      // although standard new Function is synchronous.
      const sandboxFn = new Function(
        "require",
        "process",
        "console",
        "exports",
        "module",
        code
      );

      // Execute the function
      const mockModule = { exports: {} };
      sandboxFn(mockRequire, mockProcess, mockConsole, mockModule.exports, mockModule);

      // Set a timeout to reject if writeFileSync is never called
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error("Execution timeout: script did not call fs.writeFileSync"));
        }
      }, 10000); // 10 second timeout

    } catch (err) {
      reject(err);
    }
  });
}
