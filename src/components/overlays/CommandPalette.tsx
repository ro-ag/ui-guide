import { useNavigate } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import {
  Activity,
  Home,
  LayoutGrid,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
  SunMoon,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { isReducedMotionDomActive } from "../../lib/motion";
import { shellStore } from "../../stores/shell-store";
import { NativeDialog } from "./NativeDialog";

interface PaletteCommand {
  id: string;
  group: "Navigate" | "Shell";
  label: string;
  hint: string;
  shortcut?: string;
  icon: ReactNode;
  run: () => void;
}

export function CommandPalette() {
  const open = useSelector(shellStore, (s) => s.paletteOpen);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const navigateWithTransition = (to: "/" | "/workspace" | "/activity") => {
    void navigate({
      to,
      viewTransition: !isReducedMotionDomActive(),
    });
  };

  const commands = useMemo<PaletteCommand[]>(
    () => [
      {
        id: "nav-home",
        group: "Navigate",
        label: "Go to Home",
        hint: "Overview of the empty shell & transition playground",
        shortcut: "⌘1",
        icon: <Home className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () => navigateWithTransition("/"),
      },
      {
        id: "nav-workspace",
        group: "Navigate",
        label: "Go to Workspace",
        hint: "Clean blank canvas + optional bottom dock",
        shortcut: "⌘2",
        icon: <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () => navigateWithTransition("/workspace"),
      },
      {
        id: "nav-activity",
        group: "Navigate",
        label: "Go to Activity",
        hint: "TanStack Query + Tauri IPC live data starter",
        shortcut: "⌘3",
        icon: <Activity className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () => navigateWithTransition("/activity"),
      },
      {
        id: "shell-sidebar",
        group: "Shell",
        label: "Toggle Sidebar",
        hint: "Collapse or expand the background-integrated sidebar",
        shortcut: "⌘\\",
        icon: <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () => shellStore.actions.toggleSidebar(),
      },
      {
        id: "shell-inspector",
        group: "Shell",
        label: "Toggle Inspector Drawer",
        hint: "Slide-over detail drawer with non-blurred scrim",
        shortcut: "⌘I",
        icon: <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () =>
          shellStore.actions.setInspectorOpen(
            !shellStore.state.inspectorOpen,
          ),
      },
      {
        id: "shell-theme",
        group: "Shell",
        label: "Toggle Color Theme",
        hint: "Switch between dark and light (reverts to System when matching OS)",
        icon: <SunMoon className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () => shellStore.actions.quickToggleTheme(),
      },
      {
        id: "shell-settings",
        group: "Shell",
        label: "Open Settings",
        hint: "Theme, density, reduced motion, and layout controls",
        shortcut: "⌘,",
        icon: <Settings className="h-3.5 w-3.5" aria-hidden="true" />,
        run: () => shellStore.actions.setSettingsOpen(true),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(normalized) ||
        cmd.hint.toLowerCase().includes(normalized) ||
        cmd.group.toLowerCase().includes(normalized),
    );
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const execute = (command: PaletteCommand | undefined) => {
    if (!command) return;
    shellStore.actions.setPaletteOpen(false);
    command.run();
  };

  return (
    <NativeDialog
      open={open}
      onClose={() => shellStore.actions.setPaletteOpen(false)}
      ariaLabel="Command palette"
      variant="palette"
    >
      <div className="flex items-center gap-2.5 border-b border-line-subtle px-4">
        <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((prev) =>
                filtered.length ? (prev + 1) % filtered.length : 0,
              );
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((prev) =>
                filtered.length
                  ? (prev - 1 + filtered.length) % filtered.length
                  : 0,
              );
            } else if (event.key === "Enter") {
              event.preventDefault();
              execute(filtered[activeIndex]);
            }
          }}
          placeholder="Jump to view or run shell command…"
          aria-label="Search commands"
          className="h-11 w-full bg-transparent text-sm text-ink-primary placeholder:text-[var(--placeholder)] focus-visible:shadow-none"
        />
      </div>

      <div
        role="listbox"
        aria-label="Command results"
        className="max-h-[min(340px,52vh)] overflow-y-auto p-2"
      >
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-xs text-ink-faint">
            No matching commands for “{query}”.
          </p>
        ) : (
          filtered.map((command, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={command.id}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => execute(command)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-shell ${
                  selected ? "bg-nav-active text-ink-primary" : "text-ink-soft"
                }`}
              >
                <span className="shrink-0 text-accent-text">
                  {command.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-ink-primary">
                    {command.label}
                  </span>
                  <span className="block truncate text-xs text-ink-faint">
                    {command.hint}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-line-subtle bg-fill px-2 py-0.5 text-[0.6875rem] font-bold tracking-[0.08em] text-ink-muted uppercase">
                  {command.group}
                </span>
                {command.shortcut ? (
                  <kbd className="shrink-0 font-mono text-[0.6875rem] text-ink-muted">
                    {command.shortcut}
                  </kbd>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </NativeDialog>
  );
}
