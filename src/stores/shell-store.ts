import { createStore } from "@tanstack/react-store";
import type { AccentPreset } from "../config/shell-config";
import {
  DEFAULT_SIDEBAR_WIDTH,
  SIDEBAR_HIDDEN_KEY,
  SIDEBAR_WIDTH_KEY,
  clampSidebarWidth,
  readStoredSidebarWidth,
  safeStorageGet,
  safeStorageSet,
} from "../lib/layout";
import {
  type ReducedMotionPreference,
  applyReducedMotionPreference,
  readStoredReducedMotion,
} from "../lib/motion";
import {
  type DensityPreference,
  type ResolvedTheme,
  type ThemePreference,
  applyAccentPreset,
  applyDensityPreference,
  applyThemePreference,
  nextQuickTogglePreference,
  readStoredAccentPreset,
  readStoredDensityPreference,
  readStoredThemePreference,
  readSystemTheme,
  resolveTheme,
} from "../lib/theme";

export type ToastTone = "info" | "success" | "warning";

export interface ToastNotice {
  id: string;
  title: string;
  detail?: string;
  tone: ToastTone;
}

export interface ShellState {
  sidebarWidth: number;
  sidebarHidden: boolean;
  sidebarResizing: boolean;
  selectedItemId: string;
  bottomDockOpen: boolean;
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  accent: AccentPreset;
  density: DensityPreference;
  reducedMotion: ReducedMotionPreference;
  settingsOpen: boolean;
  paletteOpen: boolean;
  inspectorOpen: boolean;
  aboutOpen: boolean;
  toasts: ToastNotice[];
}

function initialShellState(): ShellState {
  const viewportWidth =
    typeof window === "undefined" ? 1440 : window.innerWidth;
  const themePreference = readStoredThemePreference();
  const systemTheme = readSystemTheme();

  return {
    sidebarWidth: readStoredSidebarWidth(
      safeStorageGet(SIDEBAR_WIDTH_KEY),
      viewportWidth,
    ),
    sidebarHidden: safeStorageGet(SIDEBAR_HIDDEN_KEY) === "true",
    sidebarResizing: false,
    selectedItemId: "item-1",
    bottomDockOpen: false,
    themePreference,
    resolvedTheme: resolveTheme(themePreference, systemTheme),
    accent: readStoredAccentPreset(),
    density: readStoredDensityPreference(),
    reducedMotion: readStoredReducedMotion(),
    settingsOpen: false,
    paletteOpen: false,
    inspectorOpen: false,
    aboutOpen: false,
    toasts: [],
  };
}

let toastCounter = 0;

export const shellStore = createStore(
  initialShellState(),
  ({ setState, get }) => ({
    setSidebarWidth(width: number, persist = true) {
      const viewportWidth =
        typeof window === "undefined" ? 1440 : window.innerWidth;
      const clamped = clampSidebarWidth(width, viewportWidth);
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          "--sidebar-width",
          `${clamped}px`,
        );
      }
      if (persist) {
        safeStorageSet(SIDEBAR_WIDTH_KEY, String(clamped));
      }
      setState((prev) =>
        prev.sidebarWidth === clamped
          ? prev
          : { ...prev, sidebarWidth: clamped },
      );
    },

    resetSidebarWidth() {
      const viewportWidth =
        typeof window === "undefined" ? 1440 : window.innerWidth;
      const width = clampSidebarWidth(DEFAULT_SIDEBAR_WIDTH, viewportWidth);
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          "--sidebar-width",
          `${width}px`,
        );
      }
      safeStorageSet(SIDEBAR_WIDTH_KEY, String(width));
      setState((prev) => ({
        ...prev,
        sidebarWidth: width,
        sidebarHidden: false,
      }));
      safeStorageSet(SIDEBAR_HIDDEN_KEY, "false");
    },

    setSidebarHidden(hidden: boolean) {
      if (typeof document !== "undefined") {
        document.documentElement.dataset.sidebarHidden = String(hidden);
      }
      safeStorageSet(SIDEBAR_HIDDEN_KEY, String(hidden));
      setState((prev) => ({ ...prev, sidebarHidden: hidden }));
    },

    toggleSidebar() {
      const next = !get().sidebarHidden;
      if (typeof document !== "undefined") {
        document.documentElement.dataset.sidebarHidden = String(next);
      }
      safeStorageSet(SIDEBAR_HIDDEN_KEY, String(next));
      setState((prev) => ({ ...prev, sidebarHidden: next }));
    },

    setSidebarResizing(resizing: boolean) {
      setState((prev) =>
        prev.sidebarResizing === resizing
          ? prev
          : { ...prev, sidebarResizing: resizing },
      );
    },

    selectItem(itemId: string) {
      setState((prev) => ({ ...prev, selectedItemId: itemId }));
    },

    toggleBottomDock() {
      setState((prev) => ({ ...prev, bottomDockOpen: !prev.bottomDockOpen }));
    },

    setThemePreference(preference: ThemePreference) {
      const resolved = applyThemePreference(preference);
      setState((prev) => ({
        ...prev,
        themePreference: preference,
        resolvedTheme: resolved,
      }));
    },

    quickToggleTheme() {
      const current = get().themePreference;
      const next = nextQuickTogglePreference(current, readSystemTheme());
      const resolved = applyThemePreference(next);
      setState((prev) => ({
        ...prev,
        themePreference: next,
        resolvedTheme: resolved,
      }));
    },

    syncSystemTheme() {
      const preference = get().themePreference;
      if (preference !== "system") return;
      const resolved = applyThemePreference("system");
      setState((prev) =>
        prev.resolvedTheme === resolved
          ? prev
          : { ...prev, resolvedTheme: resolved },
      );
    },

    setDensity(density: DensityPreference) {
      applyDensityPreference(density);
      setState((prev) => ({ ...prev, density }));
    },

    setAccent(accent: AccentPreset) {
      applyAccentPreset(accent);
      setState((prev) => ({ ...prev, accent }));
    },

    setReducedMotion(reducedMotion: ReducedMotionPreference) {
      applyReducedMotionPreference(reducedMotion);
      setState((prev) => ({ ...prev, reducedMotion }));
    },

    setSettingsOpen(open: boolean) {
      setState((prev) => ({ ...prev, settingsOpen: open }));
    },

    setPaletteOpen(open: boolean) {
      setState((prev) => ({ ...prev, paletteOpen: open }));
    },

    setInspectorOpen(open: boolean) {
      setState((prev) => ({ ...prev, inspectorOpen: open }));
    },

    setAboutOpen(open: boolean) {
      setState((prev) => ({ ...prev, aboutOpen: open }));
    },

    pushToast(title: string, detail?: string, tone: ToastTone = "info") {
      const id = `toast-${++toastCounter}`;
      setState((prev) => ({
        ...prev,
        toasts: [...prev.toasts.slice(-3), { id, title, detail, tone }],
      }));
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          setState((prev) => ({
            ...prev,
            toasts: prev.toasts.filter((toast) => toast.id !== id),
          }));
        }, 4200);
      }
    },

    dismissToast(id: string) {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.filter((toast) => toast.id !== id),
      }));
    },
  }),
);
