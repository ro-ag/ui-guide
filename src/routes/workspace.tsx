import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { PanelBottom } from "lucide-react";
import { RouteHeading } from "../components/ui/RouteHeading";
import { shellStore } from "../stores/shell-store";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceRoute,
});

function WorkspaceRoute() {
  const bottomDockOpen = useSelector(shellStore, (s) => s.bottomDockOpen);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <RouteHeading
              eyebrow="Blank Canvas"
              title="Workspace"
              description="Drop your primary domain view here — board, editor, split pane, or data table — with an optional collapsible bottom dock."
            />
            <button
              type="button"
              onClick={() => shellStore.actions.toggleBottomDock()}
              className="btn-secondary mt-1"
            >
              <PanelBottom className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{bottomDockOpen ? "Hide Bottom Dock" : "Show Bottom Dock"}</span>
            </button>
          </div>

          <div className="grid min-h-[280px] place-items-center rounded-xl border border-dashed border-line bg-surface-soft/60 p-8 text-center">
            <div className="max-w-sm">
              <p className="text-xs font-semibold text-ink-primary">
                Primary Workspace Slot
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                This area fills the inset rounded canvas while keeping the
                background sidebar and topbar pinned during View Transitions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional bottom utility dock slot (mirroring p-track's terminal dock layout) */}
      {bottomDockOpen ? (
        <section
          aria-label="Utility dock"
          className="flex h-44 shrink-0 flex-col border-t border-line bg-dock shadow-[0_-12px_32px_var(--shadow-b)]"
        >
          <header className="flex h-9 items-center justify-between border-b border-line-subtle px-4">
            <span className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-accent-text uppercase">
              Bottom Dock Slot
            </span>
            <button
              type="button"
              onClick={() => shellStore.actions.toggleBottomDock()}
              className="rounded px-2 py-0.5 text-xs text-ink-muted transition-colors hover:bg-fill-strong hover:text-ink-primary"
            >
              Close
            </button>
          </header>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4 font-mono text-xs text-ink-faint">
            Mount a console, log stream, output inspector, or embedded terminal
            here.
          </div>
        </section>
      ) : null}
    </div>
  );
}
