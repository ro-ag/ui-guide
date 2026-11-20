import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function parsePrefixTokens(prefix: "light" | "dark"): Record<string, string> {
  const source = readFileSync(
    resolve(import.meta.dirname, `themes/${prefix}.css`),
    "utf8",
  );
  const tokens: Record<string, string> = {};
  const pattern = new RegExp(`--${prefix}-([\\w-]+):\\s*([^;]+);`, "g");
  for (const match of source.matchAll(pattern)) {
    tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

const light = parsePrefixTokens("light");
const dark = parsePrefixTokens("dark");

function hexColor(tokens: Record<string, string>, name: string): string {
  const value = tokens[name];
  if (!value) throw new Error(`missing token ${name}`);
  const match = value.match(/#[0-9a-f]{6}\b/i);
  if (!match) throw new Error(`token ${name} (${value}) is not a 6-digit hex color`);
  return match[0];
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const [high, low] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

const textTokens = [
  "text",
  "text-soft",
  "muted",
  "faint",
  "accent-text",
  "placeholder",
] as const;

const surfaceTokens = [
  "surface",
  "surface-raised",
  "surface-soft",
  "canvas-bg",
  "dialog-bg",
] as const;

const buttonStopTokens = [
  "button-stop-1",
  "button-stop-2",
  "button-hover-1",
  "button-hover-2",
] as const;

describe("design token WCAG contrast contracts", () => {
  it("computes canonical WCAG reference ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  for (const [mode, palette] of [
    ["dark", dark],
    ["light", light],
  ] as const) {
    for (const text of textTokens) {
      for (const surface of surfaceTokens) {
        it(`${mode}: --${mode}-${text} on --${mode}-${surface} >= 4.5:1 (WCAG AA)`, () => {
          expect(
            contrastRatio(hexColor(palette, text), hexColor(palette, surface)),
          ).toBeGreaterThanOrEqual(4.5);
        });
      }
    }

    for (const stop of buttonStopTokens) {
      it(`${mode}: button ink on --${mode}-${stop} >= 4.5:1`, () => {
        expect(
          contrastRatio(hexColor(palette, "ink"), hexColor(palette, stop)),
        ).toBeGreaterThanOrEqual(4.5);
      });
    }

    it(`${mode}: scrollbar thumb against canvas >= 3.0:1 (WCAG 1.4.11)`, () => {
      expect(
        contrastRatio(
          hexColor(palette, "scrollbar-thumb"),
          hexColor(palette, "canvas-bg"),
        ),
      ).toBeGreaterThanOrEqual(3.0);
    });
  }
});
