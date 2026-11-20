import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

export interface AppInfo {
  name: string;
  version: string;
  platform: string;
  runtime: "tauri" | "browser";
}

export interface StarterItem {
  id: string;
  title: string;
  subtitle: string;
  status: "active" | "ready" | "archived";
  progress: number;
  updatedAt: string;
}

export type NativeMenuEvent =
  | "menu:navigate-home"
  | "menu:navigate-workspace"
  | "menu:navigate-activity"
  | "menu:toggle-sidebar"
  | "menu:toggle-inspector"
  | "menu:open-palette"
  | "menu:open-settings"
  | "menu:open-about";

const BROWSER_FALLBACK_ITEMS: StarterItem[] = [
  {
    id: "item-1",
    title: "Shell Architecture",
    subtitle: "Canvas-embedded sidebar + floating inset panel",
    status: "active",
    progress: 72,
    updatedAt: "Just now",
  },
  {
    id: "item-2",
    title: "Motion & Transitions",
    subtitle: "View Transitions, motion/mini nudge, and top-layer dialogs",
    status: "ready",
    progress: 100,
    updatedAt: "5m ago",
  },
  {
    id: "item-3",
    title: "Tauri IPC & TanStack",
    subtitle: "Typed invoke bridge backed by TanStack Query cache",
    status: "ready",
    progress: 45,
    updatedAt: "18m ago",
  },
];

export function isTauriRuntime(): boolean {
  return (
    typeof window !== "undefined" &&
    "__TAURI_INTERNALS__" in window &&
    Boolean((window as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__)
  );
}

/**
 * Typed bridge between the React/TanStack frontend and the Rust Tauri backend.
 * Falls back gracefully in browser-only `vite dev` so UI iteration never blocks
 * on native compilation.
 */
export const tauriBridge = {
  async getAppInfo(): Promise<AppInfo> {
    if (!isTauriRuntime()) {
      return {
        name: "Tauri Canvas Shell",
        version: "0.1.0",
        platform: navigator.platform || "web",
        runtime: "browser",
      };
    }
    return invoke<AppInfo>("get_app_info");
  },

  async listStarterItems(): Promise<StarterItem[]> {
    if (!isTauriRuntime()) {
      return BROWSER_FALLBACK_ITEMS;
    }
    return invoke<StarterItem[]>("list_starter_items");
  },

  async setNativeTheme(theme: "system" | "dark" | "light"): Promise<void> {
    if (!isTauriRuntime()) return;
    try {
      await invoke("set_native_theme", { theme });
    } catch {
      // Best effort: CSS theme remains authoritative even if native sync fails.
    }
  },

  subscribeMenuEvent(
    eventName: NativeMenuEvent,
    handler: () => void,
  ): () => void {
    if (!isTauriRuntime()) return () => {};
    let disposed = false;
    let unlisten: UnlistenFn | undefined;

    void listen(
      eventName,
      () => {
        if (!disposed) handler();
      },
      { target: { kind: "AnyLabel", label: "main" } },
    ).then((fn) => {
      if (disposed) fn();
      else unlisten = fn;
    });

    return () => {
      disposed = true;
      unlisten?.();
    };
  },
};
