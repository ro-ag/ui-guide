import { useRouterState } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { Moon, PanelLeft, PanelRight, Search, Sun } from "lucide-react";
import { shellStore } from "../../stores/shell-store";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Home",
  "/workspace": "Workspace",
  "/activity": "Activity",
};

export function Topbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sidebarHidden = useSelector(shellStore, (s) => s.sidebarHidden);
  const inspectorOpen = useSelector(shellStore, (s) => s.inspectorOpen);
  const resolvedTheme = useSelector(shellStore, (s) => s.resolvedTheme);

  const routeLabel = ROUTE_TITLES[pathname] ?? "View";

  return (
    <header className="app-topbar" data-tauri-drag-region="">
      <div className="pointer-events-none flex min-w-0 items-center gap-2">
        <span className="truncate text-xs font-semibold text-ink-muted">
          {routeLabel}
        </span>
      </div>

      {/* Compact segmented panel controls cluster (matches p-track's topbar) */}
      <div
        role="group"
        aria-label="Workspace view controls"
        className="flex shrink-0 items-center gap-[3px] rounded-[9px] border border-line-subtle bg-fill-subtle p-[2px]"
      >
        <button
          type="button"
          onClick={() => shellStore.actions.toggleSidebar()}
          aria-expanded={!sidebarHidden}
          aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
          title={sidebarHidden ? "Show sidebar — ⌘\\" : "Hide sidebar — ⌘\\"}
          className={`topbar-toggle grid h-[26px] w-[28px] place-items-center rounded-md transition-colors duration-150 ease-shell ${
            !sidebarHidden
              ? "bg-accent-soft text-accent-text"
              : "text-ink-muted hover:bg-fill-strong hover:text-ink-primary"
          }`}
        >
          <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => shellStore.actions.setInspectorOpen(!inspectorOpen)}
          aria-expanded={inspectorOpen}
          aria-label={inspectorOpen ? "Close inspector" : "Open inspector"}
          title="Toggle inspector — ⌘I"
          className={`topbar-toggle grid h-[26px] w-[28px] place-items-center rounded-md transition-colors duration-150 ease-shell ${
            inspectorOpen
              ? "bg-accent-soft text-accent-text"
              : "text-ink-muted hover:bg-fill-strong hover:text-ink-primary"
          }`}
        >
          <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => shellStore.actions.setPaletteOpen(true)}
          aria-label="Open command palette"
          title="Command palette — ⌘K"
          className="topbar-toggle grid h-[26px] w-[28px] place-items-center rounded-md text-ink-muted transition-colors duration-150 ease-shell hover:bg-fill-strong hover:text-ink-primary"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        {/* Hairline separator sets the color-scheme control apart from layout toggles */}
        <span
          className="mx-0.5 h-3.5 w-px bg-line"
          aria-hidden="true"
        />

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
          className="topbar-toggle grid h-[26px] w-[28px] place-items-center rounded-md text-ink-muted transition-colors duration-150 ease-shell hover:bg-fill-strong hover:text-ink-primary"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
