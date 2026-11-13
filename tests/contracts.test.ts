import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = resolve(directory, entry.name);
    return entry.isDirectory() ? sources(name) : /\.tsx$/.test(name) ? [name] : [];
  });
}
describe("portable screen contract", () => {
  for (const filename of [
    ...sources("examples"),
    ...sources("src/components"),
    ...sources("src/patterns"),
    resolve("src/App.tsx"),
  ]) {
    it(`${filename.split("/").slice(-2).join("/")} uses role colors, not a brand palette`, () => {
      const source = readFileSync(filename, "utf8");
      expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(source).not.toMatch(
        /(?:bg|text|border|ring|fill|stroke)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|white|black)(?:-|\b)/,
      );
      expect(source).not.toMatch(/\bdark:/);
    });
  }
});
