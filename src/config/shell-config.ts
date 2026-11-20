import { Activity, Compass, Layers, type LucideIcon } from "lucide-react";

export type AccentPreset = "prism" | "aurora" | "hyper" | "solar";

export interface NavItemConfig {
  to: "/" | "/workspace" | "/activity";
  label: string;
  shortcut: string;
  description: string;
  icon: LucideIcon;
}

export interface AccentPresetConfig {
  id: AccentPreset;
  label: string;
  tagline: string;
  /** CSS gradient used to preview each world's swatch in Light & Dark modes. */
  gradientDark: string;
  gradientLight: string;
}

/**
 * Single-file shell customization hub.
 * Edit brand identity, primary navigation routes, or gradient theme worlds here
 * and the Sidebar, Topbar, Settings, and Command Palette update automatically.
 */
export const APP_BRAND = {
  name: "Prism",
  subtitle: "Tauri Studio Shell",
  monogram: "P",
} as const;

export const PRIMARY_NAV: readonly NavItemConfig[] = [
  {
    to: "/",
    label: "Studio",
    shortcut: "⌘1",
    description: "Aurora shell overview, gradient worlds, and spring motion",
    icon: Compass,
  },
  {
    to: "/workspace",
    label: "Canvas",
    shortcut: "⌘2",
    description: "Blank workspace slot with animated bottom utility dock",
    icon: Layers,
  },
  {
    to: "/activity",
    label: "Stream",
    shortcut: "⌘3",
    description: "TanStack Query + Tauri IPC live starter view",
    icon: Activity,
  },
] as const;

export const ACCENT_PRESETS: readonly AccentPresetConfig[] = [
  {
    id: "prism",
    label: "Prism",
    tagline: "Violet · Indigo · Cyan",
    gradientDark: "linear-gradient(135deg, #c084fc, #818cf8 52%, #38bdf8)",
    gradientLight: "linear-gradient(135deg, #6d28d9, #4f46e5 52%, #0369a1)",
  },
  {
    id: "aurora",
    label: "Aurora",
    tagline: "Aqua · Sky · Indigo",
    gradientDark: "linear-gradient(135deg, #5eead4, #38bdf8 52%, #818cf8)",
    gradientLight: "linear-gradient(135deg, #0f766e, #0369a1 52%, #4338ca)",
  },
  {
    id: "hyper",
    label: "Hyper",
    tagline: "Rose · Fuchsia · Violet",
    gradientDark: "linear-gradient(135deg, #f9a8d4, #e879f9 52%, #a78bfa)",
    gradientLight: "linear-gradient(135deg, #be185d, #a21caf 52%, #6d28d9)",
  },
  {
    id: "solar",
    label: "Solar",
    tagline: "Coral · Tangerine · Gold",
    gradientDark: "linear-gradient(135deg, #fda4af, #fb923c 52%, #facc15)",
    gradientLight: "linear-gradient(135deg, #be123c, #c2410c 52%, #b45309)",
  },
] as const;

export function routeTitleForPath(pathname: string): string {
  return PRIMARY_NAV.find((item) => item.to === pathname)?.label ?? "View";
}
