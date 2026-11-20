import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import {
  Activity,
  Check,
  Command,
  Home,
  LayoutGrid,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { appInfoQueryOptions, starterItemsQueryOptions } from "../../lib/queries";
import { shellStore } from "../../stores/shell-store";
import { SidebarCollectionItem, SidebarNavItem } from "./SidebarItem";

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const selectedItemId = useSelector(shellStore, (s) => s.selectedItemId);
  const { data: appInfo } = useQuery(appInfoQueryOptions);
  const { data: items = [] } = useQuery(starterItemsQueryOptions);

  const featuredItem =
    items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;

  return (
    <aside className="app-sidebar" aria-label="Workspace navigation">
      {/* Empty 44px drag strip sitting beneath the inset macOS traffic lights. */}
      <div
        className="h-11 shrink-0"
        aria-hidden="true"
        data-tauri-drag-region=""
      />

      {/* Brand lockup with glowing vertical pill mark */}
      <div
        className="flex shrink-0 items-stretch gap-3 px-2 pt-1 pb-4"
        data-tauri-drag-region=""
      >
        <span className="brand-mark" aria-hidden="true" />
        <div className="grid min-w-0 content-center gap-0.5">
          <p className="m-0 text-[0.6875rem] leading-tight font-extrabold tracking-[0.16em] text-accent-text uppercase">
            Canvas Shell
          </p>
          <button
            type="button"
            onClick={() => shellStore.actions.setAboutOpen(true)}
            aria-label="About Tauri Canvas Shell"
            className="-ml-1.5 inline-flex min-h-6 justify-self-start items-center rounded px-1.5 font-mono text-xs font-bold text-ink-faint transition-colors duration-150 ease-shell hover:bg-fill-hover hover:text-ink-primary"
          >
            v{appInfo?.version ?? "0.1.0"}
          </button>
          <h1 className="m-0 truncate text-[1.0625rem] leading-tight font-bold tracking-[-0.022em] text-ink-primary">
            Starter App
          </h1>
        </div>
      </div>

      {/* Primary route navigation */}
      <nav className="grid shrink-0 gap-0.5" aria-label="Primary views">
        <SidebarNavItem
          to="/"
          label="Home"
          shortcut="⌘1"
          icon={<Home className="h-3.5 w-3.5" />}
          active={pathname === "/"}
        />
        <SidebarNavItem
          to="/workspace"
          label="Workspace"
          shortcut="⌘2"
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
          active={pathname === "/workspace"}
        />
        <SidebarNavItem
          to="/activity"
          label="Activity"
          shortcut="⌘3"
          icon={<Activity className="h-3.5 w-3.5" />}
          active={pathname === "/activity"}
        />
      </nav>

      {/* Scrollable secondary section (replace with your domain entities) */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col border-t border-line-subtle pt-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="m-0 text-[0.6875rem] font-extrabold tracking-[0.16em] text-ink-faint uppercase">
            Collections
          </p>
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {items.length}
          </span>
        </div>

        {/* Pinned recessed card outside the scroll list to prevent WebKit grid overlap */}
        {featuredItem ? (
          <section
            aria-label="Featured item"
            className="mb-2.5 shrink-0"
          >
            <p className="mb-1 px-2 text-[0.6875rem] font-extrabold tracking-[0.14em] text-ink-faint uppercase">
              Active
            </p>
            <div className="sidebar-featured-card">
              <div className="flex items-center justify-between gap-2">
                <p className="m-0 truncate text-xs font-bold text-ink-primary">
                  {featuredItem.title}
                </p>
                <button
                  type="button"
                  onClick={() => shellStore.actions.setInspectorOpen(true)}
                  aria-label={`Inspect ${featuredItem.title}`}
                  title="Inspect item (⌘I)"
                  className="icon-spin-hover flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-fill-strong hover:text-ink-primary"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <span className="mt-2 block h-[5px] overflow-hidden rounded-full bg-fill-strong">
                <span
                  className="progress-meter-fill"
                  style={{ width: `${featuredItem.progress}%` }}
                />
              </span>
              <p className="mt-1.5 truncate font-mono text-xs text-ink-muted tabular-nums">
                <span className="font-bold text-accent-text">
                  {featuredItem.progress}%
                </span>{" "}
                · {featuredItem.updatedAt}
              </p>
            </div>
          </section>
        ) : null}

        <div
          className="grid min-h-0 flex-1 content-start gap-0.5 overflow-y-auto overscroll-contain"
          role="list"
          aria-label="Starter collection items"
        >
          {items.map((item) => (
            <div key={item.id} role="listitem">
              <SidebarCollectionItem
                title={item.title}
                active={item.id === selectedItemId}
                settled={item.progress === 100}
                onSelect={() => shellStore.actions.selectItem(item.id)}
                trailing={
                  item.progress === 100 ? (
                    <span
                      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text"
                      aria-label="Complete"
                    >
                      <Check className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
                    </span>
                  ) : null
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom-pinned shell actions */}
      <div className="mt-3 grid shrink-0 gap-0.5 border-t border-line-subtle pt-3">
        <button
          type="button"
          onClick={() => shellStore.actions.setPaletteOpen(true)}
          title="Command Palette — ⌘K"
          className="sidebar-row"
        >
          <Command className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">Command Palette</span>
          <kbd className="font-mono text-[0.6875rem] text-ink-faint">⌘K</kbd>
        </button>

        <button
          type="button"
          onClick={() => shellStore.actions.setSettingsOpen(true)}
          title="Settings — ⌘,"
          className="sidebar-row"
        >
          <Settings className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">Settings</span>
          <kbd className="font-mono text-[0.6875rem] text-ink-faint">⌘,</kbd>
        </button>
      </div>
    </aside>
  );
}
