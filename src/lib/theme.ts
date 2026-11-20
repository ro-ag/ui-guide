import type { AccentPreset } from "../config/shell-config";
import { safeStorageGet, safeStorageSet } from "./layout";
import { isReducedMotionDomActive } from "./motion";
import { tauriBridge } from "./tauri-bridge";

export type ThemePreference = "system" | "dark" | "light";
export type ResolvedTheme = "dark" | "light";
export type DensityPreference = "comfortable" | "compact";

export const COLOR_SCHEME_KEY = "shell-color-scheme";
export const DENSITY_KEY = "shell-density";
export const ACCENT_KEY = "shell-accent";

export function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return preference === "system" ? systemTheme : preference;
}

/**
 * Smart 2-state quick toggle rule:
 * 1. Compute target = opposite of the currently *rendered* theme.
 * 2. If target matches the current system theme, clear the override ("system")
 *    so the app resumes tracking future OS theme schedules automatically.
 * 3. Otherwise persist the explicit literal ("light" or "dark").
 */
export function nextQuickTogglePreference(
  currentPreference: ThemePreference,
  systemTheme: ResolvedTheme,
): ThemePreference {
  const rendered = resolveTheme(currentPreference, systemTheme);
  const target: ResolvedTheme = rendered === "dark" ? "light" : "dark";
  return target === systemTheme ? "system" : target;
}

export function readStoredThemePreference(): ThemePreference {
  const stored = safeStorageGet(COLOR_SCHEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "system";
}

export function readStoredDensityPreference(): DensityPreference {
  return safeStorageGet(DENSITY_KEY) === "compact" ? "compact" : "comfortable";
}

/**
 * Wraps theme or gradient-world DOM updates in a View Transition dissolve
 * when supported and motion is allowed.
 */
export function withThemeTransition(apply: () => void): void {
  if (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof document.startViewTransition === "function" &&
    !isReducedMotionDomActive()
  ) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

export function applyThemePreference(
  preference: ThemePreference,
  animate = true,
): ResolvedTheme {
  const systemTheme = readSystemTheme();
  const resolved = resolveTheme(preference, systemTheme);

  const commit = () => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="color-scheme"]',
    );
    if (meta) {
      meta.content = preference === "system" ? "light dark" : preference;
    }

    document.documentElement.dataset.theme = resolved;
    if (preference === "system") {
      document.documentElement.removeAttribute("data-theme-override");
    } else {
      document.documentElement.dataset.themeOverride = preference;
    }
    safeStorageSet(
      COLOR_SCHEME_KEY,
      preference === "system" ? null : preference,
    );
  };

  if (animate) withThemeTransition(commit);
  else commit();

  // Sync native macOS/Windows titlebar & window backing color inside Tauri.
  void tauriBridge.setNativeTheme(preference);
  return resolved;
}

export function applyDensityPreference(density: DensityPreference): void {
  if (density === "compact") {
    document.documentElement.dataset.density = "compact";
    safeStorageSet(DENSITY_KEY, "compact");
  } else {
    document.documentElement.removeAttribute("data-density");
    safeStorageSet(DENSITY_KEY, null);
  }
}

export function readStoredAccentPreset(): AccentPreset {
  const stored = safeStorageGet(ACCENT_KEY);
  if (stored === "aurora" || stored === "hyper" || stored === "solar") {
    return stored;
  }
  return "prism";
}

export function applyAccentPreset(accent: AccentPreset, animate = true): void {
  const commit = () => {
    if (accent === "prism") {
      document.documentElement.removeAttribute("data-accent");
      safeStorageSet(ACCENT_KEY, null);
    } else {
      document.documentElement.dataset.accent = accent;
      safeStorageSet(ACCENT_KEY, accent);
    }
  };

  if (animate) withThemeTransition(commit);
  else commit();
}
