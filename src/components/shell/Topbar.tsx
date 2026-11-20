import { useRouterState } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { Moon, PanelLeft, PanelRight, Search, Settings, Sun } from "lucide-react";
import { routeTitleForPath } from "../../config/shell-config";
import { shellStore } from "../../stores/shell-store";

export function Topbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sidebarHidden = useSelector(shellStore, (s) => s.sidebarHidden);
  const inspectorOpen = useSelector(shellStore, (s) => s.inspectorOpen);
  const resolvedTheme = useSelector(shellStore, (s) => s.resolvedTheme);

  const routeLabel = routeTitleForPath(pathname);

  return (
    <header className="app-topbar" data-tauri-drag-region="">
      {/* Left: Sidebar toggle + active view breadcrumb */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => shellStore.actions.toggleSidebar()}
          aria-expanded={!sidebarHidden}
          aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
          title={sidebarHidden ? "Show sidebar — ⌘\\" : "Hide sidebar — ⌘\\"}
          className={`topbar-toggle grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors duration-150 ease-shell ${
            !sidebarHidden
              ? "bg-accent-soft text-accent-text"
              : "text-ink-muted hover:bg-fill-strong hover:text-ink-primary"
          }`}
        >
          <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <span className="pointer-events-none truncate rounded-md bg-fill-subtle px-2 py-0.5 text-xs font-semibold text-ink-soft">
          {routeLabel}
        </span>
      </div>

      {/* Center: Interactive Command Palette Search Pill */}
      <button
        type="button"
        onClick={() => shellStore.actions.setPaletteOpen(true)}
        aria-label="Open command palette"
        className="topbar-toggle flex h-7 w-[clamp(170px,28vw,300px)] items-center justify-between gap-2 rounded-full border border-line bg-surface-soft/80 px-3 text-xs text-ink-muted transition-colors duration-150 ease-shell hover:border-line-strong hover:bg-fill-hover hover:text-ink-primary"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search className="h-3 w-3 shrink-0 text-accent-text" aria-hidden="true" />
          <span className="truncate">Search or jump…</span>
        </span>
        <kbd className="shrink-0 rounded bg-fill-strong px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-faint">
          ⌘K
        </kbd>
      </button>

      {/* Right: Compact utility capsule */}
      <div
        role="group"
        aria-label="Workspace controls"
        className="flex shrink-0 items-center justify-self-end gap-1"
      >
        <button
          type="button"
          onClick={() => shellStore.actions.setInspectorOpen(!inspectorOpen)}
          aria-expanded={inspectorOpen}
          aria-label={inspectorOpen ? "Close inspector" : "Open inspector"}
          title="Toggle inspector — ⌘I"
          className={`topbar-toggle grid h-7 w-7 place-items-center rounded-lg transition-colors duration-150 ease-shell ${
            inspectorOpen
              ? "bg-accent-soft text-accent-text"
              : "text-ink-muted hover:bg-fill-strong hover:text-ink-primary"
          }`}
        >
          <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => shellStore.actions.quickToggleTheme()}
          aria-label={
            resolvedTheme === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          title={
            resolvedTheme === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          className="topbar-toggle grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors duration-150 ease-shell hover:bg-fill-strong hover:text-ink-primary"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={() => shellStore.actions.setSettingsOpen(true)}
          aria-label="Open Settings"
          title="Settings — ⌘,"
          className="topbar-toggle icon-spin-hover grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors duration-150 ease-shell hover:bg-fill-strong hover:text-ink-primary"
        >
          <Settings className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
