import { useSelector } from "@tanstack/react-store";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { shellStore } from "../../stores/shell-store";
import { AboutDialog } from "../overlays/AboutDialog";
import { CommandPalette } from "../overlays/CommandPalette";
import { InspectorDrawer } from "../overlays/InspectorDrawer";
import { SettingsDialog } from "../overlays/SettingsDialog";
import { ToastStack } from "../overlays/ToastStack";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { Sidebar } from "./Sidebar";
import { SidebarResizer } from "./SidebarResizer";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarHidden = useSelector(shellStore, (s) => s.sidebarHidden);
  const sidebarResizing = useSelector(shellStore, (s) => s.sidebarResizing);
  const reducedMotion = useSelector(shellStore, (s) => s.reducedMotion);

  const motionReducedPolicy =
    reducedMotion === "system" ? "user" : reducedMotion;

  return (
    <MotionConfig reducedMotion={motionReducedPolicy}>
      <KeyboardShortcuts />

      {/* Living 3-orb aurora backdrop visible directly behind the transparent sidebar
          and refracting softly through the frosted floating canvas. */}
      <div className="aurora-backdrop" aria-hidden="true">
        <div className="aurora-orb aurora-orb--1" />
        <div className="aurora-orb aurora-orb--2" />
        <div className="aurora-orb aurora-orb--3" />
      </div>

      <div
        className="app-shell"
        data-sidebar-hidden={sidebarHidden ? "true" : "false"}
        data-resizing={sidebarResizing ? "true" : undefined}
      >
        <Sidebar />
        <SidebarResizer />

        <div className="app-canvas">
          <Topbar />
          <main
            aria-label="Workspace content"
            className="canvas-route-stage min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            {children}
          </main>
        </div>
      </div>

      {/* Native top-layer overlays */}
      <SettingsDialog />
      <CommandPalette />
      <InspectorDrawer />
      <AboutDialog />
      <ToastStack />
    </MotionConfig>
  );
}
