import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { RotateCcw, X } from "lucide-react";
import { useState } from "react";
import type { ReducedMotionPreference } from "../../lib/motion";
import { appInfoQueryOptions } from "../../lib/queries";
import {
  type DensityPreference,
  type ThemePreference,
  readSystemTheme,
} from "../../lib/theme";
import { shellStore } from "../../stores/shell-store";
import { NativeDialog } from "./NativeDialog";

type SettingsSection = "appearance" | "layout" | "diagnostics";

const SECTIONS: Array<{ id: SettingsSection; label: string }> = [
  { id: "appearance", label: "Appearance" },
  { id: "layout", label: "Layout" },
  { id: "diagnostics", label: "Runtime" },
];

export function SettingsDialog() {
  const open = useSelector(shellStore, (s) => s.settingsOpen);
  const themePreference = useSelector(shellStore, (s) => s.themePreference);
  const density = useSelector(shellStore, (s) => s.density);
  const reducedMotion = useSelector(shellStore, (s) => s.reducedMotion);
  const sidebarWidth = useSelector(shellStore, (s) => s.sidebarWidth);
  const [section, setSection] = useState<SettingsSection>("appearance");
  const { data: appInfo } = useQuery(appInfoQueryOptions);

  const systemScheme = readSystemTheme();

  return (
    <NativeDialog
      open={open}
      onClose={() => shellStore.actions.setSettingsOpen(false)}
      ariaLabelledBy="settings-dialog-title"
      variant="settings"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line-strong px-6 py-4">
        <div>
          <p className="mb-1 text-[0.6875rem] font-extrabold tracking-[0.14em] text-ink-soft uppercase">
            Preferences
          </p>
          <h2
            id="settings-dialog-title"
            className="text-xl font-bold tracking-[-0.03em] text-ink-primary"
          >
            Settings
          </h2>
        </div>
        <button
          type="button"
          className="btn-secondary min-h-8 px-2.5"
          onClick={() => shellStore.actions.setSettingsOpen(false)}
          aria-label="Close Settings"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Close</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5 sm:flex-row">
        <nav
          aria-label="Settings sections"
          className="flex shrink-0 flex-row gap-1 sm:w-40 sm:flex-col"
        >
          {SECTIONS.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => setSection(item.id)}
                className={`flex min-h-9 items-center rounded-lg px-3 text-left text-xs transition-colors duration-150 ease-shell ${
                  active
                    ? "bg-accent-soft font-semibold text-ink-primary shadow-[inset_3px_0_0_var(--accent)]"
                    : "font-medium text-ink-soft hover:bg-fill-hover hover:text-ink-primary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {section === "appearance" ? (
            <div className="grid gap-1">
              <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
                Appearance &amp; Motion
              </p>

              <label className="grid grid-cols-1 items-center gap-2 border-b border-line-subtle py-3 sm:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <span className="block text-xs font-semibold text-ink-primary">
                    Color theme
                  </span>
                  <span className="block text-xs text-ink-muted">
                    Syncs CSS color-scheme and native window chrome.
                  </span>
                </div>
                <select
                  aria-label="Color theme"
                  value={themePreference}
                  onChange={(event) =>
                    shellStore.actions.setThemePreference(
                      event.target.value as ThemePreference,
                    )
                  }
                  className="h-9 rounded-lg border border-control-border bg-[var(--control-solid-bg)] px-2.5 text-xs font-medium text-ink-primary"
                >
                  <option value="system">
                    System (Currently {systemScheme})
                  </option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>

              <label className="grid grid-cols-1 items-center gap-2 border-b border-line-subtle py-3 sm:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <span className="block text-xs font-semibold text-ink-primary">
                    Interface density
                  </span>
                  <span className="block text-xs text-ink-muted">
                    Adjusts the shared spacing token scale across the shell.
                  </span>
                </div>
                <select
                  aria-label="Interface density"
                  value={density}
                  onChange={(event) =>
                    shellStore.actions.setDensity(
                      event.target.value as DensityPreference,
                    )
                  }
                  className="h-9 rounded-lg border border-control-border bg-[var(--control-solid-bg)] px-2.5 text-xs font-medium text-ink-primary"
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </label>

              <label className="grid grid-cols-1 items-center gap-2 border-b border-line-subtle py-3 sm:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <span className="block text-xs font-semibold text-ink-primary">
                    Reduced motion
                  </span>
                  <span className="block text-xs text-ink-muted">
                    Controls CSS spatial transforms, View Transitions, and
                    motion/mini.
                  </span>
                </div>
                <select
                  aria-label="Reduced motion"
                  value={reducedMotion}
                  onChange={(event) =>
                    shellStore.actions.setReducedMotion(
                      event.target.value as ReducedMotionPreference,
                    )
                  }
                  className="h-9 rounded-lg border border-control-border bg-[var(--control-solid-bg)] px-2.5 text-xs font-medium text-ink-primary"
                >
                  <option value="system">Follow OS preference</option>
                  <option value="always">Always reduce motion</option>
                  <option value="never">Always allow motion</option>
                </select>
              </label>
            </div>
          ) : null}

          {section === "layout" ? (
            <div className="grid gap-1">
              <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
                Window Shell Layout
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle py-3">
                <div>
                  <p className="text-xs font-semibold text-ink-primary">
                    Sidebar width
                  </p>
                  <p className="font-mono text-xs text-ink-muted">
                    Current: {sidebarWidth}px (range 180px–420px)
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    shellStore.actions.resetSidebarWidth();
                    shellStore.actions.pushToast(
                      "Sidebar width reset",
                      "Restored default 248px width.",
                      "info",
                    );
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset to 248px</span>
                </button>
              </div>
            </div>
          ) : null}

          {section === "diagnostics" ? (
            <div className="grid gap-1">
              <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
                Runtime Diagnostics
              </p>

              <dl className="divide-y divide-line-subtle text-xs">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-ink-muted">Application</dt>
                  <dd className="font-mono text-ink-primary">
                    {appInfo?.name ?? "Tauri Canvas Shell"}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-ink-muted">Version</dt>
                  <dd className="font-mono text-ink-primary">
                    v{appInfo?.version ?? "0.1.0"}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-ink-muted">Host Runtime</dt>
                  <dd className="font-mono text-accent-text">
                    {appInfo?.runtime === "tauri"
                      ? "Native Tauri v2"
                      : "Browser preview fallback"}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-ink-muted">Platform</dt>
                  <dd className="font-mono text-ink-primary">
                    {appInfo?.platform ?? "unknown"}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-line-strong bg-fill-subtle px-6 py-3 text-xs text-ink-muted">
        <span>Preferences persist immediately and sync pre-paint mirrors.</span>
        <button
          type="button"
          className="btn-primary min-h-8"
          onClick={() => shellStore.actions.setSettingsOpen(false)}
        >
          Done
        </button>
      </footer>
    </NativeDialog>
  );
}
