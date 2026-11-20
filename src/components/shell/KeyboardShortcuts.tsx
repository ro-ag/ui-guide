import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isReducedMotionDomActive } from "../../lib/motion";
import { tauriBridge } from "../../lib/tauri-bridge";
import { COLOR_SCHEME_KEY, readStoredThemePreference } from "../../lib/theme";
import { shellStore } from "../../stores/shell-store";

/**
 * Binds global desktop keyboard chords (⌘1/2/3, ⌘K, ⌘,, ⌘\, ⌘I), OS color
 * scheme change tracking, cross-window storage sync, and native Tauri menu
 * events into one clean lifecycle effect.
 */
export function KeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const go = (to: "/" | "/workspace" | "/activity") => {
      void navigate({
        to,
        viewTransition: !isReducedMotionDomActive(),
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || event.defaultPrevented) return;
      const mod = event.metaKey || event.ctrlKey;
      if (!mod || event.altKey) return;

      const key = event.key.toLowerCase();

      if (key === "k") {
        event.preventDefault();
        shellStore.actions.setPaletteOpen(!shellStore.state.paletteOpen);
        return;
      }

      if (key === ",") {
        event.preventDefault();
        shellStore.actions.setSettingsOpen(!shellStore.state.settingsOpen);
        return;
      }

      if (key === "\\") {
        event.preventDefault();
        shellStore.actions.toggleSidebar();
        return;
      }

      if (key === "i") {
        event.preventDefault();
        shellStore.actions.setInspectorOpen(!shellStore.state.inspectorOpen);
        return;
      }

      if (key === "1") {
        event.preventDefault();
        go("/");
      } else if (key === "2") {
        event.preventDefault();
        go("/workspace");
      } else if (key === "3") {
        event.preventDefault();
        go("/activity");
      }
    };

    // Keep "system" theme preference reactive whenever the OS switches schemes.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => shellStore.actions.syncSystemTheme();

    // Sync color-scheme changes made in secondary windows or tabs.
    const onStorage = (event: StorageEvent) => {
      if (event.key === COLOR_SCHEME_KEY) {
        shellStore.actions.setThemePreference(readStoredThemePreference());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onSchemeChange);
    window.addEventListener("storage", onStorage);

    // Subscribe to native Rust menu commands when running inside Tauri.
    const unsubs = [
      tauriBridge.subscribeMenuEvent("menu:navigate-home", () => go("/")),
      tauriBridge.subscribeMenuEvent("menu:navigate-workspace", () =>
        go("/workspace"),
      ),
      tauriBridge.subscribeMenuEvent("menu:navigate-activity", () =>
        go("/activity"),
      ),
      tauriBridge.subscribeMenuEvent("menu:toggle-sidebar", () =>
        shellStore.actions.toggleSidebar(),
      ),
      tauriBridge.subscribeMenuEvent("menu:toggle-inspector", () =>
        shellStore.actions.setInspectorOpen(!shellStore.state.inspectorOpen),
      ),
      tauriBridge.subscribeMenuEvent("menu:open-palette", () =>
        shellStore.actions.setPaletteOpen(true),
      ),
      tauriBridge.subscribeMenuEvent("menu:open-settings", () =>
        shellStore.actions.setSettingsOpen(true),
      ),
      tauriBridge.subscribeMenuEvent("menu:open-about", () =>
        shellStore.actions.setAboutOpen(true),
      ),
    ];

    // Sync native window chrome with initial stored preference on mount.
    void tauriBridge.setNativeTheme(shellStore.state.themePreference);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onSchemeChange);
      window.removeEventListener("storage", onStorage);
      for (const unsub of unsubs) unsub();
    };
  }, [navigate]);

  return null;
}
