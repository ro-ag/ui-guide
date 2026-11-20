import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { PanelRight, Settings, Sparkles } from "lucide-react";
import { LayoutGroup } from "motion/react";
import { APP_BRAND, PRIMARY_NAV } from "../../config/shell-config";
import { appInfoQueryOptions, starterItemsQueryOptions } from "../../lib/queries";
import { shellStore } from "../../stores/shell-store";
import { SidebarCollectionItem, SidebarNavItem } from "./SidebarItem";

const DOT_TONES = ["bg-accent", "bg-info", "bg-todo", "bg-done"] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const selectedItemId = useSelector(shellStore, (s) => s.selectedItemId);
  const accent = useSelector(shellStore, (s) => s.accent);
  const { data: appInfo } = useQuery(appInfoQueryOptions);
  const { data: items = [] } = useQuery(starterItemsQueryOptions);

  const activeItem =
    items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;

  return (
    <aside className="app-sidebar" aria-label="Workspace navigation">
      {/* Empty 44px drag strip sitting beneath the inset macOS traffic lights. */}
      <div
        className="h-11 shrink-0"
        aria-hidden="true"
        data-tauri-drag-region=""
      />

      {/* Luminous Iridescent Squircle Brand Lockup */}
      <div
        className="mb-4 flex shrink-0 items-center gap-2.5 px-1.5"
        data-tauri-drag-region=""
      >
        <span className="brand-badge" aria-hidden="true">
          {APP_BRAND.monogram}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="m-0 truncate text-sm leading-tight font-bold tracking-[-0.02em] text-ink-primary">
              {APP_BRAND.name}
            </h1>
            <button
              type="button"
              onClick={() => shellStore.actions.setAboutOpen(true)}
              aria-label={`About ${APP_BRAND.name}`}
              className="inline-flex h-5 shrink-0 items-center rounded-full border border-line bg-fill px-1.5 font-mono text-[0.625rem] font-semibold text-ink-muted transition-colors duration-150 ease-shell hover:border-line-strong hover:text-ink-primary"
            >
              v{appInfo?.version ?? "0.1.0"}
            </button>
          </div>
          <p className="m-0 truncate text-[0.6875rem] text-ink-faint">
            {APP_BRAND.subtitle}
          </p>
        </div>
      </div>

      {/* Primary route navigation with spring-gliding active pill */}
      <LayoutGroup id="sidebar-nav">
        <nav className="grid shrink-0 gap-1" aria-label="Primary views">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarNavItem
                key={item.to}
                to={item.to}
                label={item.label}
                shortcut={item.shortcut}
                icon={<Icon className="h-3.5 w-3.5" />}
                active={pathname === item.to}
              />
            );
          })}
        </nav>
      </LayoutGroup>

      {/* Secondary section: Spaces + modular luminous gadget */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col border-t border-line-subtle pt-3.5">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="m-0 text-[0.6875rem] font-bold tracking-[0.12em] text-ink-faint uppercase">
            Spaces
          </p>
          <span className="rounded-full bg-fill px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-muted tabular-nums">
            {items.length}
          </span>
        </div>

        <LayoutGroup id="sidebar-spaces">
          <div
            className="grid min-h-0 flex-1 content-start gap-0.5 overflow-y-auto overscroll-contain"
            role="list"
            aria-label="Workspace spaces"
          >
            {items.map((item, idx) => {
              const dotClass = DOT_TONES[idx % DOT_TONES.length];
              return (
                <div key={item.id} role="listitem">
                  <SidebarCollectionItem
                    title={item.title}
                    active={item.id === selectedItemId}
                    onSelect={() => shellStore.actions.selectItem(item.id)}
                    trailing={
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${dotClass} opacity-90`}
                        aria-hidden="true"
                      />
                    }
                  />
                </div>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Modular Sidebar Gadget Slot — swap for profile, sync status, or telemetry */}
        {activeItem ? (
          <section aria-label="Active space gadget" className="mt-3 shrink-0">
            <div className="sidebar-gadget">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold text-accent-text">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  <span className="capitalize">{accent} aurora</span>
                </span>
                <button
                  type="button"
                  onClick={() => shellStore.actions.setInspectorOpen(true)}
                  className="rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold text-ink-muted transition-colors hover:bg-fill-strong hover:text-ink-primary"
                >
                  Inspect →
                </button>
              </div>
              <p className="mt-1.5 mb-0 truncate text-xs font-semibold text-ink-primary">
                {activeItem.title}
              </p>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-fill-strong">
                <span
                  className="progress-meter-fill"
                  style={{ width: `${activeItem.progress}%` }}
                />
              </span>
              <p className="mt-1.5 mb-0 truncate font-mono text-[0.6875rem] text-ink-faint tabular-nums">
                {activeItem.progress}% · {activeItem.updatedAt}
              </p>
            </div>
          </section>
        ) : null}
      </div>

      {/* Compact 2-action glass footer */}
      <div className="mt-3 grid shrink-0 grid-cols-2 gap-1.5 border-t border-line-subtle pt-3">
        <button
          type="button"
          onClick={() => shellStore.actions.setInspectorOpen(true)}
          title="Inspector — ⌘I"
          className="flex min-h-8 items-center justify-center gap-1.5 rounded-xl border border-line-subtle bg-fill-subtle px-2 text-xs font-semibold text-ink-muted transition-colors duration-150 ease-shell hover:border-line hover:bg-fill-hover hover:text-ink-primary"
        >
          <PanelRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Inspect</span>
        </button>

        <button
          type="button"
          onClick={() => shellStore.actions.setSettingsOpen(true)}
          title="Settings — ⌘,"
          className="icon-spin-hover flex min-h-8 items-center justify-center gap-1.5 rounded-xl border border-line-subtle bg-fill-subtle px-2 text-xs font-semibold text-ink-muted transition-colors duration-150 ease-shell hover:border-line hover:bg-fill-hover hover:text-ink-primary"
        >
          <Settings className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
