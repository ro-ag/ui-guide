import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { PanelBottom } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { StaggerItem, StaggerStage } from "../components/ui/MotionPrimitives";
import { RouteHeading } from "../components/ui/RouteHeading";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { SHELL_EASE } from "../lib/motion";
import { shellStore } from "../stores/shell-store";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceRoute,
});

function WorkspaceRoute() {
  const bottomDockOpen = useSelector(shellStore, (s) => s.bottomDockOpen);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7">
        <StaggerStage className="mx-auto max-w-4xl">
          <StaggerItem className="flex flex-wrap items-start justify-between gap-4">
            <RouteHeading
              eyebrow="Blank Canvas"
              title="Canvas"
              description="Drop your primary domain view here — board, editor, split pane, or data table — with a fluid AnimatePresence bottom dock."
            />
            <button
              type="button"
              onClick={() => shellStore.actions.toggleBottomDock()}
              className="btn-primary mt-1"
            >
              <PanelBottom className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {bottomDockOpen ? "Hide Bottom Dock" : "Open Bottom Dock"}
              </span>
            </button>
          </StaggerItem>

          <StaggerItem>
            <SpotlightCard className="grid min-h-[300px] place-items-center border-dashed p-8 text-center">
              <div className="relative z-10 max-w-sm">
                <p className="text-sm font-bold text-ink-primary">
                  Primary Workspace Canvas
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                  This frosted surface floats above the living aurora backdrop
                  while keeping the sidebar and topbar stationary during route
                  View Transitions.
                </p>
              </div>
            </SpotlightCard>
          </StaggerItem>
        </StaggerStage>
      </div>

      {/* Smooth AnimatePresence collapsible bottom dock */}
      <AnimatePresence initial={false}>
        {bottomDockOpen ? (
          <motion.section
            key="utility-dock"
            aria-label="Utility dock"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 184, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: SHELL_EASE }}
            className="flex shrink-0 flex-col overflow-hidden border-t border-line bg-dock backdrop-blur-xl shadow-[0_-12px_36px_var(--shadow-b)]"
          >
            <header className="flex h-10 shrink-0 items-center justify-between border-b border-line-subtle px-4">
              <span className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-accent-text uppercase">
                Utility Dock Slot
              </span>
              <button
                type="button"
                onClick={() => shellStore.actions.toggleBottomDock()}
                className="rounded-lg px-2 py-0.5 text-xs text-ink-muted transition-colors hover:bg-fill-strong hover:text-ink-primary"
              >
                Close
              </button>
            </header>
            <div className="flex min-h-0 flex-1 items-center justify-center p-4 font-mono text-xs text-ink-faint">
              Mount a console, log stream, output inspector, or embedded
              terminal here.
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
